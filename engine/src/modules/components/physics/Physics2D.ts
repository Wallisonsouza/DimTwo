import { Vec2 } from "@engine/core/math/Vec2";
import { Vec3 } from "@engine/core/math/Vec3";
import type { Collider2D } from "./collider/Collider2D";
import { Hit2D } from "./Hit2D";

export class Plane {
    public normal: Vec3;
    public point: Vec3;

    constructor(normal: Vec3, point: Vec3) {
        this.normal = Vec3.normalize(normal);
        this.point = point.clone();
    }

    public intersectRay(rayOrigin: Vec3, rayDir: Vec3, outPoint?: Vec3): number | null {
        const denom = Vec3.dot(this.normal, rayDir);
        if (Math.abs(denom) < 1e-6) {
            return null;
        }

        const diff = Vec3.sub(this.point, rayOrigin);
        const t = Vec3.dot(diff, this.normal) / denom;

        if (t < 0) return null;

        if (outPoint) {
            outPoint.set(
                rayOrigin.x + rayDir.x * t,
                rayOrigin.y + rayDir.y * t,
                rayOrigin.z + rayDir.z * t
            );
        }

        return t;
    }
}

export class Physics2D {
    public static colliders: Collider2D[] = [];

    public static rayCast2D(rayOrigin: Vec3, rayDir: Vec3, maxDistance: number = Number.MAX_VALUE): Hit2D | null {
        let closestHit: Hit2D | null = null;

        for (const col of this.colliders) {
            col.updateBounds(col.transform.position.toVec2(), col.transform.scale.toVec2());
            const b = col.bounds;

            const plane = new Plane(new Vec3(0, 0, 1), new Vec3(0, 0, col.transform.position.z));

            const hitPoint = new Vec3();
            const t = plane.intersectRay(rayOrigin, rayDir, hitPoint);

            if (t === null || t > maxDistance) continue;

            const point2D = hitPoint.toVec2();

            if (b.containsPoint(point2D)) {
                const distance = rayDir.clone().scale(t).length();
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
}
