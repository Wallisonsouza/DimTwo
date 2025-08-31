import { Display } from "@engine/core/display/Display";
import { Mat4, Mat4Error } from "@engine/core/math/Mat4";
import { Vec3 } from "@engine/core/math/Vec3";
import { Vec4 } from "@engine/core/math/Vec4";
import { ComponentType } from "@engine/modules/enums/ComponentType";
import { Camera, type CameraOptions } from "./Camera";
import { Ray } from "./Ray";

export interface PerspesctiveCameraOptions extends CameraOptions {
  near?: number;
  far?: number;
  fov?: number;
  aspect?: number;
}

export class PerspesctiveCamera extends Camera {
  private readonly _VIEW_MATRIX_CACHE: Mat4;
  private readonly _PROJECTION_MATRIX_CACHE: Mat4;
  private readonly _VIEW_PROJECTION_MATRIX_CACHE: Mat4;
  private readonly _MATRIX_OPERATION_CACHE: Mat4;
  private readonly _VEC4_OPERATION_CACHE: Vec4;

  near: number;
  far: number;
  fov: number;
  aspect: number;


  constructor(options: PerspesctiveCameraOptions = {}) {

    super(ComponentType.Camera, options);

    this._VIEW_MATRIX_CACHE = Mat4.create();
    this._PROJECTION_MATRIX_CACHE = Mat4.create();
    this._VIEW_PROJECTION_MATRIX_CACHE = Mat4.create();
    this._MATRIX_OPERATION_CACHE = Mat4.create();
    this._VEC4_OPERATION_CACHE = Vec4.create();

    this.near = options.near ?? 0.1;
    this.far = options.far ?? 1000;
    this.fov = options.fov ?? 60;
    this.aspect = options.aspect ?? 16 / 9;
   

  }

  public getViewMatrix(): Mat4 {

    const worldNoScale = Mat4.create();

    Mat4.composeTR(
      worldNoScale,
      this.transform.position,
      this.transform.rotation
    );

    if (!Mat4.invert(worldNoScale, this._VIEW_MATRIX_CACHE)) {
      throw Mat4Error.INVERT_ERROR;
    }

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

    /*  const aspect = Display.aspect;
 
     let left: number, right: number, bottom: number, top: number;
 
     if (aspect >= 1) {
       left = -aspect;
       right = aspect;
       bottom = -1;
       top = 1;
     } else {
       left = -1;
       right = 1;
       bottom = -1 / aspect;
       top = 1 / aspect;
     }
 
     Mat4.orthographic(this._PROJECTION_MATRIX_CACHE, left, right, bottom, top, 0.1, 100); */

    return this._PROJECTION_MATRIX_CACHE;
  }

  public getViewProjectionMatrix() {
    Mat4.multiply(
      this.getProjectionMatrix(),
      this.getViewMatrix(),
      this._VIEW_PROJECTION_MATRIX_CACHE
    );

    return this._VIEW_PROJECTION_MATRIX_CACHE;
  }

  public screenPointToWorld(point: Vec3, out: Vec3 = new Vec3()): Vec3 {
    const ndc = Display.normalize(point);
    const clip = new Vec4(ndc.x, ndc.y, ndc.z, 1.0);

    if (!Mat4.invert(this.getViewProjectionMatrix(), this._MATRIX_OPERATION_CACHE)) {
      throw Mat4Error.INVERT_ERROR;
    }

    const world = Mat4.multiplyVec4(this._MATRIX_OPERATION_CACHE, clip);
    out.set(world.x / world.w, world.y / world.w, world.z / world.w);
    return out;
  }

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

    const ndc = Display.normalize(point);

    const nearPointClip = new Vec4(ndc.x, ndc.y, -1, 1);
    const farPointClip = new Vec4(ndc.x, ndc.y, 1, 1);

    const projection = this.getProjectionMatrix();


    if (!Mat4.invert(
      projection,
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
      .clone()
      .subtractInplace(nearPointWorld)
      .normalizeInPlace();

    return new Ray(nearPointWorld, rayDirection);
  }

  clone(): PerspesctiveCamera {
    return new PerspesctiveCamera({
      near: this.near,
      far: this.far,
      fov: this.fov,
      aspect: this.aspect,
      clearColor: this.clearColor.clone()
    });
  }

}