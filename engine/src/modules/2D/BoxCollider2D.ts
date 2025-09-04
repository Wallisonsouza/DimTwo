import { Vec2 } from "@engine/core/math/Vec2";
import { ComponentType } from "../enums/ComponentType";
import { Bounds2D } from "./Bounds2D";
import { Collider2D, type Collider2DOptions } from "./Collider2D";

export interface BoxCollider2DOptions extends Collider2DOptions { }

export class BoxCollider2D extends Collider2D {

  constructor(options?: BoxCollider2DOptions) {
    super(ComponentType.BoxCollider2D, options);
  }

  intersects(other: Collider2D): boolean {
    const bounds = this.getBounds();
    const otherBounds = other.getBounds();
    return bounds.intersects(otherBounds);
  }

  public getResolution(aBounds: Bounds2D, bBounds: Bounds2D): Vec2 {

    const overlapX = Math.min(aBounds.max.x, bBounds.max.x) - Math.max(aBounds.min.x, bBounds.min.x);
    const overlapY = Math.min(aBounds.max.y, bBounds.max.y) - Math.max(aBounds.min.y, bBounds.min.y);

    if (overlapX <= 0 || overlapY <= 0) return new Vec2(0, 0);

    if (overlapX < overlapY) {
      return new Vec2(aBounds.min.x < bBounds.min.x ? -overlapX : overlapX, 0);
    } else {
      return new Vec2(0, aBounds.min.y < bBounds.min.y ? -overlapY : overlapY);
    }
  }
  clone(): BoxCollider2D {
    const clone = new BoxCollider2D();

    this.copyBase(clone);
    return clone;
  }
}