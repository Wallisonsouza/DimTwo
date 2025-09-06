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
  private obb: OBB2D = new OBB2D();

  constructor(options?: BoxCollider2DOptions) {
    super(ComponentType.BoxCollider2D, options);
  }

  private updateOBB() {
    this.obb.center.set(
      this.center.x + this.transform.position.x,
      this.center.y + this.transform.position.y
    );

    this.obb.size.set(
      this.size.x * this.transform.scale.x,
      this.size.y * this.transform.scale.y
    );

    this.obb.rotation = Quat.getRotationZFromQuat(this.transform.rotation);
    this.obb.markDirty();
  }

  getVertices(): Vec2[] {
    this.updateOBB();
    return this.obb.getVertices();
  }

  getAxes(): Vec2[] {
    this.updateOBB();
    return this.obb.getAxes();
  }

  intersects(other: Collider2D): boolean {
    if (!(other instanceof BoxCollider2D)) return false;

    const aVerts = this.getVertices();
    const bVerts = other.getVertices();

    const axesA = this.getAxes();
    const axesB = other.getAxes();

    for (let i = 0; i < axesA.length; i++) {
      if (!this.testAxis(aVerts, bVerts, axesA[i])) return false;
    }
    for (let i = 0; i < axesB.length; i++) {
      if (!this.testAxis(aVerts, bVerts, axesB[i])) return false;
    }

    return true;
  }

  private testAxis(aVerts: Vec2[], bVerts: Vec2[], axis: Vec2): boolean {
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

    return !(maxA < minB || maxB < minA);
  }

  clone(): BoxCollider2D {
    const clone = new BoxCollider2D();
    this.copyBase(clone);
    return clone;
  }
}
