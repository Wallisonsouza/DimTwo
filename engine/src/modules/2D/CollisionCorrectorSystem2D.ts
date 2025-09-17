import { System, type CollisionEvent2D } from "@engine/core/base/System";
import { Vec2 } from "@engine/core/math/Vec2";
import { Vec3 } from "@engine/core/math/Vec3";
import { PhysicsMath2D } from "./PhysicsMath2D";
import { RigidBody2D } from "./RigidBody2D";


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

    const matA = a.physicsMaterial;
    const matB = b.physicsMaterial;

    const aRigid = collisionEvent2D.aRigid;
    const bRigid = collisionEvent2D.bRigid;
    const contact = collisionEvent2D.contacts[0];

    const aMass = aRigid?.mass || 1;
    const bMass = bRigid?.mass || 1;

    a.transform.position.addInPlace(Vec3.fromVec2(Vec2.scale(contact.normal, contact.penetration - 1e-6)));
    this.correctVelocity(aRigid, contact.normal);


    const muStatic = (matA.staticFriction + matB.staticFriction) / 2;
    const muKinetic = (matA.dynamicFriction + matB.dynamicFriction) / 2;


    if (aRigid && bRigid) {
      const normalForce = PhysicsMath2D.applyNormalImpulseTwoBodies(
        aRigid.linearVelocity,
        aMass,
        bRigid.linearVelocity,
        bMass,
        contact.normal,
        contact.penetration
      );

    }


    /* const accelFrictionA = PhysicsMath2D.contactFriction(
      aRigid.linearVelocity,
      contact.normal,
      aMass,
      normalForce.vA.y,
      muStatic,
      muKinetic,
      this.engine.time.fixedDeltaTime
    );
    aRigid.linearVelocity.subInPlace(Vec2.scale(accelFrictionA, this.engine.time.fixedDeltaTime));
 */

  }




}