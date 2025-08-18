import { Vec2 } from "../../../engine/src/core/math/Vec2";
import type { Sprite } from "../../../engine/src/modules/resources/sprite";

export const PLAYER_SPRITE: Sprite = {
    meshName: null,
    origin: new Vec2(0, 0),
    position: new Vec2(0, 0),
    size: new Vec2(32, 32),
    textureName: "player",
};