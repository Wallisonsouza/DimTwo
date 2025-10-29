import { type ComponentOptions, Component } from "../../core/base/Component";
import { Mat4 } from "../../core/math/Mat4";
import { Mathf } from "../../core/math/Mathf";
import { Quat } from "../../core/math/quat";
import { Vec3 } from "../../core/math/Vec3";
import { ComponentGroup } from "../enums/ComponentGroup";
import { ComponentType } from "../enums/ComponentType";


class TransformUtils {
  static tempVec1 = new Vec3();
  static tempVec2 = new Vec3();
  static tempQuat = new Quat();

  static unitX = new Vec3(1, 0, 0);
  static unitY = new Vec3(0, 1, 0);
  static unitZ = new Vec3(0, 0, 1);

  static setLocalPositionFromWorld(parent: Transform | null, worldPos: Vec3, outLocal: Vec3): void {
    if (parent) {
      Quat.conjugate(parent.rotation, TransformUtils.tempQuat);
      Vec3.subtract(worldPos, parent.position, TransformUtils.tempVec1);
      Vec3.divide(TransformUtils.tempVec1, parent.scale, TransformUtils.tempVec1);
      Quat.rotateVector(TransformUtils.tempQuat, TransformUtils.tempVec1, outLocal);
    } else {
      outLocal.copy(worldPos);
    }
  }

  static setLocalRotationFromWorld(parent: Transform | null, worldRot: Quat, outLocal: Quat): void {
    if (parent) {
      Quat.conjugate(parent.rotation, TransformUtils.tempQuat);
      Quat.multiply(TransformUtils.tempQuat, worldRot, outLocal);
    } else {
      outLocal.copy(worldRot);
    }
  }

  static setLocalScaleFromWorld(parent: Transform | null, worldScale: Vec3, outLocal: Vec3): void {
    if (parent) {
      Vec3.divide(worldScale, parent.scale, outLocal);
    } else {
      outLocal.copy(worldScale);
    }
  }
}


export interface TransformOptions extends ComponentOptions {
  position?: Vec3;
  rotation?: Quat;
  scale?: Vec3;
}

export class Transform extends Component {
  private readonly _worldMatrix: Mat4 = Mat4.create();

  public parent: Transform | null = null;
  public children: Transform[] = [];

  private _localPosition: Vec3;
  private _localRotation: Quat;
  private _localScale: Vec3;

  private _worldPosition: Vec3 = new Vec3();
  private _worldRotation: Quat = new Quat();
  private _worldScale: Vec3 = new Vec3(1, 1, 1);

  public _origin: Vec3 = new Vec3(0.5, 0.5, 0.5);

  public get origin(): Readonly<Vec3> {
    return this._origin;
  }

  public set origin(o: Vec3) {

    o.x = Mathf.clamp(o.x, 0, 1);
    o.y = Mathf.clamp(o.y, 0, 1);
    o.z = Mathf.clamp(o.z, 0, 1);
    this._origin = o;
  }

  private _dirty = true;

  private _forward: Vec3 = new Vec3();
  private _up: Vec3 = new Vec3();
  private _right: Vec3 = new Vec3();

  get localPosition(): Readonly<Vec3> { return this._localPosition.clone(); }
  set localPosition(v: Vec3) { this._localPosition.copy(v); this._markDirty(); }

  get localRotation(): Readonly<Quat> { return this._localRotation.clone(); }
  set localRotation(q: Quat) { this._localRotation.copy(q); this._markDirty(); }

  get localScale(): Readonly<Vec3> { return this._localScale.clone(); }
  set localScale(s: Vec3) { this._localScale.copy(s); this._markDirty(); }


  get position(): Readonly<Vec3> { this._updateWorld(); return this._worldPosition.clone(); }
  set position(v: Vec3) {
    TransformUtils.setLocalPositionFromWorld(this.parent, v, this._localPosition);
    this._markDirty();
  }

  get rotation(): Readonly<Quat> { this._updateWorld(); return this._worldRotation.clone(); }
  set rotation(q: Quat) {
    TransformUtils.setLocalRotationFromWorld(this.parent, q, this._localRotation);
    this._markDirty();
  }

  get scale(): Readonly<Vec3> { this._updateWorld(); return this._worldScale.clone(); }
  set scale(v: Vec3) {
    TransformUtils.setLocalScaleFromWorld(this.parent, v, this._localScale);
    this._markDirty();
  }

  constructor(options: TransformOptions = {}) {
    super(ComponentType.Transform, ComponentGroup.Transform, options);
    this._localPosition = options.position || new Vec3();
    this._localRotation = options.rotation || new Quat(0, 0, 0, 1);
    this._localScale = options.scale || new Vec3(1, 1, 1);
  }

  get forward(): Readonly<Vec3> { this._updateWorld(); return this._forward; }
  get up(): Readonly<Vec3> { this._updateWorld(); return this._up; }
  get right(): Readonly<Vec3> { this._updateWorld(); return this._right; }


  private _markDirty() {
    this._dirty = true;
    for (const c of this.children) c._markDirty();
  }

  private _updateWorld() {
    if (!this._dirty) return;

    const tempVec1 = TransformUtils.tempVec1;
    const tempVec2 = TransformUtils.tempVec2;

    if (this.parent) {
      Quat.multiply(this.parent._worldRotation, this._localRotation, this._worldRotation);
      Vec3.multiply(this.parent._worldScale, this._localScale, this._worldScale);

      Vec3.multiply(this._localPosition, this.parent._worldScale, tempVec1);
      Quat.rotateVector(this.parent._worldRotation, tempVec1, tempVec2);
      Vec3.add(this.parent._worldPosition, tempVec2, this._worldPosition);
    } else {
      this._worldRotation.copy(this._localRotation);
      this._worldScale.copy(this._localScale);
      this._worldPosition.copy(this._localPosition);
    }


    tempVec1.set(
      (this._origin.x - 0.5) * this._worldScale.x,
      (this._origin.y - 0.5) * this._worldScale.y,
      (this._origin.z - 0.5) * this._worldScale.z
    );


    Quat.rotateVector(this._worldRotation, tempVec1, tempVec2);
    Vec3.subtract(this._worldPosition, tempVec2, tempVec1);

    Mat4.composeTRS(tempVec1, this._worldRotation, this._worldScale, this._worldMatrix);


    Quat.rotateVector(this._worldRotation, TransformUtils.unitZ, this._forward);
    Quat.rotateVector(this._worldRotation, TransformUtils.unitY, this._up);
    Quat.rotateVector(this._worldRotation, TransformUtils.unitX, this._right);

    this._dirty = false;
  }




  public getWorldMatrix(): Mat4 {
    this._updateWorld();
    return this._worldMatrix;
  }

  public addChild(child: Transform) {
    if (child.parent) child.parent.removeChild(child);
    this.children.push(child);
    child.parent = this;
    child._markDirty();
  }

  public removeChild(child: Transform) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) this.children.splice(idx, 1);
    child.parent = null;
    child._markDirty();
  }

  public transformPointToWorldSpace(point: Vec3): Vec3 {
    this._updateWorld();
    return Mat4.multiplyVec3(this._worldMatrix, point.clone());
  }

  public clone(): Transform {
    return new Transform({
      position: this._localPosition.clone(),
      rotation: this._localRotation.clone(),
      scale: this._localScale.clone()
    });
  }
}
