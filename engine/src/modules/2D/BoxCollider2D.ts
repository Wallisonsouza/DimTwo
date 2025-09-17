import { Mat4 } from "@engine/core/math/Mat4";
import { Index } from "@engine/core/math/vec";
import { Vec2 } from "@engine/core/math/Vec2";
import { ComponentType } from "../enums/ComponentType";
import { Collider2D, type Collider2DOptions } from "./Collider2D";

export interface BoxCollider2DOptions extends Collider2DOptions { }

export class ReadonlyVec2 {
  private _data: Float32Array;

  constructor(v: Vec2) {
    this._data = v.data;
  }

  get x(): number { return this._data[Index.X]; }
  get y(): number { return this._data[Index.Y]; }

  clone() {
    return new Vec2(this._data[Index.X], this._data[Index.Y]);
  }

}

enum Vertice {
  TopRight = 0,
  BottomRight = 1,
  TopLeft = 2,
  BottomLeft = 3
}

export class BoxCollider2D extends Collider2D {

  private readonly localVertices: Vec2[] = [
    Vec2.create(), Vec2.create(), Vec2.create(), Vec2.create()
  ];

  private readonly worldVertices: Vec2[] = [
    Vec2.create(), Vec2.create(), Vec2.create(), Vec2.create()
  ];

  private readonly worldVerticesView: ReadonlyVec2[] = [
    new ReadonlyVec2(this.worldVertices[0]),
    new ReadonlyVec2(this.worldVertices[1]),
    new ReadonlyVec2(this.worldVertices[2]),
    new ReadonlyVec2(this.worldVertices[3]),
  ];

  public getVerticesTransformedToWorld(): ReadonlyArray<ReadonlyVec2> {
    const half = Vec2.scale(this.size, 0.5);
    const offset = this.center;

    this.localVertices[Vertice.TopRight].set(+half.x + offset.x, +half.y + offset.y);
    this.localVertices[Vertice.BottomRight].set(+half.x + offset.x, -half.y + offset.y);
    this.localVertices[Vertice.TopLeft].set(-half.x + offset.x, +half.y + offset.y);
    this.localVertices[Vertice.BottomLeft].set(-half.x + offset.x, -half.y + offset.y);

    const m = this.transform.getWorldMatrix();

    Mat4.multiplyVec2(m, this.localVertices[Vertice.TopRight], this.worldVertices[Vertice.TopRight]);
    Mat4.multiplyVec2(m, this.localVertices[Vertice.BottomRight], this.worldVertices[Vertice.BottomRight]);
    Mat4.multiplyVec2(m, this.localVertices[Vertice.TopLeft], this.worldVertices[Vertice.TopLeft]);
    Mat4.multiplyVec2(m, this.localVertices[Vertice.BottomLeft], this.worldVertices[Vertice.BottomLeft]);

    return this.worldVerticesView;
  }

  constructor(options?: BoxCollider2DOptions) {
    super(ComponentType.BoxCollider2D, options);
  }

  clone(): BoxCollider2D {
    const clone = new BoxCollider2D();
    this.copyBase(clone);
    return clone;
  }
}

