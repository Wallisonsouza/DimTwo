import type { ComponentGroup } from "../../modules/enums/ComponentGroup";
import type { ComponentType } from "../../modules/enums/ComponentType";
import { Color } from "../math/Color";
import { Component } from "./Component";

export abstract class Render extends Component {
  color: Color;
  alpha: number;
  material: string;
  meshName: string | null;
  subMeshes: number[] | null;
  layer: number = 0;

  constructor(
    type: ComponentType,
    group: ComponentGroup,
    material: string,
    color: Color = Color.white,
    alpha: number = 1.0,
    meshName: string | null = "fillSquare",
    subMeshes: number[] | null = null
  ) {
    super(type, group);
    this.material = material;
    this.color = color;
    this.alpha = alpha;
    this.meshName = meshName;
    this.subMeshes = subMeshes;
  }
}
