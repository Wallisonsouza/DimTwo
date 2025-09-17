import { BoxCollider2D } from "./BoxCollider2D";
import type { Collider2D } from "./Collider2D";
import { SAT, type Contact2D } from "./SAT";

export class CollisionResolver2D {

  public static resolve(a: Collider2D, b: Collider2D, outContacts: Contact2D[]): boolean {

    if ((a instanceof BoxCollider2D) && (b instanceof BoxCollider2D)) {

      const aVertices = a.getVerticesTransformedToWorld();
      const bVertices = b.getVerticesTransformedToWorld();

      return SAT.computeContacts(aVertices, bVertices, a.axes, b.axes, outContacts);
    }
    return false;
  }
}