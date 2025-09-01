import { ComponentGroup } from "../enums/ComponentGroup";
import { ComponentType } from "../enums/ComponentType";
import { Collider2D, type Collider2DOptions } from "./Collider2D";

export interface BoxCollider2DOptions extends Collider2DOptions { }

export class BoxCollider2D extends Collider2D {

  constructor(options?: BoxCollider2DOptions) {
    super(ComponentType.BoxCollider2D, ComponentGroup.Collider, options);
  }

  clone(): BoxCollider2D {
    const clone = new BoxCollider2D();

    this.copyBase(clone);
    return clone;
  }

  intersects(other: Collider2D): boolean {
    if (other instanceof BoxCollider2D) {
      return this.bounds.intersects(other.bounds);
    }
    return false;
  }
}
