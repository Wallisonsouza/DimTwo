import { type RenderOptions, Render } from "../../core/base/Render.js";
import { ComponentGroup } from "../enums/ComponentGroup.js";
import { ComponentType } from "../enums/ComponentType.js";
import type { Sprite2D } from "./Sprite2D.ts";

export interface SpriteRender2DOptions extends RenderOptions {
  sprite?: Sprite2D | null;
  layer?: number;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
}

export class SpriteRender2D extends Render {
  sprite: Sprite2D | null;
  flipHorizontal: boolean;
  flipVertical: boolean;

  constructor(options: SpriteRender2DOptions = {}) {
    super(ComponentType.SpriteRender, ComponentGroup.Render, options);
    this.sprite = options.sprite ?? null;
    this.layer = options.layer ?? 0;
    this.flipHorizontal = options.flipHorizontal ?? false;
    this.flipVertical = options.flipVertical ?? false;
  }

  clone(): SpriteRender2D {
    return new SpriteRender2D({
      sprite: this.sprite,
      material: this.material,
      layer: this.layer,
      flipHorizontal: this.flipHorizontal,
      flipVertical: this.flipVertical
    });
  }
}
