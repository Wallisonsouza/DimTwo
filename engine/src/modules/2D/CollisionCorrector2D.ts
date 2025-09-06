import { Vec2 } from "@engine/core/math/Vec2";
import { Vec3 } from "@engine/core/math/Vec3";
import type { CollisionPair2D } from "./CollisionPair2D";
import type { CollisionResolution2D } from "./CollisionResolver2D";
import { PhysicsMath2D } from "./PhysicsMath2D";
import { BodyType, type RigidBody2D } from "./RigidBody2D";

export class CollisionCorrector2D {

  public static apply(
    pair: CollisionPair2D,
    resolution: CollisionResolution2D,
    deltaTime: number = 1 / 60
  ) {
    const { aRigid, bRigid } = pair;

    const matA = pair.a.physicsMaterial;
    const matB = pair.b.physicsMaterial;


    const aMass = aRigid?.mass ?? 1;
    const bMass = bRigid?.mass ?? 1;

    let aFactor = 0, bFactor = 0;

    const aDynamic = aRigid && aRigid.bodyType !== BodyType.Static;
    const bDynamic = bRigid && bRigid.bodyType !== BodyType.Static;

    if (aDynamic && bDynamic) {
      const total = aMass + bMass;
      aFactor = bMass / total;
      bFactor = aMass / total;
    } else if (aDynamic) {
      aFactor = 1;
    } else if (bDynamic) {
      bFactor = 1;
    } else {
      aFactor = 0;
      bFactor = 0;
    }
















    const normal = Vec2.normalize(resolution.normal);

    const correction = Vec2.scale(normal, resolution.penetration.magnitude);
    pair.a.transform.position.addInPlace(Vec3.fromVec2(Vec2.scale(correction, aFactor)));
    pair.b.transform.position.addInPlace(Vec3.fromVec2(Vec2.scale(correction, -bFactor)));

    const restitution = Math.max(matA.restitution, matB.restitution);
    const muStatic = (matA.staticFriction + matB.staticFriction) / 2;
    const muKinetic = (matA.dynamicFriction + matB.dynamicFriction) / 2;

    const [aNormalForce, bNormalForce] = PhysicsMath2D.normalForceFromPenetration(
      resolution.penetration.magnitude,
      aMass,
      bMass,
      deltaTime
    );

    const normalB = Vec2.scale(normal, -1);

    if (aRigid) {
      this.correctVelocity(aRigid, normal, restitution);

      const accelFrictionA = PhysicsMath2D.contactFriction(
        aRigid.linearVelocity,
        normal,
        aRigid.mass,
        aNormalForce,
        muStatic,
        muKinetic,
        deltaTime
      );

      aRigid.linearVelocity.addInPlace(
        Vec2.scale(accelFrictionA, deltaTime)
      );
    }

    if (bRigid) {
      this.correctVelocity(bRigid, normalB, restitution);

      const accelFrictionB = PhysicsMath2D.contactFriction(
        bRigid.linearVelocity,
        normalB,
        bRigid.mass,
        bNormalForce,
        muStatic,
        muKinetic,
        deltaTime
      );

      bRigid.linearVelocity.addInPlace(
        Vec2.scale(accelFrictionB, deltaTime)
      );
    }

  }

  public static correctVelocity(rigid: RigidBody2D | null, normal: Vec2, restitution: number = 0) {
    if (!rigid || rigid.bodyType) return;
    const vn = Vec2.dot(rigid.linearVelocity, normal);
    if (vn < 0) {
      rigid.linearVelocity.subInPlace(
        Vec2.scale(normal, vn * (1 + restitution))
      );
    }
  }

}
