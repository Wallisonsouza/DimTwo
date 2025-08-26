import { Vec2 } from "@engine/core/math/Vec2";
import { Component } from "../../../../core/base/Component";
import type { ComponentGroup } from "../../../enums/ComponentGroup";
import { ComponentType } from "../../../enums/ComponentType";
import type { CollisionMask } from "../../../physics/collision/CollisionLayer";
import { Bounds2D } from "./Bounds2D";

export interface ColliderOptions {
  center?: Vec2;
  size?: Vec2;
  isTrigger?: boolean;
  collisionMask?: CollisionMask;
  ignoreSelfCollisions?: boolean;
}

export abstract class Collider2D extends Component {
  isColliding: boolean;
  center: Vec2;
  size: Vec2;
  isTrigger: boolean;
  collisionMask: CollisionMask;
  ignoreSelfCollisions: boolean;
  bounds: Bounds2D;

  constructor(type: ComponentType, group: ComponentGroup, options: ColliderOptions) {
    super(type, group);

    this.isColliding = false;
    this.center = options.center ?? new Vec2(0, 0);
    this.size = options.size ?? new Vec2(1, 1);
    this.isTrigger = options.isTrigger ?? false;
    this.collisionMask = options.collisionMask ?? 0;
    this.ignoreSelfCollisions = options.ignoreSelfCollisions ?? true;
    this.bounds = new Bounds2D();
  }

  public updateBounds(worldPosition: Vec2) {
    const worldCenter = new Vec2(
      this.center.x + worldPosition.x,
      this.center.y + worldPosition.y
    );

    this.bounds.setFromCenterAndSize(worldCenter, this.size);
  }

  public abstract intersects(  other: Collider2D): boolean;
  
 
}