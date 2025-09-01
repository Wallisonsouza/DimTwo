import type { Engine } from "@engine/Engine";
import { Vec2 } from "./Vec2";

export interface SrpiteOptions {
  textureID?: string | null;
  position?: Vec2;
  origin?: Vec2;
  size?: Vec2;
  meshID?: string | null;
}

export class Sprite2D {
  textureID: string | null;
  position: Vec2;
  origin: Vec2;
  size: Vec2;
  meshID: string | null;

  constructor(options: SrpiteOptions) {
    this.textureID = options.textureID ?? null;
    this.position = options.position ?? new Vec2(0, 0);
    this.origin = options.origin ?? new Vec2(0, 0);
    this.size = options.size ?? new Vec2(16, 16);
    this.meshID = options.meshID ?? null;
  }

  public generateMesh(engine: Engine) {
    if (this.textureID) {
      const texture = engine.textureBuffers.get(this.textureID);
      console.log(texture)
    }
  }
}
