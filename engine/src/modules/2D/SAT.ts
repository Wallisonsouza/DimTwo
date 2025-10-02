import { Vec2 } from "@engine/core/math/Vec2";

export interface Contact2D {
  point: Vec2;
  normal: Vec2;
  penetration: number;
  impulse: Vec2;
}

export interface MovingPolygon {
  polygon: Vec2[];
  axes: Vec2[];
  velocity: Vec2; // deslocamento por frame
}

export class SAT {
  private static _projPointCache: Vec2 = Vec2.create();
  private static _projPolygonCache: Vec2 = Vec2.create();
  private static _edgeCache: Vec2 = Vec2.create();
  private static _edgeNormalCache: Vec2 = Vec2.create();

  private static readonly EPSILON = 1e-6;

  public static project(polygon: Vec2[], axis: Vec2, out: Vec2) {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    for (const v of polygon) {
      const p = Vec2.dot(v, axis);
      if (p < min) min = p;
      if (p > max) max = p;
    }
    out.set(min, max);
  }

  public static containsPoint(polygon: Vec2[], axes: Vec2[], point: Vec2): boolean {
    const projPoint = SAT._projPointCache;
    const projPolygon = SAT._projPolygonCache;

    for (let i = 0; i < axes.length; i++) {
      const axis = axes[i];
      const p = Vec2.dot(point, axis);
      projPoint.set(p, p);

      SAT.project(polygon, axis, projPolygon);

      if (projPoint.x < projPolygon.x - SAT.EPSILON || projPoint.x > projPolygon.y + SAT.EPSILON) {
        return false;
      }
    }

    return true;
  }

  public static closestEdgeNormal(point: Vec2, polygon: Vec2[], outNormal: Vec2): number {
    let minDist = Infinity;
    const edge = SAT._edgeCache;
    const edgeNormal = SAT._edgeNormalCache;

    for (let i = 0; i < polygon.length; i++) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];

      b.sub(a, edge);
      edge.perpendicular(edgeNormal);
      edgeNormal.normalizeInPlace();

      const pointToVertex = point.sub(a, edge);
      const dist = Vec2.dot(pointToVertex, edgeNormal);

      if (Math.abs(dist) < minDist) {
        minDist = Math.abs(dist);
        outNormal.copy(edgeNormal);
        if (dist < 0) outNormal.scaleInPlace(-1);
      }
    }

    return minDist;
  }

  // ------------------------------------------------------
  // Função de TOI corrigida para casos paralelos/alinhados
  // ------------------------------------------------------
  public static computeTimeOfImpact(a: MovingPolygon, b: MovingPolygon): number | null {
    let tEnter = 0;
    let tExit = 1;

    const axes = [...a.axes, ...b.axes];
    const projA = SAT._projPolygonCache;
    const projB = SAT._projPointCache;

    const relVel = b.velocity.sub(a.velocity);

    for (const axis of axes) {
      SAT.project(a.polygon, axis, projA);
      SAT.project(b.polygon, axis, projB);

      const relativeVel = Vec2.dot(relVel, axis);

      if (Math.abs(relativeVel) < SAT.EPSILON) {
        // Paralelo ou sem movimento relativo no eixo
        if (projA.y < projB.x - SAT.EPSILON || projB.y < projA.x - SAT.EPSILON) {
          return null; // sem colisão
        }
        // sobreposição inicial, considerar colisão instantânea
        tEnter = Math.max(tEnter, 0);
        tExit = Math.min(tExit, 1);
        continue;
      }

      const t0 = (projA.x - projB.y) / relativeVel;
      const t1 = (projA.y - projB.x) / relativeVel;

      const tMin = Math.min(t0, t1);
      const tMax = Math.max(t0, t1);

      tEnter = Math.max(tEnter, tMin);
      tExit = Math.min(tExit, tMax);

      if (tEnter - tExit > SAT.EPSILON) return null;
    }

    // Se os objetos estão sobrepostos no início (tEnter=0), ainda retorna 0
    return tEnter >= 0 && tEnter <= 1 ? tEnter : null;
  }


  // ------------------------------------------------------
  // Função CCD corrigida para evitar atravessamento
  // ------------------------------------------------------
  public static computeContactsCCD(
    a: MovingPolygon,
    b: MovingPolygon,
    outContacts: Contact2D[]
  ): boolean {
    // Primeiro, checar sobreposição inicial
    let hasInitialOverlap = SAT.computeContacts(a.polygon, b.polygon, a.axes, b.axes, outContacts);

    const toi = SAT.computeTimeOfImpact(a, b);

    // Se houver TOI, mover até colisão e calcular contatos
    if (toi !== null && toi > 0) {
      // Clonar polígonos antes de mover
      const origA = a.polygon.map(v => v.clone());
      const origB = b.polygon.map(v => v.clone());

      const moveA = a.velocity.clone().scaleInPlace(toi);
      const moveB = b.velocity.clone().scaleInPlace(toi);

      a.polygon.forEach((v, i) => v.copy(origA[i]).addInPlace(moveA));
      b.polygon.forEach((v, i) => v.copy(origB[i]).addInPlace(moveB));

      hasInitialOverlap = SAT.computeContacts(a.polygon, b.polygon, a.axes, b.axes, outContacts) || hasInitialOverlap;

      // Restaurar posições originais
      a.polygon.forEach((v, i) => v.copy(origA[i]));
      b.polygon.forEach((v, i) => v.copy(origB[i]));
    }

    return hasInitialOverlap;
  }



  public static computePolygonCenter(polygon: Vec2[]): Vec2 {
    const center = new Vec2(0, 0);
    for (const v of polygon) {
      center.addInPlace(v);
    }
    center.scaleInPlace(1 / polygon.length);
    return center;
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
        outNormal.copy(axis);
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

    const centerA = SAT.computePolygonCenter(aPolygon);
    const centerB = SAT.computePolygonCenter(bPolygon);

    const center = centerA.sub(centerB);

    if (center.dot(mtvNormal) > 0) {
      mtvNormal.scaleInPlace(-1);
    }

    for (const v of aPolygon) {
      if (SAT.containsPoint(bPolygon, bAxes, v)) {
        outContacts.push({
          impulse: Vec2.create(),
          point: v.clone(),
          normal: mtvNormal.clone(),
          penetration: mtvPenetration.value
        });
      }
    }

    for (const v of bPolygon) {
      if (SAT.containsPoint(aPolygon, aAxes, v)) {
        outContacts.push({
          impulse: Vec2.create(),
          point: v.clone(),
          normal: mtvNormal.clone(),
          penetration: mtvPenetration.value
        });
      }
    }

    return outContacts.length > 0;
  }
}
