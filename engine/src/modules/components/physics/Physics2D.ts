import type { Vec2 } from "@engine/core/math/Vec2";
import type { Collider2D } from "./collider/Collider2D";

export class Physics2D {
    public static colliders: Collider2D[] = [];

    public static rayCast2D(origin: Vec2, direction: Vec2, maxDistance: number = Number.MAX_VALUE): { collider: Collider2D; distance: number } | null {
        let closestHit: { collider: Collider2D; distance: number } | null = null;

        for (const collider of Physics2D.colliders) {
            if (!collider.bounds) continue; 

            collider.updateBounds(collider.transform.position);

            const distance = collider.bounds.rayIntersects(origin, direction);
            if (distance !== null && distance <= maxDistance) {
                if (!closestHit || distance < closestHit.distance) {
                    closestHit = { collider, distance };
                }
            }
        }

        return closestHit;
    }
}
