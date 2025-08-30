import type { Clonable } from "@engine/core/base/Clonable";
import { Component, type ComponentOptions } from "@engine/core/base/Component";
import { Color } from "../../../core/math/Color";
import { Mat4 } from "../../../core/math/Mat4";
import { ComponentGroup } from "../../enums/ComponentGroup";
import { ComponentType } from "../../enums/ComponentType";

export interface CameraOptions extends ComponentOptions {
  near?: number;
  far?: number;
  fov?: number;
  aspect?: number;
  clearColor?: Color;
}

export class Camera extends Component implements Clonable<Camera> {
  private readonly _VIEW_MATRIX_CACHE: Mat4;
  private _viewDirty = true;

  private readonly PROJECTION_MATRIX_CACHE: Mat4;

  near: number;
  far: number;
  fov: number;
  aspect: number;
  clearColor: Color;

  public getViewMatrix(): Mat4 {
    if (!this._viewDirty) return this._VIEW_MATRIX_CACHE;

    Mat4.composeTRInverse(
      this._VIEW_MATRIX_CACHE,
      this.transform.position,
      this.transform.rotation
    );

    this._viewDirty = false;
    return this._VIEW_MATRIX_CACHE;
  }


  public getProjectionMatrix(): Mat4 {
    Mat4.projection(
      this.PROJECTION_MATRIX_CACHE,
      this.fov,
      this.aspect,
      this.near,
      this.far
    );
    return this.PROJECTION_MATRIX_CACHE;
  }

  constructor(options: CameraOptions = {}) {

    super(ComponentType.Camera, ComponentGroup.Camera, options);
    this.near = options.near ?? 0.1;
    this.far = options.far ?? 1000;
    this.fov = options.fov ?? 60;
    this.aspect = options.aspect ?? 16 / 9;
    this.clearColor = options.clearColor ?? Color.gray;
    this._VIEW_MATRIX_CACHE = Mat4.create();
    this.PROJECTION_MATRIX_CACHE = Mat4.create();

    this.transform.onChange(() => { this._viewDirty = true });
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
