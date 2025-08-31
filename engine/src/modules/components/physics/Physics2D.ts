import { Vec2 } from "@engine/core/math/Vec2";
import type { Vec3 } from "@engine/core/math/Vec3";
import type { Collider2D } from "./collider/Collider2D";

export class Hit2D {
    constructor(
        public collider: Collider2D,
        public distance: number,
        public point: Vec2,
        public normal: Vec2
    ) { }
}

export class Physics2D {
    public static colliders: Collider2D[] = [];

    /** Raycast 2D estilo Unity usando direção Z */
    public static rayCast2D(rayOrigin: Vec3, rayDir: Vec3, maxDistance: number = Number.MAX_VALUE): Hit2D | null {
        let closestHit: Hit2D | null = null;

        for (const col of this.colliders) {
            col.updateBounds(
                col.transform.position.toVec2(),
                col.transform.scale.toVec2()
            );
            const b = col.bounds;


            const planeZ = col.transform.position.z;

            const t = (planeZ - rayOrigin.z) / rayDir.z;


            if (t < 0 || t > maxDistance) continue;


            const point = new Vec2(
                rayOrigin.x + rayDir.x * t,
                rayOrigin.y + rayDir.y * t
            );


            if (
                point.x >= b.min.x && point.x <= b.max.x &&
                point.y >= b.min.y && point.y <= b.max.y
            ) {
                const distance = rayDir.clone().scale(t).length();
                const normal = Physics2D.calculateNormal(b, point);

                if (!closestHit || distance < closestHit.distance) {
                    closestHit = new Hit2D(col, distance, point, normal);
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
