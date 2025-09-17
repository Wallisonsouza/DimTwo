import type { Vec3 } from "@engine/core/math/Vec3";
import { Index, Vector } from "./vec";

export class Vec2 extends Vector {

  constructor(x = 0, y = 0) {
    super(x, y)
  }

  public static create() {
    return new Vec2(0, 0);
  }

  public static readonly Down: Vec2 = new Vec2(0, -1);
  public static readonly Zero = new Vec2(0, 0);

  // --------------------------
  // Operações in-place
  // --------------------------
  public addInPlace(v: Vec2): this {
    const d = this.data, vd = v.data;
    d[Index.X] += vd[Index.X];
    d[Index.Y] += vd[Index.Y];
    return this;
  }

  public subInPlace(v: Vec2): this {
    const d = this.data, vd = v.data;
    d[Index.X] -= vd[Index.X];
    d[Index.Y] -= vd[Index.Y];
    return this;
  }

  public scaleInPlace(scalar: number): this {
    const d = this.data;
    d[Index.X] *= scalar;
    d[Index.Y] *= scalar;
    return this;
  }

  public negativeInPlace(): this {
    const d = this.data;
    d[Index.X] *= -1;
    d[Index.Y] *= -1;
    return this;
  }

  public static negative(v: Vec2, out: Vec2): Vec2 {
    const vd = v.data;
    const od = out.data;
    od[Index.X] = -vd[Index.X];
    od[Index.Y] = -vd[Index.Y];
    return out;
  }

  public eq(v: Vec2) {
    return this.x === v.x && this.y === v.y;
  }

  get magnitude(): number {
    const d = this.data;
    return Math.hypot(d[Index.X], d[Index.Y]);
  }

  public normalizeSelf(): this {
    const d = this.data;
    const len = Math.hypot(d[Index.X], d[Index.Y]);
    if (len > 0) {
      d[Index.X] /= len;
      d[Index.Y] /= len;
    } else {
      d[Index.X] = d[Index.Y] = 0;
    }
    return this;
  }

  public set(x: number, y: number): this {
    const d = this.data;
    d[Index.X] = x;
    d[Index.Y] = y;
    return this;
  }

  static crossScalarVec2(omega: number, vec: Vec2): Vec2 {
    return new Vec2(-omega * vec.y, omega * vec.x);
  }


  public copy(other: Vec2): this {
    const d = this.data, od = other.data;
    d[Index.X] = od[Index.X];
    d[Index.Y] = od[Index.Y];
    return this;
  }


  //---------------------------Static---------------------------------------------

  public static copy(self: Vec2, target: Vec2) {
    const selfData = self.data;
    const targetData = target.data;

    targetData[Index.X] = selfData[Index.X];
    targetData[Index.Y] = selfData[Index.Y];

    return target;
  }

  public static length(v: Vec2) {
    return v.magnitude;
  }

  public static add(a: Vec2, b: Vec2, out: Vec2 = new Vec2()): Vec2 {
    const ad = a.data, bd = b.data, od = out.data;
    od[Index.X] = ad[Index.X] + bd[Index.X];
    od[Index.Y] = ad[Index.Y] + bd[Index.Y];
    return out;
  }

  public static mul(a: Vec2, b: Vec2, out: Vec2 = new Vec2()): Vec2 {
    const ad = a.data, bd = b.data, od = out.data;
    od[Index.X] = ad[Index.X] * bd[Index.X];
    od[Index.Y] = ad[Index.Y] * bd[Index.Y];
    return out;
  }

  public static sub(a: Vec2, b: Vec2, out: Vec2 = new Vec2()): Vec2 {
    const ad = a.data, bd = b.data, od = out.data;
    od[Index.X] = ad[Index.X] - bd[Index.X];
    od[Index.Y] = ad[Index.Y] - bd[Index.Y];
    return out;
  }

  public static scale(v: Vec2, scalar: number, out: Vec2 = new Vec2()): Vec2 {
    const vd = v.data, od = out.data;
    od[Index.X] = vd[Index.X] * scalar;
    od[Index.Y] = vd[Index.Y] * scalar;
    return out;
  }

  public static normalize(v: Vec2, out: Vec2 = new Vec2()): Vec2 {
    const vd = v.data, od = out.data;
    const len = Math.hypot(vd[Index.X], vd[Index.Y]);
    if (len > 0) {
      od[Index.X] = vd[Index.X] / len;
      od[Index.Y] = vd[Index.Y] / len;
    } else {
      od[Index.X] = od[Index.Y] = 0;
    }
    return out;
  }

  public static lerp(a: Vec2, b: Vec2, t: number, out: Vec2 = new Vec2()): Vec2 {
    const ad = a.data, bd = b.data, od = out.data;
    od[Index.X] = ad[Index.X] + (bd[Index.X] - ad[Index.X]) * t;
    od[Index.Y] = ad[Index.Y] + (bd[Index.Y] - ad[Index.Y]) * t;
    return out;
  }

  public static dot(a: Vec2, b: Vec2): number {
    const ad = a.data, bd = b.data;
    return ad[Index.X] * bd[Index.X] + ad[Index.Y] * bd[Index.Y];
  }

  public static cross(a: Vec2, b: Vec2): number {
    const ad = a.data, bd = b.data;
    return ad[Index.X] * bd[Index.Y] - ad[Index.Y] * bd[Index.X];
  }

  public static lenSq(v: Vec2): number {
    const data = v.data;
    return data[Index.X] * data[Index.X] + data[Index.Y] * data[Index.Y];
  }

  public static distance(a: Vec2, b: Vec2): number {
    const ad = a.data, bd = b.data;
    const dx = bd[Index.X] - ad[Index.X];
    const dy = bd[Index.Y] - ad[Index.Y];
    return Math.hypot(dx, dy);
  }

  public static fromVec3(v: Vec3, out: Vec2 = new Vec2()): Vec2 {
    const vd = v.data, od = out.data;
    od[Index.X] = vd[Index.X];
    od[Index.Y] = vd[Index.Y];
    return out;
  }

  // --------------------------
  // Clonagem e utilitários
  // --------------------------
  public clone(): Vec2 {
    const d = this.data;
    return new Vec2(d[Index.X], d[Index.Y]);
  }

  public toString(): string {
    const d = this.data;
    return `Vec2(x: ${d[Index.X].toFixed(2)}, y: ${d[Index.Y].toFixed(2)})`;
  }

  public static vec2ArrayTof32Array(vectors: Vec2[], out?: Float32Array): Float32Array {
    if (!out || out.length < vectors.length * 2) out = new Float32Array(vectors.length * 2);
    for (let i = 0; i < vectors.length; i++) {
      const v = vectors[i].data;
      out[i * 2] = v[Index.X];
      out[i * 2 + 1] = v[Index.Y];
    }
    return out;
  }
}
