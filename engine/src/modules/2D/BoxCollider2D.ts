import { Quat } from "@engine/core/math/quat";
import { Vec2 } from "@engine/core/math/Vec2";
import { ComponentType } from "../enums/ComponentType";
import { Collider2D, type Collider2DOptions } from "./Collider2D";

export interface BoxCollider2DOptions extends Collider2DOptions { }

class OBB2D {
  public readonly vertices: Vec2[] = [new Vec2(), new Vec2(), new Vec2(), new Vec2()];
  public readonly axes: Vec2[] = [new Vec2(), new Vec2()];

  public center: Vec2 = new Vec2();
  public size: Vec2 = new Vec2();
  public rotation: number = 0;
  private dirty: boolean = true;

  markDirty() { this.dirty = true; }

  update() {
    if (!this.dirty) return;

    const hw = (this.size.x * 0.5);
    const hh = (this.size.y * 0.5);
    const cos = Math.cos(this.rotation);
    const sin = Math.sin(this.rotation);

    const cx = this.center.x;
    const cy = this.center.y;

    this.vertices[0].set(cx + (-hw * cos - -hh * sin), cy + (-hw * sin + -hh * cos));
    this.vertices[1].set(cx + (hw * cos - -hh * sin), cy + (hw * sin + -hh * cos));
    this.vertices[2].set(cx + (hw * cos - hh * sin), cy + (hw * sin + hh * cos));
    this.vertices[3].set(cx + (-hw * cos - hh * sin), cy + (-hw * sin + hh * cos));

    for (let i = 0; i < 2; i++) {
      const edge = Vec2.sub(this.vertices[i + 1], this.vertices[i], this.axes[i]);
      const len = Math.hypot(edge.x, edge.y);
      if (len > 0) {
        edge.x /= len;
        edge.y /= len;
      }
    }

    this.dirty = false;
  }

  getVertices() {
    this.update();
    return this.vertices;
  }

  getAxes() {
    this.update();
    return this.axes;
  }
}

export class BoxCollider2D extends Collider2D {
  private _obb: OBB2D = new OBB2D();

  public get obb() {
    this._obb.center.set(
      this.center.x + this.transform.position.x,
      this.center.y + this.transform.position.y
    );

    this._obb.size.set(
      this.size.x * this.transform.scale.x,
      this.size.y * this.transform.scale.y
    );

    this._obb.rotation = Quat.getRotationZFromQuat(this.transform.rotation);
    this._obb.markDirty();
    return this._obb;
  }

  constructor(options?: BoxCollider2DOptions) {
    super(ComponentType.BoxCollider2D, options);
  }

  intersects(other: BoxCollider2D): { axis: Vec2, overlap: number, normal: Vec2 } | null {
    const aVerts = this.obb.getVertices();
    const bVerts = other.obb.getVertices();

    const axesA = this.obb.getAxes();
    const axesB = other.obb.getAxes();

    let minOverlap = Number.POSITIVE_INFINITY;
    const smallestAxis = new Vec2();

    for (let i = 0; i < axesA.length; i++) {
      const overlap = this.testAxis(aVerts, bVerts, axesA[i]);
      if (overlap === null) return null;
      if (overlap < minOverlap) {
        minOverlap = overlap;
        Vec2.copy(axesA[i], smallestAxis);
      }
    }

    for (let i = 0; i < axesB.length; i++) {
      const overlap = this.testAxis(aVerts, bVerts, axesB[i]);
      if (overlap === null) return null;
      if (overlap < minOverlap) {
        minOverlap = overlap;
        Vec2.copy(axesB[i], smallestAxis);
      }
    }

    const centerA = this.obb.center;
    const centerB = other.obb.center;
    const distanceAlongAxis = Vec2.dot(
      Vec2.sub(centerB, centerA, new Vec2()
      ), smallestAxis);

    const normal = smallestAxis.clone();
    if (distanceAlongAxis < 0) normal.scaleInPlace(-1);

    return { axis: smallestAxis, overlap: minOverlap, normal };
  }






  private testAxis(aVerts: Vec2[], bVerts: Vec2[], axis: Vec2): number | null {
    let minA = Number.POSITIVE_INFINITY;
    let maxA = Number.NEGATIVE_INFINITY;
    let minB = Number.POSITIVE_INFINITY;
    let maxB = Number.NEGATIVE_INFINITY;

    for (const v of aVerts) {
      const p = Vec2.dot(axis, v);
      minA = Math.min(minA, p);
      maxA = Math.max(maxA, p);
    }

    for (const v of bVerts) {
      const p = Vec2.dot(axis, v);
      minB = Math.min(minB, p);
      maxB = Math.max(maxB, p);
    }

    if (maxA < minB || maxB < minA) return null;
    return Math.min(maxA, maxB) - Math.max(minA, minB);
  }


  clone(): BoxCollider2D {
    const clone = new BoxCollider2D();
    this.copyBase(clone);
    return clone;
  }
}
