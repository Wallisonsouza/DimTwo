import { Sprite2D } from "@engine/modules/2D/Sprite2D";
import { Vec2 } from "@engine/modules/2D/Vec2";

export const PLAYER_SPRITE = new Sprite2D({
    origin: new Vec2(0, 0),
    position: new Vec2(0, 0),
    size: new Vec2(32, 32),
});