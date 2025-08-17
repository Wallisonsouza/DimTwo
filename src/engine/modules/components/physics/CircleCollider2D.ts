/* import { distanceSq, EPSILON, getClosestPoint, type Bounds } from "../../../core/math/geometry/Bounds";
import { Vec2 } from "../../../core/math/Vec2";
import { ComponentType } from "../../enums/ComponentType";
import { Collider } from "./collider/types";

export class CircleCollider2D extends Collider {
  radius: number;

  constructor() {
    super(ComponentType.CircleCollider2D, ComponentType.Collider);
    this.radius = 0.5;
  }


  static _tmp = {
    delta: { x: 0, y: 0 },
  };
  static closestPointResult: Vec2 = { x: 0, y: 0 };
  static delta: Vec2 = { x: 0, y: 0 };
  static normal: Vec2 = { x: 0, y: 0 };


  public static resolveCircleCircleOverlap(
    aPos: Vec2,
    aRadius: number,
    bPos: Vec2,
    bRadius: number
  ): Vec2 | null {

    if (aRadius <= 0 || bRadius <= 0) return null;

    Vec2.subtract(bPos, aPos, this._tmp.delta);
    const distSq = Vec2.lengthSquared(this._tmp.delta);

    const radiiSum = aRadius + bRadius;
    if (distSq >= radiiSum * radiiSum) return null;

    const dist = Math.sqrt(distSq) || EPSILON;
    const overlap = radiiSum - dist;

    return {
      x: -(this._tmp.delta.x / dist) * overlap,
      y: -(this._tmp.delta.y / dist) * overlap
    };
  }

  //!!!!!!!!!!!! importate ----------------
  // lempre disso no projeto, tive 2 hora de erro por conta disso

  // para resolucao entre circle box o vetor e positivo
  // para resolucao entre box circle e negatico
  public static resolveCircleBoxOverlap(

    circlePos: Vec2,
    circleRadius: number,
    boxBounds: Bounds
  ): Vec2 | null {
    getClosestPoint(boxBounds, circlePos, this.closestPointResult);

    Vec2.subtract(circlePos, this.closestPointResult, this.delta);

    const distSq = Vec2.lengthSquared(this.delta);

    if (distSq >= circleRadius * circleRadius) return null;

    let dist = Math.sqrt(distSq);
    if (dist === 0) dist = EPSILON;

    Vec2.normalize(this.delta, this.normal);

    const overlap = circleRadius - dist;

    return {
      x: this.normal.x * overlap,
      y: this.normal.y * overlap,
    };
  }

  static VEC2_CACHE: Vec2 = new Vec2();

  public static testCircleCircleOverlap(aPos: Vec2, aRadius: number, bPos: Vec2, bRadius: number): boolean {
    if (aRadius <= 0 || bRadius <= 0) return false;

    const distSq = distanceSq(bPos, aPos);
    const radiusSum = aRadius + bRadius;

    return distSq <= radiusSum * radiusSum;
  }

  public static testCircleBoxOverlap(
    circlePos: Vec2,
    circleRadius: number,
    boxBounds: Bounds
  ): boolean {

    getClosestPoint(boxBounds, circlePos, this.VEC2_CACHE);
    const distSq = distanceSq(circlePos, this.VEC2_CACHE);
    return distSq <= (circleRadius * circleRadius);
  }




} */