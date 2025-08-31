import { Vec2 } from "@engine/core/math/Vec2";
import { Component } from "../../../../core/base/Component";
import type { ComponentGroup } from "../../../enums/ComponentGroup";
import { ComponentType } from "../../../enums/ComponentType";

import { CollisionLayer } from "@engine/modules/physics/collision/CollisionLayer";
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
  bounds: Bounds2D;

  constructor(type: ComponentType, group: ComponentGroup, options?: Collider2DOptions) {
    super(type, group, {});
    this.isColliding = false;
    this.center = options?.center ?? new Vec2(0, 0);
    this.size = options?.size ?? new Vec2(1, 1);
    this.isTrigger = options?.isTrigger ?? false;
    this.collisionLayer = options?.collisionLayer ?? CollisionLayer.Default;
    this.ignoreSelfCollisions = options?.ignoreSelfCollisions ?? true;
    this.bounds = new Bounds2D();
  }

  public updateBounds(worldPosition: Vec2, scale: Vec2) {
    const worldCenter = new Vec2(
      this.center.x + worldPosition.x,
      this.center.y + worldPosition.y
    );

    const scaledSize = new Vec2(
      this.size.x * scale.x,
      this.size.y * scale.y
    );

    this.bounds.setFromCenterAndSize(worldCenter, scaledSize);
  }

  public abstract intersects(other: Collider2D): boolean;
}