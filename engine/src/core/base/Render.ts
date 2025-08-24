import type { ComponentGroup } from "../../modules/enums/ComponentGroup";
import type { ComponentType } from "../../modules/enums/ComponentType";
import { Color } from "../math/Color";
import { Component } from "./Component";


export interface RenderOptions {
  material?: string;
  color?: Color;
  alpha?: number;
  meshName?: string;
  subMeshes?: number[];
  layer?: number;
}

export abstract class Render extends Component {
  color: Color;
  alpha: number;
  material: string;
  meshName: string | null;
  subMeshes: number[] | null;
  layer: number = 0;

  constructor(type: ComponentType, group: ComponentGroup, options: RenderOptions) {
    super(type, group);
    this.material = options.material ?? "simpleMaterial";
    this.color = options.color ?? Color.white;
    this.alpha = options.alpha ?? 1.0;
    this.meshName = options.meshName ?? "fillQuad";
    this.subMeshes = options.subMeshes ?? [];
    this.layer = options.layer ?? 0;
  }
}
