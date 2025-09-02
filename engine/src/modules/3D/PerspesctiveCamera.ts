import { EngineWindow } from "@engine/core/display/Display";
import { Mat4, Mat4Error } from "@engine/core/math/Mat4";
import { Vec3 } from "@engine/core/math/Vec3";
import { Vec4 } from "@engine/core/math/Vec4";
import { ComponentType } from "@engine/modules/enums/ComponentType";
import { Camera, type CameraOptions } from "../shared/camera/Camera";
import { Ray } from "../shared/physics/Ray";

export interface PerspectiveCameraOptions extends CameraOptions {
  near?: number;
  far?: number;
  fov?: number;
  aspect?: number;
}

export class PerspectiveCamera extends Camera {
  private readonly _VIEW_MATRIX_CACHE: Mat4 = Mat4.create();
  private readonly _PROJECTION_MATRIX_CACHE: Mat4 = Mat4.create();
  private readonly _VIEW_PROJECTION_MATRIX_CACHE: Mat4 = Mat4.create();
  private readonly _MATRIX_OPERATION_CACHE: Mat4 = Mat4.create();
  private readonly _VEC4_OPERATION_CACHE: Vec4 = Vec4.create();

  near: number;
  far: number;
  fov: number;
  aspect: number;

  constructor(options: PerspectiveCameraOptions = {}) {
    super(ComponentType.Camera, options);

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
    return this._PROJECTION_MATRIX_CACHE;
  }

  public getViewProjectionMatrix(): Mat4 {
    Mat4.multiply(
      this.getProjectionMatrix(),
      this.getViewMatrix(),
      this._VIEW_PROJECTION_MATRIX_CACHE
    );
    return this._VIEW_PROJECTION_MATRIX_CACHE;
  }

  public screenPointToWorld(point: Vec3, out: Vec3 = new Vec3()): Vec3 {
    const currentWindow = EngineWindow.current;

    const ndc = currentWindow.toNDC(point);
    const clip = new Vec4(ndc.x, ndc.y, ndc.z, 1.0);

    if (
      !Mat4.invert(this.getViewProjectionMatrix(), this._MATRIX_OPERATION_CACHE)
    ) {
      throw Mat4Error.INVERT_ERROR;
    }

    const world = Mat4.multiplyVec4(
      this._MATRIX_OPERATION_CACHE,
      clip
    ).perspectiveDivide();

    out.set(world.x, world.y, world.z);
    return out;
  }

  public worldPointToScreen(worldPoint: Vec3): Vec3 {
    this._VEC4_OPERATION_CACHE.set(
      worldPoint.x,
      worldPoint.y,
      worldPoint.z,
      1
    );

    const clip = Mat4.multiplyVec4(
      this.getViewProjectionMatrix(),
      this._VEC4_OPERATION_CACHE
    );

    clip.x /= clip.w;
    clip.y /= clip.w;
    clip.z /= clip.w;

    const currentWindow = EngineWindow.current;
    if (!currentWindow) return new Vec3(0, 0, 0);

    const screenX = ((clip.x + 1) / 2) * currentWindow.width;
    const screenY = ((1 - clip.y) / 2) * currentWindow.height;

    return new Vec3(screenX, screenY, clip.z);
  }

  public screenPointToRay(point: Vec3): Ray {
    const currentWindow = EngineWindow.current;

    const ndc = currentWindow.toNDC(point);

    const nearClip = new Vec4(ndc.x, ndc.y, -1, 1);
    const farClip = new Vec4(ndc.x, ndc.y, 1, 1);

    if (
      !Mat4.invert(this.getViewProjectionMatrix(), this._MATRIX_OPERATION_CACHE)
    ) {
      throw Mat4Error.INVERT_ERROR;
    }

    const nearWorld = Mat4.multiplyVec4(
      this._MATRIX_OPERATION_CACHE,
      nearClip
    ).perspectiveDivide();
    const farWorld = Mat4.multiplyVec4(
      this._MATRIX_OPERATION_CACHE,
      farClip
    ).perspectiveDivide();

    const origin = this.transform.transformPointToWorldSpace(nearWorld);
    const direction = farWorld.clone().subtractInplace(origin).normalizeInPlace();

    return new Ray(origin, direction);
  }

  public clone(): PerspectiveCamera {
    return new PerspectiveCamera({
      near: this.near,
      far: this.far,
      fov: this.fov,
      aspect: this.aspect,
      clearColor: this.clearColor.clone(),
    });
  }
}
