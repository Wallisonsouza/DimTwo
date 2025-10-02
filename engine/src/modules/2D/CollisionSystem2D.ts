import { Mathf } from "@engine/core/math/Mathf";
import { Quat } from "@engine/core/math/quat";
import { Vec2 } from "@engine/core/math/Vec2";
import { Vec3 } from "@engine/core/math/Vec3";
import { EngineConfig } from "@engine/global/EngineConfig";
import { SpatialHash } from "../../core/algorithms/SpatialHash";
import { System } from "../../core/base/System";
import { ComponentGroup } from "../enums/ComponentGroup";
import { ComponentType } from "../enums/ComponentType";
import type { Collider2D } from "./Collider2D";
import { CollisionPair2D } from "./CollisionPair2D";
import { CollisionResolver2D } from "./CollisionResolver2D";
import { PhysicsMath2D } from "./PhysicsMath2D";
import { BodyType, ForceMode, RigidBody2D } from "./RigidBody2D";
import type { Contact2D } from "./SAT";

export class CollisionSystem2D extends System {


  private spatialHash = new SpatialHash<Collider2D>(64);
  private checked: Set<number> = new Set();

  private previousCollisions: Map<number, CollisionPair2D> = new Map();
  private currentCollisions: Map<number, CollisionPair2D> = new Map();

  fixedUpdate() {
    const colliders = this.engine.components.getAllByGroup<Collider2D>(ComponentGroup.Collider);
    this.prepareSpatialHash(colliders);
    this.collectCollisionPairs();

    const rigidbodies = this.engine.components.getAllByGroup<RigidBody2D>(ComponentGroup.RigidBody2D);
    const gravityVector = Vec2.mul(Vec2.Down, EngineConfig.PHYSICS.gravity);

    // --- Integração de movimento ---
    for (const rigid of rigidbodies) {
      if (!rigid.enabled || rigid.isSleeping) continue;

      if (rigid.useGravity) {
        const gravityOffset = Vec2.scale(gravityVector, rigid.gravityScale);
        rigid.linearAcceleration.addInPlace(gravityOffset);
      }

      // converte as forças em aceleração
      const forcesAccel = PhysicsMath2D.forceToAcceleration(rigid.forces, rigid.mass);
      rigid.linearAcceleration.addInPlace(forcesAccel);

      // ---- Linear ----
      const pos2D = rigid.transform.position.toVec2();
      if (!rigid.freezePosition) {
        PhysicsMath2D.integrateEulerSemiImplicit(
          rigid.linearVelocity,
          rigid.linearAcceleration,
          pos2D,
          this.engine.time.fixedDeltaTime
        );
        rigid.transform.position.set(pos2D.x, pos2D.y, 0);
      } else {
        rigid.linearVelocity.set(0, 0);
      }

      // ---- Angular ----
      if (!rigid.freezeRotation) {
        rigid.angularVelocity += rigid.angularAcceleration * this.engine.time.fixedDeltaTime;
        const deltaRot = Quat.fromRad(0, 0, rigid.angularVelocity * this.engine.time.fixedDeltaTime);
        Quat.multiply(rigid.transform.rotation, deltaRot, rigid.transform.rotation);
      } else {
        rigid.angularVelocity = 0;
      }

      // reset forças e acelerações
      rigid.forces.set(0, 0);
      rigid.linearAcceleration.set(0, 0);
      rigid.angularAcceleration = 0;
    }

    // --- Solver global (estilo Unity/Box2D) ---
    this.solveAllCollisions();



    // --- Eventos Stay ---
    for (const pair of this.currentCollisions.values()) {
      if (!pair.contacts) continue;

      if (!pair.isTrigger) {
        this.engine.systems.callCollisionStayEvents({
          a: pair.a,
          b: pair.b,
          contacts: pair.contacts
        });
      } else {
        this.engine.systems.callTriggerStayEvents({ a: pair.a, b: pair.b });
      }
    }

    // --- Eventos Exit ---
    for (const [key, pair] of this.previousCollisions) {
      if (!this.currentCollisions.has(key)) {
        if (pair.isTrigger) {
          this.engine.systems.callTriggerExitEvents({ a: pair.a, b: pair.b });
        } else {
          this.engine.systems.callCollisionExitEvents({ a: pair.a, b: pair.b });
        }
      }
    }

    // swap maps
    this.previousCollisions = new Map(this.currentCollisions);
    this.currentCollisions.clear();
  }

  private prepareSpatialHash(colliders: Collider2D[]) {
    this.spatialHash.clear();
    this.checked.clear();
    for (const collider of colliders) {
      if (!collider.enabled) continue;
      const bounds = collider.boundingBox;
      this.spatialHash.insert(bounds.min, bounds.max, collider);
    }
  }

  private collectCollisionPairs() {
    for (const bucket of this.spatialHash.getBuckets()) {
      for (let i = 0; i < bucket.length; i++) {
        const a = bucket[i];
        const aRigid = this.engine.components.getComponent<RigidBody2D>(a.gameEntity, ComponentType.RigidBody2D);
        if (!aRigid) continue;

        for (let j = i + 1; j < bucket.length; j++) {
          const b = bucket[j];
          const bRigid = this.engine.components.getComponent<RigidBody2D>(b.gameEntity, ComponentType.RigidBody2D);
          if (!bRigid) continue;

          const pair = new CollisionPair2D(a, b, aRigid, bRigid);
          if (this.checked.has(pair.key)) continue;
          this.checked.add(pair.key);

          const contacts: Contact2D[] = [];
          const t = this.engine.time.fixedDeltaTime;
          const vA = aRigid.linearVelocity.scale(t);
          const vB = bRigid.linearVelocity.scale(t);
          const collided = CollisionResolver2D.resolve(a, b, vA, vB, contacts);

          if (!collided) continue;

          pair.contacts = contacts;
          pair.isTrigger = a.isTrigger || b.isTrigger;
          a.contacts = contacts;
          b.contacts = contacts;


          if (!this.previousCollisions.has(pair.key)) {
            if (pair.isTrigger) {
              this.engine.systems.callTriggerEnterEvents({ a, b });
            } else {
              this.engine.systems.callCollisionEnterEvents({ a, b, contacts });
            }
          }

          this.currentCollisions.set(pair.key, pair);
        }
      }
    }
  }

  private solveAllCollisions(velocityIterations: number = 8, positionIterations: number = 3) {
    const pairs = Array.from(this.currentCollisions.values());

    // --- Velocity solver ---
    for (let i = 0; i < velocityIterations; i++) {

      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];

        if (!pair.contacts) continue;
        this.applyVelocitySolver(pair);
      }

    }

    // --- Position solver ---
    for (let i = 0; i < positionIterations; i++) {
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];

        if (!pair.contacts) continue;
        this.applyPositionSolver(pair);
      }
    }
  }

  private applyVelocitySolver(pair: CollisionPair2D) {
    const contacts = pair.contacts;
    if (!contacts) return;

    const aRigid = pair.aRigid;
    const bRigid = pair.bRigid;

    const Ia = aRigid.getMomentOfInertia();
    const Ib = bRigid.getMomentOfInertia();

    const restitution = Mathf.max(pair.a.physicsMaterial.restitution, pair.b.physicsMaterial.restitution);
    const friction = Mathf.max(pair.a.physicsMaterial.dynamicFriction, pair.b.physicsMaterial.dynamicFriction);

    for (const contact of contacts) {
      const normal = contact.normal;
      const point = contact.point;

      const ra = point.sub(aRigid.getCenterOfMass());
      const rb = point.sub(bRigid.getCenterOfMass());

      const impulse = PhysicsMath2D.computeImpulse(
        ra, rb,
        aRigid.getPointVelocity(point),
        bRigid.getPointVelocity(point),
        normal,
        aRigid.mass, bRigid.mass,
        Ia, Ib,
        restitution,
        friction
      );

      if (!impulse) continue;

      if (!aRigid.isSleeping && aRigid.bodyType !== BodyType.Static) {
        aRigid.addForce(impulse.scale(-1), ForceMode.Impulse);
        aRigid.addTorque(ra.cross(impulse.scale(-1)), ForceMode.Impulse);
      }
      if (!bRigid.isSleeping && bRigid.bodyType !== BodyType.Static) {
        bRigid.addForce(impulse, ForceMode.Impulse);
        bRigid.addTorque(rb.cross(impulse), ForceMode.Impulse);
      }
    }
  }

  private applyPositionSolver(pair: CollisionPair2D) {
    const contacts = pair.contacts;
    if (!contacts) return;

    const aRigid = pair.aRigid;
    const bRigid = pair.bRigid;
    const percent = 0.2;
    const slop = 0.01;

    for (const contact of contacts) {
      if (contact.penetration <= slop) continue;

      const normal = contact.normal;
      const penetration = contact.penetration;

      const totalMass = aRigid.mass + bRigid.mass;
      const correctionMag = (Math.max(penetration - slop, 0) / totalMass) * percent;
      const correction = normal.scale(correctionMag);

      if (!aRigid.isSleeping && aRigid.bodyType !== BodyType.Static && !aRigid.freezePosition) {
        aRigid.transform.position.subInPlace(Vec3.fromVec2(correction.scale(bRigid.mass)));
      }
      if (!bRigid.isSleeping && bRigid.bodyType !== BodyType.Static && !bRigid.freezePosition) {
        bRigid.transform.position.addInPlace(Vec3.fromVec2(correction.scale(aRigid.mass)));
      }
    }
  }
}
