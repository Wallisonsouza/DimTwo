import { Vec2 } from "@engine/core/math/Vec2";
import { Sprite2D } from "@engine/modules/2D/Sprite2D";

export const PLAYER_SPRITE = new Sprite2D({
    textureID: "player",
    origin: new Vec2(0, 0),
    position: new Vec2(0, 0),
    size: new Vec2(32, 32),
});