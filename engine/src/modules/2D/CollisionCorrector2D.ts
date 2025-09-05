import { Vec2 } from "@engine/core/math/Vec2";
import { Vec3 } from "@engine/core/math/Vec3";
import type { CollisionPair2D } from "./CollisionPair2D";
import type { CollisionResolution2D } from "./CollisionResolver2D";
import { PhysicsMath2D } from "./PhysicsMath2D";
import type { RigidBody2D } from "./RigidBody2D";

export class CollisionCorrector2D {

  public static apply(
    pair: CollisionPair2D,
    resolution: CollisionResolution2D,
    deltaTime: number = 1 / 60
  ) {
    const { aRigid, bRigid } = pair;

    const matA = pair.a.physicsMaterial;
    const matB = pair.b.physicsMaterial;

    const aStatic = !aRigid || aRigid.isStatic || !aRigid.useGravity;
    const bStatic = !bRigid || bRigid.isStatic || !bRigid.useGravity;

    const aMass = aRigid?.mass ?? 1;
    const bMass = bRigid?.mass ?? 1;

    let aFactor = 0, bFactor = 0;
    if (!aStatic && !bStatic) {
      const total = aMass + bMass;
      aFactor = bMass / total;
      bFactor = aMass / total;
    } else if (!aStatic) aFactor = 1;
    else if (!bStatic) bFactor = 1;

    const normal = Vec2.normalize(resolution.normal);

    const correction = Vec2.scale(normal, resolution.penetration.magnitude);
    pair.a.transform.position.addInPlace(Vec3.fromVec2(Vec2.scale(correction, aFactor)));
    pair.b.transform.position.addInPlace(Vec3.fromVec2(Vec2.scale(correction, -bFactor)));

    const restitution = Math.max(matA.restitution, matB.restitution);


    const muStatic = Math.sqrt(matA.staticFriction * matB.staticFriction);
    const muKinetic = Math.sqrt(matA.dynamicFriction * matB.dynamicFriction);

    const [aNormalForce, bNormalForce] = PhysicsMath2D.normalForceFromPenetration(
      resolution.penetration.magnitude,
      aMass,
      bMass,
      deltaTime
    );
    const normalB = normal.scale(-1);

    if (aRigid) {
      this.correctVelocity(aRigid, normal, restitution);

      const accelFrictionA = PhysicsMath2D.contactFriction(
        aRigid.velocity,
        normal,
        aRigid.mass,
        aNormalForce,
        muStatic,
        muKinetic,
        deltaTime
      );

      aRigid.velocity.addInPlace(accelFrictionA.scale(deltaTime));
    }

    if (bRigid) {
      this.correctVelocity(bRigid, normalB, restitution);

      const accelFrictionB = PhysicsMath2D.contactFriction(
        bRigid.velocity,
        normalB,
        bRigid.mass,
        bNormalForce,
        muStatic,
        muKinetic,
        deltaTime
      );

      bRigid.velocity.addInPlace(accelFrictionB.scale(deltaTime));
    }

  }

  public static correctVelocity(rigid: RigidBody2D | null, normal: Vec2, restitution: number = 0) {
    if (!rigid || rigid.isStatic) return;
    const vn = Vec2.dot(rigid.velocity, normal);
    if (vn < 0) {
      rigid.velocity.subInPlace(normal.scale(vn * (1 + restitution)));
    }
  }

}
