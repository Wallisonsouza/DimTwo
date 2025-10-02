import type { GameEntity } from "@engine/core/base/GameEntity";
import { Vec2 } from "@engine/core/math/Vec2";
import type { Collider2D } from "./Collider2D";

export interface RaycastHit2D {
  point: Vec2;
  normal: Vec2;
  distance: number;
  polygon: Vec2[];
  collider: Collider2D;
  entity: GameEntity;
}


export class RayCast2D {

  public static segmentIntersection(p1: Vec2, p2: Vec2, q1: Vec2, q2: Vec2): Vec2 | null {
    const r = p2.sub(p1);
    const s = q2.sub(q1);
    const rxs = r.x * s.y - r.y * s.x;
    const q_p = q1.sub(p1);
    const qpxr = q_p.x * r.y - q_p.y * r.x;

    if (rxs === 0 && qpxr === 0) return null;
    if (rxs === 0 && qpxr !== 0) return null;

    const t = (q_p.x * s.y - q_p.y * s.x) / rxs;
    const u = (q_p.x * r.y - q_p.y * r.x) / rxs;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return new Vec2(p1.x + t * r.x, p1.y + t * r.y);
    }
    return null;
  }

  static rayCastOnPolygon(
    origin: Vec2,
    direction: Vec2,
    poly: Vec2[],
    maxDistance: number = Number.MAX_VALUE
  ): RaycastHit2D | null {
    const dir = direction.normalize();
    let closestHit: RaycastHit2D | null = null;

    const len = poly.length;

    for (let i = 0; i < len; i++) {
      const a = poly[i];
      const b = poly[(i + 1) % len];


      const rayEnd = origin.add(dir.scale(maxDistance));

      const hitPoint = RayCast2D.segmentIntersection(origin, rayEnd, a, b);
      if (!hitPoint) continue;

      const distance = hitPoint.sub(origin).length();
      if (distance > maxDistance) continue;

      if (!closestHit || distance < closestHit.distance) {
        const edge = b.sub(a);
        const normal = edge.perpendicular().normalizeInPlace();
        closestHit = {
          point: hitPoint,
          normal,
          distance,
          polygon: poly
        };
      }
    }

    return closestHit;
  }
}
