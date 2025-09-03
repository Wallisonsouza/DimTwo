import { Vec2 } from "@engine/core/math/Vec2";

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

  public setFromCenterAndSize(center: Vec2, size: Vec2) {
    this.center = center.clone();
    this.size = size.clone();
    this.extents = new Vec2(size.x / 2, size.y / 2);
    this.min = new Vec2(center.x - this.extents.x, center.y - this.extents.y);
    this.max = new Vec2(center.x + this.extents.x, center.y + this.extents.y);
  }

  public setMinMax(min: Vec2, max: Vec2) {
    this.min = min.clone();
    this.max = max.clone();
    this.center = new Vec2((min.x + max.x) / 2, (min.y + max.y) / 2);
    this.size = new Vec2(max.x - min.x, max.y - min.y);
    this.extents = new Vec2(this.size.x / 2, this.size.y / 2);
  }

  public intersects(other: Bounds2D): boolean {
    return !(this.max.x < other.min.x || this.min.x > other.max.x || this.max.y < other.min.y || this.min.y > other.max.y);
  }

  public containsPoint(point: Vec2): boolean {
    return point.x >= this.min.x && point.x <= this.max.x && point.y >= this.min.y && point.y <= this.max.y;
  }

  public encapsulatePoint(point: Vec2) {
    const minX = Math.min(this.min.x, point.x);
    const minY = Math.min(this.min.y, point.y);
    const maxX = Math.max(this.max.x, point.x);
    const maxY = Math.max(this.max.y, point.y);
    this.setMinMax(new Vec2(minX, minY), new Vec2(maxX, maxY));
  }
}
