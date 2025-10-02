import type { Collider2D } from "./Collider2D";
import type { RigidBody2D } from "./RigidBody2D";
import type { Contact2D } from "./SAT";

export class CollisionPair2D {
  a: Collider2D;
  b: Collider2D;
  aRigid: RigidBody2D;
  bRigid: RigidBody2D;
  key: number;
  contacts: Contact2D[] | null = null;
  isTrigger: boolean = false;

  constructor(a: Collider2D, b: Collider2D, aRigid: RigidBody2D,
    bRigid: RigidBody2D) {
    this.a = a;
    this.b = b;
    const aId = a.id.getValue();
    const bId = b.id.getValue();
    this.key = CollisionPair2D.makeKey(aId, bId);
    this.aRigid = aRigid;
    this.bRigid = bRigid;

  }

  static makeKey(idA: number, idB: number) {
    const a = idA < idB ? idA : idB;
    const b = idA < idB ? idB : idA;
    return ((a + b) * (a + b + 1)) / 2 + b;
  }
}