import type { Clonable } from "@engine/core/base/Clonable";
import { type ComponentOptions, Component } from "@engine/core/base/Component";
import { Display } from "@engine/core/display/Display";
import { Color } from "@engine/core/math/Color";
import { Mat4, Mat4Error } from "@engine/core/math/Mat4";
import { Vec3 } from "@engine/core/math/Vec3";
import { Vec4 } from "@engine/core/math/Vec4";
import { ComponentGroup } from "@engine/modules/enums/ComponentGroup";
import { ComponentType } from "@engine/modules/enums/ComponentType";
import { Ray } from "./Ray";

export interface CameraOptions extends ComponentOptions {
  near?: number;
  far?: number;
  fov?: number;
  aspect?: number;
  clearColor?: Color;
}

export class Camera extends Component implements Clonable<Camera> {
  private readonly _VIEW_MATRIX_CACHE: Mat4;
  private readonly _PROJECTION_MATRIX_CACHE: Mat4;
  private readonly _VIEW_PROJECTION_MATRIX_CACHE: Mat4;
  private readonly _MATRIX_OPERATION_CACHE: Mat4;
  private readonly _VEC4_OPERATION_CACHE: Vec4;

  near: number;
  far: number;
  fov: number;
  aspect: number;
  clearColor: Color;

  constructor(options: CameraOptions = {}) {

    super(ComponentType.Camera, ComponentGroup.Camera, options);
    this._VIEW_MATRIX_CACHE = Mat4.create();
    this._PROJECTION_MATRIX_CACHE = Mat4.create();
    this._VIEW_PROJECTION_MATRIX_CACHE = Mat4.create();
    this._MATRIX_OPERATION_CACHE = Mat4.create();
    this._VEC4_OPERATION_CACHE = Vec4.create();

    this.near = options.near ?? 0.1;
    this.far = options.far ?? 1000;
    this.fov = options.fov ?? 60;
    this.aspect = options.aspect ?? 16 / 9;
    this.clearColor = options.clearColor ?? Color.gray;

  }

  public getViewMatrix(): Mat4 {
    Mat4.composeTRInverse(
      this._VIEW_MATRIX_CACHE,
      this.transform.position,
      this.transform.rotation
    );
    return this._VIEW_MATRIX_CACHE;
  }

  public getProjectionMatrix(): Mat4 {
    Mat4.projection(
      this._PROJECTION_MATRIX_CACHE,
      this.fov,
      this.aspect,
      this.near,
      this.far
    );
    return this._PROJECTION_MATRIX_CACHE;
  }

  public getViewProjectionMatrix() {
    Mat4.multiply(
      this._PROJECTION_MATRIX_CACHE,
      this._VIEW_MATRIX_CACHE,
      this._VIEW_PROJECTION_MATRIX_CACHE
    );

    return this._VIEW_PROJECTION_MATRIX_CACHE;
  }

  public screenPointToWorld(point: Vec3, out: Vec3 = new Vec3()): Vec3 {
    const clip = new Vec4(point.x, point.y, point.z, 1.0);

    if (!Mat4.invert(this.getViewProjectionMatrix(), this._MATRIX_OPERATION_CACHE)) {
      throw Mat4Error.INVERT_ERROR;
    }

    const world = Mat4.multiplyVec4(this._MATRIX_OPERATION_CACHE, clip);
    out.set(world.x / world.w, world.y / world.w, world.z / world.w);
    return out;
  }


  // ok
  public worldPointToScreen(worldPoint: Vec3): Vec3 {
    this._VEC4_OPERATION_CACHE.set(worldPoint.x, worldPoint.y, worldPoint.z, 1);

    const clip = Mat4.multiplyVec4(
      this.getViewProjectionMatrix(),
      this._VEC4_OPERATION_CACHE
    );

    clip.x /= clip.w;
    clip.y /= clip.w;
    clip.z /= clip.w;

    const screenX = ((clip.x + 1) / 2) * Display.width;
    const screenY = ((1 - clip.y) / 2) * Display.height;

    return new Vec3(screenX, screenY, clip.z);
  }

  screenPointToRay(point: Vec3): Ray {
    const nearPointClip = new Vec4(point.x, point.y, -1.0, 1.0);
    const farPointClip = new Vec4(point.x, point.y, 1.0, 1.0);

    if (!Mat4.invert(
      this._PROJECTION_MATRIX_CACHE,
      this._MATRIX_OPERATION_CACHE
    )) {
      throw Mat4Error.INVERT_ERROR;
    }

    const nearPointCamera = Mat4
      .multiplyVec4(this._MATRIX_OPERATION_CACHE, nearPointClip)
      .perspectiveDivide();

    const farPointCamera = Mat4
      .multiplyVec4(this._MATRIX_OPERATION_CACHE, farPointClip)
      .perspectiveDivide();

    const nearPointWorld: Vec3 = this.transform
      .transformPointToWorldSpace(nearPointCamera)


    const farPointWorld: Vec3 = this.transform
      .transformPointToWorldSpace(farPointCamera)

    const rayDirection = farPointWorld
      .subtractInplace(nearPointWorld)
      .normalizeInPlace();

    return new Ray(nearPointWorld, rayDirection);
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








/*   screenPointToRay(point: Vec3): Ray {
    const nearPointClip = new Vec4(point.x, point.y, -1.0, 1.0);
    const farPointClip = new Vec4(point.x, point.y, 1.0, 1.0);

    if (!Mat4.invertInOut(this._PROJECTION_MATRIX_CACHE, this._OPERATION_MATRIX_CACHE)) {
      throw Mat4Error.INVERT_ERROR;
    }

    const nearPointCamera = Mat4.multiplyVec4(this._OPERATION_MATRIX_CACHE, nearPointClip);
    const farPointCamera = Mat4.multiplyVec4(this._OPERATION_MATRIX_CACHE, farPointClip);

    const nearPointWorld: Vec3 = this.transform
      .transformPointToWorldSpace(nearPointCamera)
      .perspectiveDivide();

    const farPointWorld: Vec3 = this.transform
      .transformPointToWorldSpace(farPointCamera)
      .perspectiveDivide();


    const rayDirection = farPointWorld
      .subtractInplace(nearPointWorld)
      .normalizeInPlace();

    return new Ray(nearPointWorld, rayDirection);
  } */

