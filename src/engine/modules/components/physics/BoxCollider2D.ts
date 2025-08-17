/* import { distanceSq, getBoundsCenterInto, getBoxOverlapInto, getClosestPoint, getSeparationDirection, type Bounds } from "../../../core/math/geometry/Bounds";
import { Vec2 } from "../../../core/math/Vec2";
import { Vec3 } from "../../../core/math/Vec3";
import { ComponentType } from "../../enums/ComponentType";
import { Collider } from "./collider/types";

export class BoxCollider2D extends Collider {
  size: Vec3;


  constructor() {
    super(ComponentType.BoxCollider2D, ComponentType.Collider);
    this.size = new Vec3(1, 1, 0);
  }

  static VEC2_CACHE: Vec2 = new Vec2();

  public static testBoxBoxOverlap(a: Bounds, b: Bounds): boolean {
    if (a.right <= b.left) return false;
    if (a.left >= b.right) return false;
    if (a.bottom <= b.top) return false;
    if (a.top >= b.bottom) return false;

    return true;
  }

  public static testBoxCircleOverlap(
    boxBounds: Bounds,
    circlePos: Vec2,
    circleRadius: number
  ): boolean {

    getClosestPoint(boxBounds, circlePos, this.VEC2_CACHE);
    const distSq = distanceSq(circlePos, this.VEC2_CACHE);
    return distSq <= (circleRadius * circleRadius);
  }

  private static _overlap = new Vec2();
  private static _centerA = new Vec2();
  private static _centerB = new Vec2();

  private static closestPointResult: Vec2 = { x: 0, y: 0 };
  private static delta: Vec2 = { x: 0, y: 0 };
  private static normal: Vec2 = { x: 0, y: 0 };

  public static resolveBoxBoxOverlap(
    a: Bounds,
    b: Bounds
  ): Vec2 | null {

    getBoxOverlapInto(a, b, this._overlap);

    if (this._overlap.x <= 0 || this._overlap.y <= 0) return null;

    getBoundsCenterInto(a, this._centerA);
    getBoundsCenterInto(b, this._centerB);

    if (this._overlap.x < this._overlap.y) {
      return { x: getSeparationDirection(this._centerA.x, this._centerB.x, this._overlap.x), y: 0 };
    } else {
      return { x: 0, y: getSeparationDirection(this._centerA.y, this._centerB.y, this._overlap.y) };
    }
  }

  public static resolveBoxCircleOverlap(
    boxBounds: Bounds,
    circlePos: Vec2,
    circleRadius: number
  ): Vec2 | null {
    getClosestPoint(boxBounds, circlePos, this.closestPointResult);

    Vec2.subtract(circlePos, this.closestPointResult, this.delta);

    const distSq = Vec2.length(this.delta);

    if (distSq >= circleRadius * circleRadius) return null;

    const dist = Math.sqrt(distSq) || 0.0001;

    Vec2.normalize(this.delta, this.normal);

    const overlap = circleRadius - dist;

    return {
      x: -this.normal.x * overlap,
      y: -this.normal.y * overlap,
    };
  }




}
 */