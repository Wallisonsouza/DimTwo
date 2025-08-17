import type { Clonable } from "../../../core/base/Component.ts";
import { Render } from "../../../core/base/Render.ts";
import { ComponentGroup } from "../../enums/ComponentGroup.ts";
import { ComponentType } from "../../enums/ComponentType.ts";
import type { Sprite } from "../../resources/sprite/types.ts";

export interface SpriteRenderOptions {
  sprite?: Sprite | null;
  material?: string;
  layer?: number;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
}

export class SpriteRender extends Render implements Clonable<SpriteRender> {
  sprite: Sprite | null;
  flipHorizontal: boolean;
  flipVertical: boolean;

  constructor(options: SpriteRenderOptions = {}) {
    super(ComponentType.SpriteRender, ComponentGroup.Render, options.material ?? "");
    this.sprite = options.sprite ?? null;
    this.layer = options.layer ?? 0;
    this.flipHorizontal = options.flipHorizontal ?? false;
    this.flipVertical = options.flipVertical ?? false;
  }

  clone(): SpriteRender {
    return new SpriteRender({
      sprite: this.sprite,
      material: this.material,
      layer: this.layer,
      flipHorizontal: this.flipHorizontal,
      flipVertical: this.flipVertical
    });
  }
}
