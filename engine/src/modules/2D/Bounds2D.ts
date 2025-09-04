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

  getBoundAt(position: Vec2): Bounds2D {
    return new Bounds2D(position, this.size);
  }

  public intersects(other: Bounds2D): boolean {
    return !(this.max.x < other.min.x || this.min.x > other.max.x || this.max.y < other.min.y || this.min.y > other.max.y);
  }

  public containsPoint(point: Vec2): boolean {
    return point.x >= this.min.x && point.x <= this.max.x && point.y >= this.min.y && point.y <= this.max.y;
  }
}
