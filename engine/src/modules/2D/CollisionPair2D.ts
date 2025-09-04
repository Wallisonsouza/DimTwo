import type { Vec2 } from "@engine/core/math/Vec2";
import type { Collider2D } from "./Collider2D";

export class CollisionPair2D {
  a: Collider2D;
  b: Collider2D;
  key: number;
  resolution?: Vec2;
  toi?: number;

  constructor(a: Collider2D, b: Collider2D) {
    this.a = a;
    this.b = b;
    const aId = a.id.getValue();
    const bId = b.id.getValue();
    this.key = CollisionPair2D.makeKey(aId, bId);
  }

  static makeKey(idA: number, idB: number) {
    const a = idA < idB ? idA : idB;
    const b = idA < idB ? idB : idA;
    return ((a + b) * (a + b + 1)) / 2 + b;
  }

  setResolution(resolution: Vec2) {
    this.resolution = resolution;
  }

  setTOI(toi: number) {
    this.toi = toi;
  }
}