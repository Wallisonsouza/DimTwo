import { Vec2 } from "@engine/core/math/Vec2";
import { ComponentGroup } from "../enums/ComponentGroup";
import { ComponentType } from "../enums/ComponentType";
import { Collider2D, type Collider2DOptions } from "./Collider2D";

export interface BoxCollider2DOptions extends Collider2DOptions { }

export class BoxCollider2D extends Collider2D {

  constructor(options?: BoxCollider2DOptions) {
    super(ComponentType.BoxCollider2D, ComponentGroup.Collider, options);
  }

  clone(): BoxCollider2D {
    const clone = new BoxCollider2D();

    this.copyBase(clone);
    return clone;
  }

  intersects(other: Collider2D): boolean {
    if (other instanceof BoxCollider2D) {
      return this.bounds.intersects(other.bounds);
    }
    return false;
  }

  public static calculateResolution(a: BoxCollider2D, b: BoxCollider2D): Vec2 {
    const overlapX = Math.min(a.bounds.max.x, b.bounds.max.x) - Math.max(a.bounds.min.x, b.bounds.min.x);
    const overlapY = Math.min(a.bounds.max.y, b.bounds.max.y) - Math.max(a.bounds.min.y, b.bounds.min.y);

    if (overlapX <= 0 || overlapY <= 0) return new Vec2(0, 0);

    if (overlapX < overlapY) {
      const moveX = a.bounds.min.x < b.bounds.min.x ? -overlapX : overlapX;
      return new Vec2(moveX, 0);
    } else {
      const moveY = a.bounds.min.y < b.bounds.min.y ? -overlapY : overlapY;
      return new Vec2(0, moveY);
    }
  }



}
