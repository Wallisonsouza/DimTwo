import { Component } from "../../../../core/base/Component";
import { Bounds } from "../../../../core/math/geometry/Bounds";
import { Vec3 } from "../../../../core/math/vec3/ Vec3";
import { ComponentTypes } from "../../component-type";

export class Collider extends Component {
  isColliding: boolean;
  center: Vec3;
  isTrigger: boolean;
  collisionMask: CollisionMask;
  ignoreSelfCollisions: boolean;
  private bounds: Bounds;

  public getBounds(): Bounds {
    const t = this.getGameEntity().getTransform();

    const x = t.position.x + this.center.x - this.bounds.right / 2;
    const y = t.position.y + this.center.y - this.bounds.bottom / 2;

    this.bounds.left = x;
    this.bounds.top = y;
    this.bounds.right = x + this.bounds.right;
    this.bounds.bottom = y + this.bounds.bottom;

    return this.bounds;
  }


  constructor(type: ComponentTypes, category: ComponentTypes) {
    super(type, category);
    this.isColliding = false;
    this.center = new Vec3(0, 0, 0);
    this.isTrigger = false;
    this.collisionMask = 0;
    this.ignoreSelfCollisions = false;
    this.bounds = new Bounds();
  }
}
