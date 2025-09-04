import { Vec2 } from "@engine/core/math/Vec2";
import { Vec3 } from "@engine/core/math/Vec3";
import type { CollisionPair2D } from "./CollisionPair2D";
import type { CollisionResolution2D } from "./CollisionResolver2D";
import type { RigidBody2D } from "./RigidBody2D";

export class CollisionCorrector2D {

  public static apply(
    pair: CollisionPair2D,
    resolution: CollisionResolution2D
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

    const correction = Vec2.scale(resolution.normal, resolution.penetration.magnitude);
    pair.a.transform.position.addInPlace(Vec3.fromVec2(Vec2.scale(correction, aFactor)));
    pair.b.transform.position.addInPlace(Vec3.fromVec2(Vec2.scale(correction, -bFactor)));

    const restitution = Math.max(matA.restitution, matB.restitution);
    const friction = Math.sqrt(matA.dynamicFriction * matB.dynamicFriction);

    if (aRigid) {
      this.correctVelocity(aRigid, resolution.normal, restitution);
      this.applyFriction(aRigid, resolution.normal, friction);
    }

    if (bRigid) {
      this.correctVelocity(bRigid, resolution.normal.scale(-1), restitution);
      this.applyFriction(bRigid, resolution.normal.scale(-1), friction);
    }

  }

  public static correctVelocity(rigid: RigidBody2D | null, normal: Vec2, restitution: number = 0) {
    if (!rigid || rigid.isStatic) return;
    const vn = Vec2.dot(rigid.velocity, normal);
    if (vn < 0) {
      rigid.velocity.subInPlace(normal.scale(vn * (1 + restitution)));
    }
  }

  public static applyFriction(
    rigid: RigidBody2D | null,
    normal: Vec2,
    friction: number
  ) {
    if (!rigid || rigid.isStatic) return;

    const vn = Vec2.dot(rigid.velocity, normal);
    const normalVel = normal.scale(vn);
    const tangentVel = rigid.velocity.sub(normalVel);

    const tMag = tangentVel.magnitude;
    if (tMag === 0) return;

    const tangentDir = Vec2.normalize(tangentVel);
    const maxImpulse = tMag;

    let frictionImpulseMag = tMag * friction;

    if (frictionImpulseMag > maxImpulse) {
      frictionImpulseMag = maxImpulse;
    }

    const frictionImpulse = tangentDir.scale(-frictionImpulseMag);
    rigid.velocity.addInPlace(frictionImpulse);
  }

}
