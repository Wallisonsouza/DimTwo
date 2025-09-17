import { Mat4 } from "@engine/core/math/Mat4";
import { Vec2 } from "@engine/core/math/Vec2";
import { ComponentType } from "../enums/ComponentType";
import { Collider2D, type Collider2DOptions } from "./Collider2D";
import { SAT } from "./SAT";

export interface BoxCollider2DOptions extends Collider2DOptions { }

export class BoxCollider2D extends Collider2D {

  private readonly localVertices: Vec2[] = [
    Vec2.create(), Vec2.create(), Vec2.create(), Vec2.create()
  ];

  private readonly worldVertices: Vec2[] = [
    Vec2.create(), Vec2.create(), Vec2.create(), Vec2.create()
  ];

  public readonly axes: Vec2[] = [
    Vec2.create(), Vec2.create()
  ];

  constructor(options?: BoxCollider2DOptions) {
    super(ComponentType.BoxCollider2D, options);
  }

  public getVerticesTransformedToWorld(): Vec2[] {
    const half = Vec2.scale(this.size, 0.5);
    const offset = this.center;


    this.localVertices[0].set(-half.x + offset.x, +half.y + offset.y);      // 0: top-left
    this.localVertices[1].set(+half.x + offset.x, +half.y + offset.y);      // 1: top-right
    this.localVertices[2].set(+half.x + offset.x, -half.y + offset.y);      // 2: bottom-right
    this.localVertices[3].set(-half.x + offset.x, -half.y + offset.y);      // 3: bottom-left

    const worldMatrix = this.transform.getWorldMatrix();

    Mat4.multiplyVec2(worldMatrix, this.localVertices[0], this.worldVertices[0]);
    Mat4.multiplyVec2(worldMatrix, this.localVertices[1], this.worldVertices[1]);
    Mat4.multiplyVec2(worldMatrix, this.localVertices[2], this.worldVertices[2]);
    Mat4.multiplyVec2(worldMatrix, this.localVertices[3], this.worldVertices[3]);

    this.axes[0].copy(Vec2.sub(this.worldVertices[1], this.worldVertices[0], this.axes[0])).normalizeSelf();
    this.axes[1].copy(Vec2.sub(this.worldVertices[3], this.worldVertices[0], this.axes[1])).normalizeSelf();

    return this.worldVertices;
  }

  clone(): BoxCollider2D {
    const clone = new BoxCollider2D();
    this.copyBase(clone);
    return clone;
  }

  intersects(other: BoxCollider2D): boolean {
    const aVertices = this.getVerticesTransformedToWorld();
    const bVertices = other.getVerticesTransformedToWorld();

    const hasSATIntesection = SAT.intersects(
      aVertices, bVertices,
      this.axes, other.axes
    )

    return hasSATIntesection;
  }

  containsPoint(point: Vec2): boolean {
    const aVertices = this.getVerticesTransformedToWorld();

    const hasSATIntesection = SAT.containsPoint(
      aVertices,
      this.axes,
      point
    )

    return hasSATIntesection;
  }
}

