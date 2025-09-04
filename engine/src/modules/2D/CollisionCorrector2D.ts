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

    const restitution = Math.max(
      pair.a.physicsMaterial?.restitution ?? 0,
      pair.b.physicsMaterial?.restitution ?? 0
    );

    this.correctVelocity(aRigid, resolution.normal, restitution);
    this.correctVelocity(bRigid, resolution.normal.scale(-1), restitution);
  }

  public static correctVelocity(rigid: RigidBody2D | null, normal: Vec2, restitution: number = 0) {
    if (!rigid || rigid.isStatic) return;
    const vn = Vec2.dot(rigid.velocity, normal);
    if (vn < 0) {
      rigid.velocity.subInPlace(normal.scale(vn * (1 + restitution)));
    }
  }
}
