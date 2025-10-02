import { type ComponentOptions, Component } from "@engine/core/base/Component";
import { Mat4 } from "@engine/core/math/Mat4";
import { Quat } from "@engine/core/math/quat";
import { Vec2 } from "@engine/core/math/Vec2";
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

  private readonly _tempWorld: Mat4 = Mat4.create();

  public parent: Transform | null = null;

  private _position: Vec3;
  private _rotation: Quat;
  private _scale: Vec3;

  get position(): Vec3 { return this._position; }
  set position(v: Vec3) { this._position.set(v); }

  get rotation(): Quat { return this._rotation; }
  set rotation(q: Quat) { this._rotation.set(q); }

  get scale(): Vec3 { return this._scale; }
  set scale(s: Vec3) { this._scale.set(s); }

  constructor(options: TransformOptions = {}) {
    super(ComponentType.Transform, ComponentGroup.Transform, options);

    this._position = options.position || new Vec3(0, 0, 0);
    this._rotation = options.rotation || new Quat(0, 0, 0, 1);
    this._scale = options.scale || new Vec3(1, 1, 1);
  }


  public getWorldMatrix(): Mat4 {

    Mat4.composeTRS(
      this._tempWorld,
      this._position,
      this._rotation,
      this._scale
    );


    if (this.parent) {
      Mat4.multiply(
        this.parent.getWorldMatrix(),
        this._tempWorld,
        this._tempWorld
      );
    }

    return this._tempWorld;
  }

  public get rightVector() {
    return this.transformVectorToWorldSpace(Vec3.RIGHT);
  }


  public transformVectorToWorldSpace(vec: Vec3 | Vec2): Vec3 {
    const tempVec4 = new Vec4(vec.x, vec.y, vec.z ?? 0, 0.0);
    const worldSpace = Mat4.multiplyVec4(this._tempWorld, tempVec4);
    return new Vec3(worldSpace.x, worldSpace.y, worldSpace.z);
  }

  public transformPointToWorldSpace(point: Vec3 | Vec2): Vec3 {
    const tempVec4 = new Vec4(point.x, point.y, point.z ?? 0, 1.0);

    const worldSpace = Mat4.multiplyVec4(this._tempWorld, tempVec4);
    return worldSpace.perspectiveDivide();
  }

  clone(): Transform {
    const t = new Transform({
      position: this._position.clone(),
      rotation: this._rotation.clone(),
      scale: this._scale.clone()
    });

    return t;
  }
}


