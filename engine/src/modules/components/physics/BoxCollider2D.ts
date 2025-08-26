import { ComponentGroup } from "../../enums/ComponentGroup";
import { ComponentType } from "../../enums/ComponentType";
import { Collider2D, type ColliderOptions } from "./collider/Collider2D";

export interface BoxCollider2DOptions extends ColliderOptions { }

export class BoxCollider2D extends Collider2D {

  constructor(options: BoxCollider2DOptions = {}) {
    super(ComponentType.BoxCollider2D, ComponentGroup.Collider, options);

  }

  clone(): BoxCollider2D {
    return new BoxCollider2D({
      size: this.size
    })

  }

  intersects(other: Collider2D): boolean {
    if (other instanceof BoxCollider2D) {
      return this.intersectsBoxBox(this, other);
    }
    return false;
  }

  intersectsBoxBox(a: BoxCollider2D, b: BoxCollider2D): boolean {

    return (
      a.bounds.min.x <= b.bounds.max.x &&
      a.bounds.max.x >= b.bounds.min.x &&
      a.bounds.min.y <= b.bounds.max.y &&
      a.bounds.max.y >= b.bounds.min.y
    );
  }
}
