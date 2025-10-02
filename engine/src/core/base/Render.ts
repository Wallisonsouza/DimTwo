import type { Material } from "@engine/Rendering/Material";
import type { Mesh } from "@engine/Rendering/Mesh";
import type { ComponentGroup } from "../../modules/enums/ComponentGroup";
import type { ComponentType } from "../../modules/enums/ComponentType";
import { Color } from "../math/Color";
import { Component, type ComponentOptions } from "./Component";

export interface RenderOptions extends ComponentOptions {
  material?: Material | null;
  color?: Color;
  alpha?: number;
  mesh?: Mesh | null;
  subMeshes?: number[];
  layer?: number;
}

export abstract class Render extends Component {
  color: Color;
  alpha: number;
  material: Material | null;
  mesh: Mesh | null;
  subMeshes: number[] | null;
  layer: number = 0;

  constructor(type: ComponentType, group: ComponentGroup, options: RenderOptions) {
    super(type, group, options);
    this.material = options.material ?? null;
    this.color = options.color ?? Color.White;
    this.alpha = options.alpha ?? 1.0;
    this.mesh = options.mesh ?? null;
    this.subMeshes = options.subMeshes ?? [];
    this.layer = options.layer ?? 0;
  }
}
