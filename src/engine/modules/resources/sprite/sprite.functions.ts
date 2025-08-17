import type { Sprite } from ".";
import { Vec2 } from "../../../core/math/Vec2";

export function createSprite(
    texture: string,
    position: Vec2 = new Vec2(0, 0),
    size: Vec2 = new Vec2(32, 32),
    origin: Vec2 = new Vec2(0.5, 0.5),

): Sprite {
    return {
        textureName: texture,
        position: position,
        size: size,
        origin: origin,
        meshName: "global_square"
    }
}