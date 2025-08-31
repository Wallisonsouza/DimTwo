import type { Vec2 } from "@engine/core/math/Vec2";
import type { Collider2D } from "./collider/Collider2D";

export class Hit2D {
    constructor(
        public collider: Collider2D,
        public distance: number,
        public point: Vec2,
        public normal: Vec2
    ) { }
}