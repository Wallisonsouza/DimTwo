import { Vec2 } from "@engine/core/math/Vec2";
import { ComponentGroup } from "../enums/ComponentGroup";
import { ComponentType } from "../enums/ComponentType";
import { Bounds2D } from "./Bounds2D";
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


  public getSweptBounds(start: Vec2, end: Vec2): Bounds2D {
    const bounds = this.getBounds();
    const halfSize = Vec2.sub(bounds.max, bounds.min).scale(0.5);

    const a = Vec2.sub(start, halfSize);
    const b = Vec2.sub(end, halfSize);

    const min = new Vec2(
      Math.min(a.x, b.x),
      Math.min(a.y, b.y)
    );

    const max = new Vec2(
      Math.max(a.x + halfSize.x * 2, b.x + halfSize.x * 2),
      Math.max(a.y + halfSize.y * 2, b.y + halfSize.y * 2)
    );

    const swept = new Bounds2D();
    swept.min = min;
    swept.max = max;
    return swept;
  }

  public getBoundsAt(position: Vec2): Bounds2D {

    const worldCenter = new Vec2(
      this.center.x + position.x,
      this.center.y + position.y
    );

    const scaledSize = new Vec2(
      this.size.x * this.transform.scale.x,
      this.size.y * this.transform.scale.y
    );

    return new Bounds2D(worldCenter, scaledSize);
  }
}