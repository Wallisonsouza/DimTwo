import { System, type CollisionEvent2D } from "@engine/core/base/System";
import { Index } from "@engine/core/math/vec";
import { Vec2 } from "@engine/core/math/Vec2";
import { Vec3 } from "@engine/core/math/Vec3";
import { ComponentType } from "../enums/ComponentType";
import { PhysicsMath2D } from "./PhysicsMath2D";
import { RigidBody2D } from "./RigidBody2D";

function vec2ToVec3InPlace(v: Vec2, out: Vec3) {
  out.data[Index.X] = v.data[Index.X];
  out.data[Index.Y] = v.data[Index.Y];
  out.data[Index.Z] = 0;
  return out;
}

export class CollisionCorrector2D extends System {
  /*  private static _PENETRATION_CACHE: Vec2 = new Vec2();
 private static _POSITION_CACHE: Vec3 = new Vec3();
 private static _NORMAL_CACHE: Vec2 = new Vec2();
 

public static apply(
   pair: CollisionPair2D,
   resolution: CollisionResolution2D,
 ) {
   const { aRigid, bRigid } = pair;
   if (!aRigid && !bRigid) return;
 
   const aMass = aRigid?.mass ?? 1;
   const bMass = bRigid?.mass ?? 1;
 
   // --- 1) Correção de posição (MTV distribuída nas penetrações)
   if (aRigid && aRigid.bodyType !== BodyType.Static) {
     const factor = bMass / (aMass + bMass);
     for (const p of resolution.penetrations) {
       Vec2.scale(p, factor, this._PENETRATION_CACHE);
       vec2ToVec3InPlace(this._PENETRATION_CACHE, this._POSITION_CACHE);
       aRigid.transform.position.subInPlace(this._POSITION_CACHE);
     }
     Vec2.negative(resolution.normal, this._NORMAL_CACHE);
     this.correctVelocity(aRigid, this._NORMAL_CACHE);
 
 
     for (const point of pair.a.contacts) {
 
       const r = aRigid.getOffsetToCenterOfMass(point);
 
       // força peso
       const weightForce = PhysicsMath2D.weightForce(aRigid.mass, EngineConfig.PHYSICS.gravity);
 
       // torque escalar
       const torque = Vec2.cross(r, Vec2.negative(weightForce, new Vec2()));
 
 
       // momento de inércia relativo ao ponto de contato
       const I = aRigid.getMomentOfInertiaAbout(point);
 
       // impulso angular (aplicar uma vez)
       const angularImpulse = torque / I;
 
       aRigid.addTorque(angularImpulse, ForceMode.Impulse);
     }
   }
 
   if (bRigid && bRigid.bodyType !== BodyType.Static) {
     const factor = aMass / (aMass + bMass);
     Vec2.scale(resolution.mtv, factor, this._PENETRATION_CACHE);
     vec2ToVec3InPlace(this._PENETRATION_CACHE, this._POSITION_CACHE);
     bRigid.transform.position.addInPlace(this._POSITION_CACHE);
     this.correctVelocity(aRigid, resolution.normal);
   }
 } */

  private correctVelocity(rigid: RigidBody2D | null, normal: Vec2, restitution: number = 0) {
    if (!rigid || rigid.bodyType) return;
    const vn = Vec2.dot(rigid.linearVelocity, normal);
    if (vn < 0) {
      rigid.linearVelocity.subInPlace(
        Vec2.scale(normal, vn * (1 + restitution))
      );
    }
  }

  onCollisionStay2D(collisionEvent2D: CollisionEvent2D): void {

    const a = collisionEvent2D.a;
    const b = collisionEvent2D.b;

    const contact = collisionEvent2D.contacts[0];


    const aRigid = this.engine.components.getComponent<RigidBody2D>(a.gameEntity, ComponentType.RigidBody2D);
    const bRigid = this.engine.components.getComponent<RigidBody2D>(b.gameEntity, ComponentType.RigidBody2D);

    const aMass = aRigid?.mass || 1;
    const bMass = bRigid?.mass || 1;

    const factor = bMass / (aMass + bMass);

    a.transform.position.addInPlace(Vec3.fromVec2(Vec2.scale(contact.normal, contact.penetration - 1e-6)));
    this.correctVelocity(aRigid, contact.normal);




    /* 
        if (!aRigid) return;
        if (Mathf.abs(contact.penetration) <= 1e-3) return;
    
        aRigid.addTorqueAtPoint(new Vec2(1, 1), new Vec2(1, 1), ForceMode.Impulse);
     */

    const matA = a.physicsMaterial;
    const matB = b.physicsMaterial;

    if (!aRigid || !bRigid) return;


    const muStatic = (matA.staticFriction + matB.staticFriction) / 2;
    const muKinetic = (matA.dynamicFriction + matB.dynamicFriction) / 2;


    const normalForce = PhysicsMath2D.applyNormalImpulseTwoBodies(
      aRigid.lastLinearVelocity,
      aMass,
      bRigid.lastLinearVelocity,
      bMass,
      contact.normal,
      contact.penetration
    );

    console.log(normalForce)



    const accelFrictionA = PhysicsMath2D.contactFriction(
      aRigid.lastLinearVelocity,
      contact.normal,
      aMass,
      normalForce.vA.y,
      muStatic,
      muKinetic,
      this.engine.time.fixedDeltaTime
    );
    aRigid.linearVelocity.subInPlace(Vec2.scale(accelFrictionA, this.engine.time.fixedDeltaTime));

    aRigid.lastLinearVelocity.set(0, 0);

  }




}