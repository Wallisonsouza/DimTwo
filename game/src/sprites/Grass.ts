import { Vec2 } from "@engine/core/math/Vec2";
import { Sprite } from "@engine/modules/resources/sprite/types";

export const GRASS_0_SPRITE = new Sprite ( {
    meshID: "fillQuad",
    origin: new Vec2(0, 0),
    position: new Vec2(64,32),
    size: new Vec2(32, 32),
    textureID: "grass"
});