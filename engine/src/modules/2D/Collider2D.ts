import { Component } from "../../core/base/Component";
import { Vec2 } from "../../core/math/Vec2";
import { ComponentGroup } from "../enums/ComponentGroup";
import { ComponentType } from "../enums/ComponentType";
import { CollisionLayer } from "../shared/physics/CollisionLayer";
import { Bounds2D } from "./Bounds2D";
import { PhysicsMaterial } from "./PhysicsMaterial";
import type { RaycastHit2D } from "./RayCast2D";


import type { Contact2D } from "./SAT";



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
  public contacts: Contact2D[] = [];
  center: Vec2;
  size: Vec2;
  isTrigger: boolean;
  collisionLayer: number;
  ignoreSelfCollisions: boolean;
  public physicsMaterial: PhysicsMaterial;

  private _boundingBox: Bounds2D;

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

  constructor(type: ComponentType, options: Collider2DOptions = {}) {
    super(type, ComponentGroup.Collider, {});
    this.isColliding = false;
    this.center = options.center ?? new Vec2(0, 0);
    this.size = options.size ?? new Vec2(1, 1);
    this.isTrigger = options.isTrigger ?? false;
    this.collisionLayer = options.collisionLayer ?? CollisionLayer.Default;
    this.ignoreSelfCollisions = options.ignoreSelfCollisions ?? true;
    this.physicsMaterial = options.physicsMaterial ?? new PhysicsMaterial();
    this._boundingBox = new Bounds2D(this.center, this.size);
  }

  public copyBase(target: Collider2D) {
    target.isColliding = this.isColliding;
    target.center = this.center.clone();
    target.size = this.size.clone();
    target.isTrigger = this.isTrigger;
    target.collisionLayer = this.collisionLayer;
    target.ignoreSelfCollisions = this.ignoreSelfCollisions;
  }
  abstract intersects(other: Collider2D): any;
  abstract intersectRay(origin: Vec2, direction: Vec2, maxDistance: number): RaycastHit2D | null;
}