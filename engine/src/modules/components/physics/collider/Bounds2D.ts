import { Vec2 } from "@engine/core/math/Vec2";

export class Bounds2D {
  public min: Vec2;
  public max: Vec2;

  constructor() {
    this.min = new Vec2();
    this.max = new Vec2();
  }

  public setFromCenterAndSize(center: Vec2, size: Vec2) {

    Vec2.divScalar(size, 2, this._halfSizeCache);

    this.min.x = center.x - this._halfSizeCache.x;
    this.min.y = center.y - this._halfSizeCache.y;

    this.max.x = center.x + this._halfSizeCache.x;
    this.max.y = center.y + this._halfSizeCache.y;

  }

  public intersects(other: Bounds2D) {
    return (
      this.min.x <= other.max.x &&
      this.max.x >= other.min.x &&
      this.min.y <= other.max.y &&
      this.max.y >= other.min.y
    );
  }

  public containsPoint(point: Vec2): boolean {
    return (
      point.x >= this.min.x &&
      point.x <= this.max.x &&
      point.y >= this.min.y &&
      point.y <= this.max.y
    );
  }


  private _halfSizeCache: Vec2 = new Vec2(0, 0);
}