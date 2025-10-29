import { Vec2 } from "../../core/math/Vec2";

export class Bounds2D {
  public min: Vec2;
  public max: Vec2;
  public size: Vec2;
  public center: Vec2;
  public extents: Vec2;

  constructor(center?: Vec2, size?: Vec2) {
    this.center = center ? center.clone() : new Vec2();
    this.size = size ? size.clone() : new Vec2();
    this.extents = new Vec2(this.size.x / 2, this.size.y / 2);
    this.min = new Vec2(this.center.x - this.extents.x, this.center.y - this.extents.y);
    this.max = new Vec2(this.center.x + this.extents.x, this.center.y + this.extents.y);
  }

  public updateWithOffset(localCenter: Vec2, size: Vec2, position: Vec2, scale: Vec2) {
    this.center.x = localCenter.x + position.x;
    this.center.y = localCenter.y + position.y;

    this.size.x = size.x * scale.x;
    this.size.y = size.y * scale.y;

    this.extents.x = this.size.x / 2;
    this.extents.y = this.size.y / 2;

    this.min.x = this.center.x - this.extents.x;
    this.min.y = this.center.y - this.extents.y;

    this.max.x = this.center.x + this.extents.x;
    this.max.y = this.center.y + this.extents.y;
  }

  public intersects(other: Bounds2D): boolean {
    return !(this.max.x < other.min.x || this.min.x > other.max.x || this.max.y < other.min.y || this.min.y > other.max.y);
  }

  public containsPoint(point: Vec2): boolean {
    return point.x >= this.min.x && point.x <= this.max.x && point.y >= this.min.y && point.y <= this.max.y;
  }

  public static timeOfImpact(a: Bounds2D, aDelta: Vec2, b: Bounds2D, bDelta: Vec2): number | null {
    let tEnter = 0;
    let tExit = 1;

    const vRelX = aDelta.x - bDelta.x;
    if (vRelX === 0) {
      if (a.max.x < b.min.x || b.max.x < a.min.x) return null;
    } else {
      const t1x = (b.min.x - a.max.x) / vRelX;
      const t2x = (b.max.x - a.min.x) / vRelX;
      tEnter = Math.max(tEnter, Math.min(t1x, t2x));
      tExit = Math.min(tExit, Math.max(t1x, t2x));
      if (tEnter > tExit || tExit < 0 || tEnter > 1) return null;
    }

    const vRelY = aDelta.y - bDelta.y;
    if (vRelY === 0) {
      if (a.max.y < b.min.y || b.max.y < a.min.y) return null;
    } else {
      const t1y = (b.min.y - a.max.y) / vRelY;
      const t2y = (b.max.y - a.min.y) / vRelY;
      tEnter = Math.max(tEnter, Math.min(t1y, t2y));
      tExit = Math.min(tExit, Math.max(t1y, t2y));
      if (tEnter > tExit || tExit < 0 || tEnter > 1) return null;
    }

    return tEnter >= 0 && tEnter <= 1 ? tEnter : null;
  }
}