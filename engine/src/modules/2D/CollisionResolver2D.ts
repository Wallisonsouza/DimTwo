import { Vec2 } from "@engine/core/math/Vec2";

export interface CollisionResolution2D {
  mtv: Vec2;
  normal: Vec2;
  time: number;
  contacts: Vec2[];
  penetrations: Vec2[];
}
