import { Vec2 } from "@engine/core/math/Vec2";
import { CollisionLayer } from "@engine/modules/shared/physics/CollisionLayer";
import { Component } from "../../core/base/Component";
import { ComponentGroup } from "../enums/ComponentGroup";
import { ComponentType } from "../enums/ComponentType";
import { Bounds2D } from "./Bounds2D";
import { PhysicsMaterial } from "./PhysicsMaterial";

export interface Collider2DOptions {
  center?: Vec2;
  size?: Vec2;
  isTrigger?: boolean;
  collisionLayer?: CollisionLayer;
  ignoreSelfCollisions?: boolean;
  physicsMaterial?: PhysicsMaterial;
}

export abstract class Collider2D extends Component {
  isColliding: boolean;
  public contacts: Vec2[] = [];
  center: Vec2;
  size: Vec2;
  isTrigger: boolean;
  collisionLayer: number;
  ignoreSelfCollisions: boolean;
  public physicsMaterial: PhysicsMaterial;

  private _boundingBox: Bounds2D;


  constructor(type: ComponentType, options?: Collider2DOptions) {
    super(type, ComponentGroup.Collider, {});
    this.isColliding = false;
    this.center = options?.center ?? new Vec2(0, 0);
    this.size = options?.size ?? new Vec2(1, 1);
    this.isTrigger = options?.isTrigger ?? false;
    this.collisionLayer = options?.collisionLayer ?? CollisionLayer.Default;
    this.ignoreSelfCollisions = options?.ignoreSelfCollisions ?? true;
    this.physicsMaterial = options?.physicsMaterial ?? new PhysicsMaterial();
    this._boundingBox = new Bounds2D(this.center, this.size);
  }

  /* public abstract intersects(other: Collider2D): Contact2D[] | null; */

  public copyBase(target: Collider2D) {
    target.isColliding = this.isColliding;
    target.center = this.center.clone();
    target.size = this.size.clone();
    target.isTrigger = this.isTrigger;
    target.collisionLayer = this.collisionLayer;
    target.ignoreSelfCollisions = this.ignoreSelfCollisions;
  }


  public get boundingBox() {
    const scale = Vec2.fromVec3(this.transform.scale);
    const correctedScale = new Vec2(Math.abs(scale.x), Math.abs(scale.y));

    this._boundingBox.updateWithOffset(
      this.center,
      this.size,
      Vec2.fromVec3(this.transform.position),
      correctedScale
    );
    return this._boundingBox;
  }
}