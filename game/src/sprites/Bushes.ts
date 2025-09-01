import { Sprite2D } from "@engine/modules/2D/Sprite2D";
import { Vec2 } from "@engine/modules/2D/Vec2";

const BUSHE_0 = new Sprite2D({
    meshID: null,
    textureID: "bushe",
    origin: new Vec2(0.5, 0.5),
    position: new Vec2(0, 0),
    size: new Vec2(16 + 8, 16 + 8),
});

const BUSHE_1 = new Sprite2D({
    meshID: null,
    textureID: "bushe",
    origin: new Vec2(0.5, 0.5),
    position: new Vec2(32, 0),
    size: new Vec2(16 + 8, 16 + 8),
});

const BUSHE_2 = new Sprite2D({
    meshID: null,
    textureID: "bushe",
    origin: new Vec2(0.5, 0.5),
    position: new Vec2(0, 32),
    size: new Vec2(32 + 8, 16 + 8),
});

const BUSHE_3 = new Sprite2D({
    meshID: null,
    textureID: "bushe",
    origin: new Vec2(0.5, 0.5),
    position: new Vec2(0, 64),
    size: new Vec2(48 + 8, 16 + 8),
});

const BUSHE_4 = new Sprite2D({
    meshID: null,
    textureID: "bushe",
    origin: new Vec2(0.5, 0.5),
    position: new Vec2(8, 90),
    size: new Vec2(48 + 8, 48 + 8),
});

const BUSHE_5 = new Sprite2D({
    meshID: null,
    textureID: "bushe",
    origin: new Vec2(0.5, 0.5),
    position: new Vec2(64, 90),
    size: new Vec2(48 + 8, 48 + 8),
});

const BUSHE_6 = new Sprite2D({
    meshID: null,
    textureID: "bushe",
    origin: new Vec2(0.5, 0.5),
    position: new Vec2(0, 90 + 32 + 16),
    size: new Vec2(48 + 8, 48 + 8),
});

export const BUSHES = [BUSHE_0, BUSHE_1, BUSHE_2, BUSHE_3, BUSHE_4, BUSHE_5, BUSHE_6];
