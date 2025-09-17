import { Vec2 } from "@engine/core/math/Vec2";
import { Sprite2D } from "@engine/modules/2D/Sprite2D";

const BUSHE_0 = new Sprite2D({
  meshID: null,
  textureID: "bushe",
  origin: new Vec2(0.5, 0.5),
  position: new Vec2(0, 0),
  size: new Vec2(24, 24),
});

const BUSHE_1 = new Sprite2D({
  meshID: null,
  textureID: "bushe",
  origin: new Vec2(0.5, 0.5),
  position: new Vec2(32, 0),
  size: new Vec2(24, 24),
});

const BUSHE_2 = new Sprite2D({
  meshID: null,
  textureID: "bushe",
  origin: new Vec2(0.5, 0.5),
  position: new Vec2(0, 32),
  size: new Vec2(40, 24),
});

const BUSHE_3 = new Sprite2D({
  meshID: null,
  textureID: "bushe",
  origin: new Vec2(0.5, 0.5),
  position: new Vec2(0, 64),
  size: new Vec2(56, 24),
});

const BUSHE_4 = new Sprite2D({
  meshID: null,
  textureID: "bushe",
  origin: new Vec2(0.5, 0.5),
  position: new Vec2(8, 90),
  size: new Vec2(56, 56),
});

const BUSHE_5 = new Sprite2D({
  meshID: null,
  textureID: "bushe",
  origin: new Vec2(0.5, 0.5),
  position: new Vec2(64, 90),
  size: new Vec2(56, 56),
});

const BUSHE_6 = new Sprite2D({
  meshID: null,
  textureID: "bushe",
  origin: new Vec2(0.5, 0.5),
  position: new Vec2(0, 138),
  size: new Vec2(56, 56),
});

export const BUSHES = [BUSHE_0, BUSHE_1, BUSHE_2, BUSHE_3, BUSHE_4, BUSHE_5, BUSHE_6];
