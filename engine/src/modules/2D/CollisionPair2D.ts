import type { Collider2D } from "./Collider2D";
import type { RigidBody2D } from "./RigidBody2D";

export class CollisionPair2D {
  a: Collider2D;
  b: Collider2D;
  aRigid: RigidBody2D | null;
  bRigid: RigidBody2D | null;
  key: number;

  constructor(a: Collider2D, b: Collider2D, aRigid: RigidBody2D | null = null, bRigid: RigidBody2D | null = null) {
    this.a = a;
    this.b = b;
    this.aRigid = aRigid;
    this.bRigid = bRigid;
    const aId = a.id.getValue();
    const bId = b.id.getValue();
    this.key = CollisionPair2D.makeKey(aId, bId);
  }

  static makeKey(idA: number, idB: number) {
    const a = idA < idB ? idA : idB;
    const b = idA < idB ? idB : idA;
    return ((a + b) * (a + b + 1)) / 2 + b;
  }
}