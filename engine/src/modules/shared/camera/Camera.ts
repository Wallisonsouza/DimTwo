import { Component, type ComponentOptions } from "@engine/core/base/Component";
import { Color } from "@engine/core/math/Color";
import type { Mat4 } from "@engine/core/math/Mat4";
import type { Vec3 } from "@engine/core/math/Vec3";
import { ComponentGroup } from "@engine/modules/enums/ComponentGroup";
import type { ComponentType } from "@engine/modules/enums/ComponentType";
import type { Ray } from "../physics/Ray";

export interface CameraOptions extends ComponentOptions {
  clearColor?: Color;
}

export abstract class Camera extends Component {
  public clearColor: Color;

  constructor(type: ComponentType, options: CameraOptions) {
    super(type, ComponentGroup.Camera, options);
    this.clearColor = options.clearColor || Color.black;
  }

  public abstract getViewMatrix(): Mat4;
  public abstract getProjectionMatrix(): Mat4;
  public abstract getViewProjectionMatrix(): Mat4;
  public abstract screenPointToRay(point: Vec3): Ray;
  public abstract worldPointToScreen(worldPoint: Vec3): Vec3;
  public abstract screenPointToWorld(worldPoint: Vec3): Vec3;

}