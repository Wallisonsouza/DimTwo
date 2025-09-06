import { type ComponentOptions, Component } from "@engine/core/base/Component";
import { Mat4 } from "@engine/core/math/Mat4";
import { Quat } from "@engine/core/math/quat";
import { Vec3 } from "@engine/core/math/Vec3";
import { Vec4 } from "@engine/core/math/Vec4";
import { ComponentGroup } from "@engine/modules/enums/ComponentGroup";
import { ComponentType } from "@engine/modules/enums/ComponentType";


export interface TransformOptions extends ComponentOptions {
  position?: Vec3;
  rotation?: Quat;
  scale?: Vec3;
}

export class Transform extends Component {
  private readonly _WORLD_MATRIX_CACHE: Mat4 = Mat4.create();
  public worldDirty = true;

  public parent: Transform | null = null;

  private _position: Vec3;
  private _rotation: Quat;
  private _scale: Vec3;

  constructor(options: TransformOptions = {}) {
    super(ComponentType.Transform, ComponentGroup.Transform, options);
    this._position = options.position ?? new Vec3(0, 0, 0);
    this._rotation = options.rotation ?? new Quat(0, 0, 0, 0);
    this._scale = options.scale ?? new Vec3(1, 1, 1);
  }

  get position(): Vec3 { return this._position; }
  set position(v: Vec3) {
    this._position.set(v);
  }



  get rotation(): Quat { return this._rotation; }
  set rotation(q: Quat) {
    this._rotation.set(q);
  }

  get scale(): Vec3 { return this._scale; }
  set scale(s: Vec3) {
    this._scale.set(s);
  }

  localPosition: Vec3 = new Vec3(2, 0, 0);

  public getWorldMatrix(): Mat4 {

    Mat4.composeTRS(
      this._WORLD_MATRIX_CACHE,
      this._position,
      this._rotation,
      this._scale
    );


    if (this.parent) {
      Mat4.multiply(
        this.parent.getWorldMatrix(),
        this._WORLD_MATRIX_CACHE,
        this._WORLD_MATRIX_CACHE
      );
    }

    return this._WORLD_MATRIX_CACHE;
  }




  public transformPointToWorldSpace(point: Vec3): Vec3 {
    const tempVec4 = new Vec4(point.x, point.y, point.z, 1.0);
    const worldSpace = Mat4.multiplyVec4(this._WORLD_MATRIX_CACHE, tempVec4);
    return worldSpace.perspectiveDivide();
  }

  /* 
      private onChangeCallbacks: TransformCallback[] = [];
      public onChange(callback: TransformCallback) {
          this.onChangeCallbacks.push(callback);
      }
  
      private emitOnChange() {
          if (!this.onChangeCallbacks.length) return;
          for (const cb of this.onChangeCallbacks) cb(this);
      }
   */
  clone(): Transform {
    const t = new Transform({
      position: this._position.clone(),
      rotation: this._rotation.clone(),
      scale: this._scale.clone()
    });

    return t;
  }
}
