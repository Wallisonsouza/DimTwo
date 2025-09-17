import { Vec2 } from "@engine/core/math/Vec2";

export class SAT {

  public static project(polygon: Vec2[], axis: Vec2, out: Vec2) {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    for (const v of polygon) {
      const p = Vec2.dot(v, axis);
      if (p < min) min = p;
      if (p > max) max = p;
    }
    out.x = min;
    out.y = max;
  }

  public static testAxis(
    axis: Vec2,
    polygonA: Vec2[],
    polygonB: Vec2[],
    outNormal: Vec2,
    outPenetration: { value: number }
  ): boolean {

    const projA = new Vec2();
    const projB = new Vec2();

    SAT.project(polygonA, axis, projA);
    SAT.project(polygonB, axis, projB);

    const overlap = Math.min(projA.y, projB.y) - Math.max(projA.x, projB.x);
    if (overlap <= 0) return false;

    if (overlap < outPenetration.value) {
      outPenetration.value = overlap;
      outNormal.copy(axis);
    }
    return true;
  }



}

