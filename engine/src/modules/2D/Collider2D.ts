import { Vec2 } from "@engine/core/math/Vec2";
import { Component } from "../../core/base/Component";
import type { ComponentGroup } from "../enums/ComponentGroup";
import { ComponentType } from "../enums/ComponentType";

import { Color } from "@engine/core/math/Color";
import { CollisionLayer } from "@engine/modules/shared/physics/CollisionLayer";
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
  debugColor: Color = Color.Green;

  public getBounds(): Bounds2D {

    const position = Vec2.fromVec3(this.transform.position);
    const scale = Vec2.fromVec3(this.transform.scale);

    const worldCenter = this.center.add(position);
    const scaledSize = this.size.mul(scale);

    this._bounds.setFromCenterAndSize(worldCenter, scaledSize);
    return this._bounds;
  }

  constructor(type: ComponentType, group: ComponentGroup, options?: Collider2DOptions) {
    super(type, group, {});
    this.isColliding = false;
    this.center = options?.center ?? new Vec2(0, 0);
    this.size = options?.size ?? new Vec2(1, 1);
    this.isTrigger = options?.isTrigger ?? false;
    this.collisionLayer = options?.collisionLayer ?? CollisionLayer.Default;
    this.ignoreSelfCollisions = options?.ignoreSelfCollisions ?? true;
    this._bounds = new Bounds2D();
  }

  public copyBase(target: Collider2D) {
    target.isColliding = this.isColliding;
    target.center = this.center.clone();
    target.size = this.size.clone();
    target.isTrigger = this.isTrigger;
    target.collisionLayer = this.collisionLayer;
    target.ignoreSelfCollisions = this.ignoreSelfCollisions;
  }








  public abstract intersects(other: Collider2D): boolean;
}