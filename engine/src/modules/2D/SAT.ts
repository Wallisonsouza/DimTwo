import { Vec2 } from "@engine/core/math/Vec2";

export interface Contact2D {
  point: Vec2;
  normal: Vec2;
  penetration: number;
}

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
    outNormal?: Vec2,
    outPenetration?: { value: number }
  ): boolean {

    const projA = new Vec2();
    const projB = new Vec2();

    SAT.project(polygonA, axis, projA);
    SAT.project(polygonB, axis, projB);

    const overlap = Math.min(projA.y, projB.y) - Math.max(projA.x, projB.x);
    if (overlap <= 0) return false;


    if (outPenetration && overlap < outPenetration.value) {
      outPenetration.value = overlap;

      if (outNormal) {
        const centerA = (projA.x + projA.y) * 0.5;
        const centerB = (projB.x + projB.y) * 0.5;

        outNormal.copy(axis);
        if (centerA < centerB) outNormal.scaleInPlace(-1);
      }
    }

    return true;
  }

  public static intersects(aPolygon: Vec2[], bPolygon: Vec2[], aAxes: Vec2[], bAxes: Vec2[]) {

    for (let i = 0; i < aAxes.length; i++) {
      if (!SAT.testAxis(aAxes[i], aPolygon, bPolygon)) return false;
    }

    for (let i = 0; i < bAxes.length; i++) {
      if (!SAT.testAxis(bAxes[i], aPolygon, bPolygon)) return false;
    }

    return true;
  }

  public static containsPoint(polygon: Vec2[], axes: Vec2[], point: Vec2): boolean {
    const projPoint = new Vec2();
    const projPolygon = new Vec2();

    for (let i = 0; i < axes.length; i++) {
      const axis = axes[i];

      projPoint.x = projPoint.y = Vec2.dot(point, axis);
      SAT.project(polygon, axis, projPolygon);

      if (projPoint.x < projPolygon.x || projPoint.x > projPolygon.y) {
        return false;
      }
    }

    return true;
  }



  public static computeContacts(
    aPolygon: Vec2[],
    bPolygon: Vec2[],
    aAxes: Vec2[],
    bAxes: Vec2[],
    outContacts: Contact2D[]
  ): boolean {
    const mtvNormal = new Vec2();
    const mtvPenetration = { value: Number.POSITIVE_INFINITY };

    for (let i = 0; i < aAxes.length; i++) {
      if (!SAT.testAxis(aAxes[i], aPolygon, bPolygon, mtvNormal, mtvPenetration)) return false;
    }
    for (let i = 0; i < bAxes.length; i++) {
      if (!SAT.testAxis(bAxes[i], aPolygon, bPolygon, mtvNormal, mtvPenetration)) return false;
    }

    for (const v of aPolygon) {
      if (SAT.containsPoint(bPolygon, bAxes, v)) {
        outContacts.push({
          point: v.clone(),
          normal: mtvNormal.clone(),
          penetration: mtvPenetration.value
        });
      }
    }

    for (const v of bPolygon) {
      if (SAT.containsPoint(aPolygon, aAxes, v)) {
        outContacts.push({
          point: v.clone(),
          normal: mtvNormal.clone().scaleInPlace(-1),
          penetration: mtvPenetration.value
        });
      }
    }

    return outContacts.length > 0;
  }




  public static segmentIntersection(p1: Vec2, p2: Vec2, q1: Vec2, q2: Vec2): Vec2 | null {
    const r = Vec2.sub(p2, p1, new Vec2());
    const s = Vec2.sub(q2, q1, new Vec2());
    const rxs = r.x * s.y - r.y * s.x;
    const q_p = Vec2.sub(q1, p1, new Vec2());
    const qpxr = q_p.x * r.y - q_p.y * r.x;

    if (rxs === 0 && qpxr === 0) return null; // colineares
    if (rxs === 0 && qpxr !== 0) return null; // paralelos

    const t = (q_p.x * s.y - q_p.y * s.x) / rxs;
    const u = (q_p.x * r.y - q_p.y * r.x) / rxs;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return new Vec2(p1.x + t * r.x, p1.y + t * r.y);
    }
    return null;
  }


}

