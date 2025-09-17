import { Vec2 } from "@engine/core/math/Vec2";
import { Vec3 } from "@engine/core/math/Vec3";
import { BoxCollider2D } from "./BoxCollider2D";
import { Collider2D } from "./Collider2D";
import { Hit2D } from "./Hit2D";
import { Plane } from "./Plane";

export class Physics2D {
  public static colliders: Collider2D[] = [];

  public static rayCast2D(rayOrigin: Vec3, rayDir: Vec3, maxDistance: number = Number.MAX_VALUE): Hit2D | null {
    let closestHit: Hit2D | null = null;

    for (const col of this.colliders) {
      const b = col.boundingBox;

      const plane = new Plane(new Vec3(0, 0, 1), new Vec3(0, 0, col.transform.position.z));

      const hitPoint = new Vec3();
      const t = plane.intersectRay(rayOrigin, rayDir, hitPoint);

      if (t === null || t > maxDistance) continue;

      const point2D = Vec2.fromVec3(hitPoint);

      if (b.containsPoint(point2D)) {
        const distance = Vec3.scale(rayDir, t, new Vec3(0, 0, 0)).length();
        const normal = this.calculateNormal(b, point2D);

        if (!closestHit || distance < closestHit.distance) {
          closestHit = new Hit2D(col, distance, point2D, normal);
        }
      }
    }

    return closestHit;
  }

  private static calculateNormal(bounds: { min: Vec2; max: Vec2 }, point: Vec2): Vec2 {
    const left = Math.abs(point.x - bounds.min.x);
    const right = Math.abs(point.x - bounds.max.x);
    const bottom = Math.abs(point.y - bounds.min.y);
    const top = Math.abs(point.y - bounds.max.y);

    const minDist = Math.min(left, right, bottom, top);
    if (minDist === left) return new Vec2(-1, 0);
    if (minDist === right) return new Vec2(1, 0);
    if (minDist === bottom) return new Vec2(0, -1);
    return new Vec2(0, 1);
  }

  public static computePenetration(
    a: BoxCollider2D,
    b: BoxCollider2D,
    outDir: Vec2,
    outDist: { value: number }
  ): boolean {

    const verticesA = a.getVerticesTransformedToWorld();
    const verticesB = b.getVerticesTransformedToWorld();

    const axes: Vec2[] = [
      a.transform.rightVector.xy,
      a.transform.upVector.xy,
      b.transform.rightVector.xy,
      b.transform.upVector.xy
    ];

    const penetration = { value: Number.POSITIVE_INFINITY };
    const normal = new Vec2();

    for (const axis of axes) {

    }

    // Garante direção A -> B
    const delta = Vec2.sub(a.transform.position.xy, b.transform.position.xy);
    if (Vec2.dot(delta, normal) < 0) normal.scaleInPlace(-1);

    // Atualiza saídas
    outDir.copy(normal);
    outDist.value = penetration.value;

    return true;
  }

}