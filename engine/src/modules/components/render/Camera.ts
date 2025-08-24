import type { Clonable } from "@engine/core/base/Clonable";
import { Component } from "@engine/core/base/Component";
import { Color } from "../../../core/math/Color";
import { Mat4 } from "../../../core/math/Mat4";
import { ComponentGroup } from "../../enums/ComponentGroup";
import { ComponentType } from "../../enums/ComponentType";

export interface CameraOptions {
  near?: number;
  far?: number;
  fov?: number;
  aspect?: number;
  clearColor?: Color;
}

export class Camera extends Component implements Clonable<Camera> {
  near: number;
  far: number;
  fov: number;
  aspect: number;
  clearColor: Color;

  public viewMatrix: Mat4;
  public projection: Mat4;
 
  constructor(options: CameraOptions = {}) {
    super(ComponentType.Camera, ComponentGroup.Camera);
    this.near = options.near ?? 0.1;
    this.far = options.far ?? 1000;
    this.fov = options.fov ?? 60;
    this.aspect = options.aspect ?? 16 / 9;
    this.clearColor = options.clearColor ?? Color.gray;
    this.viewMatrix = Mat4.create();
    this.projection = Mat4.create();
  }

  clone(): Camera {
    return new Camera({
      near: this.near,
      far: this.far,
      fov: this.fov,
      aspect: this.aspect,
      clearColor: this.clearColor.clone()
    });
  }
}
