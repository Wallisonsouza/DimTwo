import type { Vec2 } from "@engine/core/math/Vec2";
import { BoxCollider2D } from "./BoxCollider2D";
import type { Collider2D } from "./Collider2D";
import { SAT, type Contact2D } from "./SAT";

export class CollisionResolver2D {

  public static resolve(a: Collider2D, b: Collider2D, vA: Vec2, vB: Vec2, outContacts: Contact2D[]): boolean {

    if ((a instanceof BoxCollider2D) && (b instanceof BoxCollider2D)) {

      const aVertices = a.getVerticesTransformedToWorld();
      const bVertices = b.getVerticesTransformedToWorld();

      const aSat = {
        polygon: aVertices,
        axes: a.axes,
        velocity: vA
      }

      const bSat = {
        polygon: bVertices,
        axes: b.axes,
        velocity: vB
      }

      return SAT.computeContactsCCD(aSat, bSat, outContacts);

    }
    return false;
  }
}