import { Vec2 } from "@engine/core/math/Vec2";
import { CollisionLayer } from "@engine/modules/shared/physics/CollisionLayer";
import { Component } from "../../core/base/Component";
import { ComponentGroup } from "../enums/ComponentGroup";
import { ComponentType } from "../enums/ComponentType";
import { Bounds2D } from "./Bounds2D";

export interface Collider2DOptions {
  center?: Vec2;
  size?: Vec2;
  isTrigger?: boolean;
  collisionLayer?: CollisionLayer;
  ignoreSelfCollisions?: boolean;
}

export abstract class Collider2D extends Component {
  isColliding: boolean;
  center: Vec2;
  size: Vec2;
  isTrigger: boolean;
  collisionLayer: number;
  ignoreSelfCollisions: boolean;
  private _bounds: Bounds2D;

  constructor(type: ComponentType, options?: Collider2DOptions) {
    super(type, ComponentGroup.Collider, {});
    this.isColliding = false;
    this.center = options?.center ?? new Vec2(0, 0);
    this.size = options?.size ?? new Vec2(1, 1);
    this.isTrigger = options?.isTrigger ?? false;
    this.collisionLayer = options?.collisionLayer ?? CollisionLayer.Default;
    this.ignoreSelfCollisions = options?.ignoreSelfCollisions ?? true;
    this._bounds = new Bounds2D(this.center, this.size);
  }

  public abstract intersects(other: Collider2D): boolean;

  public getBounds(): Bounds2D {
    this._bounds.updateWithOffset(
      this.center, this.size,
      Vec2.fromVec3(this.transform.position),
      Vec2.fromVec3(this.transform.scale)
    );
    return this._bounds;
  }
  public copyBase(target: Collider2D) {
    target.isColliding = this.isColliding;
    target.center = this.center.clone();
    target.size = this.size.clone();
    target.isTrigger = this.isTrigger;
    target.collisionLayer = this.collisionLayer;
    target.ignoreSelfCollisions = this.ignoreSelfCollisions;
  }
}