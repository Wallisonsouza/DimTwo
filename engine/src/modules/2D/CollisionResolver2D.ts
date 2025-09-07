import { Vec2 } from "@engine/core/math/Vec2";
import type { Engine } from "@engine/Engine";
import { BoxCollider2D } from "./BoxCollider2D";
import type { Collider2D } from "./Collider2D";

export interface CollisionResolution2D {
  penetration: Vec2;
  normal: Vec2;
  time: number;
}

export class CollisionResolver2D {

  public static getResolutionFactor(engine: Engine, a: Collider2D, b: Collider2D) {

    if (a instanceof BoxCollider2D && b instanceof BoxCollider2D) {
      return CollisionResolver2D.getBoxBoxCollision(a, b);
    }

    return null;
  }


  public static getBoxBoxCollision(
    a: BoxCollider2D,
    b: BoxCollider2D
  ): CollisionResolution2D | null {
    const result = a.intersects(b);
    if (!result) return null;

    const { normal, overlap } = result;
    const penetration = Vec2.scale(normal, overlap);

    return {
      normal,
      penetration,
      time: 0
    };
  }
}
