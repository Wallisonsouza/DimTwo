import { Vec2 } from "../../../engine/src/core/math/Vec2";
import type { Sprite } from "../../../engine/src/modules/resources/sprite";

export const BUSHE_0: Sprite = {
    meshName: null,
    textureName: "bushe",
    origin: new Vec2(0.5, 0.5),
    position: new Vec2(0, 0),
    size: new Vec2(16 + 8, 16 + 8),
};

export const BUSHE_1: Sprite = {
    meshName: null,
    textureName: "bushe",
    origin: new Vec2(0.5, 0.5),
    position: new Vec2(32, 0),
    size: new Vec2(16 + 8, 16 + 8),
};

export const BUSHE_2: Sprite = {
    meshName: null,
    textureName: "bushe",
    origin: new Vec2(0.5, 0.5),
    position: new Vec2(0, 32),
    size: new Vec2(32 + 8, 16 + 8),
};

export const BUSHE_3: Sprite = {
    meshName: null,
    textureName: "bushe",
    origin: new Vec2(0.5, 0.5),
    position: new Vec2(0, 64),
    size: new Vec2(48 + 8, 16 + 8),
};

export const BUSHE_4: Sprite = {
    meshName: null,
    textureName: "bushe",
    origin: new Vec2(0.5, 0.5),
    position: new Vec2(8, 90),
    size: new Vec2(48 + 8, 48 + 8),
};

export const BUSHE_5: Sprite = {
    meshName: null,
    textureName: "bushe",
    origin: new Vec2(0.5, 0.5),
    position: new Vec2(64, 90),
    size: new Vec2(48 + 8, 48 + 8),
};

export const BUSHE_6: Sprite = {
    meshName: null,
    textureName: "bushe",
    origin: new Vec2(0.5, 0.5),
    position: new Vec2(0, 90 + 32 + 16),
    size: new Vec2(48 + 8, 48 + 8),
};

export const BUSHES = [BUSHE_0, BUSHE_1, BUSHE_2, BUSHE_3, BUSHE_4, BUSHE_5, BUSHE_6];
