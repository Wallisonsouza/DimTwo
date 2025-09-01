import type { Vec2 } from "@engine/modules/2D/Vec2";
import type { Collider2D } from "./Collider2D";

export class Hit2D {
    constructor(
        public collider: Collider2D,
        public distance: number,
        public point: Vec2,
        public normal: Vec2
    ) { }
}