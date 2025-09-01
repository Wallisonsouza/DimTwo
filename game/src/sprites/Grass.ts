import { Sprite2D } from "@engine/modules/2D/Sprite2D";
import { Vec2 } from "@engine/modules/2D/Vec2";

export const GRASS_0_SPRITE = new Sprite2D ( {
    meshID: "fillQuad",
    origin: new Vec2(0, 0),
    position: new Vec2(64,32),
    size: new Vec2(32, 32),
    textureID: "grass"
});