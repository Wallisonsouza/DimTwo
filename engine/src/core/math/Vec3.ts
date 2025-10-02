import { Index, Vector } from "./vec";
import { Vec2 } from "./Vec2";

export class Vec3 extends Vector {

  public static random(min: number = 0, max: number = 1): Vec3 {
    const rand = () => Math.random() * (max - min) + min;
    return new Vec3(rand(), rand(), rand());
  }


  public static readonly UP = Object.freeze(new Vec3(0, 1, 0));
  public static readonly DOWN = Object.freeze(new Vec3(0, -1, 0));
  public static readonly LEFT = Object.freeze(new Vec3(-1, 0, 0));
  public static readonly RIGHT = Object.freeze(new Vec3(1, 0, 0));
  public static readonly FORWARD = Object.freeze(new Vec3(0, 0, 1));
  public static readonly BACKWARD = Object.freeze(new Vec3(0, 0, -1));

  public toVec2() {
    return new Vec2(this.data[Index.X], this.data[Index.Y])
  }

  public get xy() {
    return new Vec2(this.data[Index.X], this.data[Index.Y])
  }

  constructor(x = 0, y = 0, z = 0) {
    super(x, y, z)
  }

  public set(other: Vec3): this {
    const d = this.data;
    const o = other.data;
    d[Index.X] = o[Index.X];
    d[Index.Y] = o[Index.Y];
    d[Index.Z] = o[Index.Z];
    return this;
  }

  public setFromNumber(x: number, y: number, z: number): this {
    const d = this.data;

    d[Index.X] = x;
    d[Index.Y] = y;
    d[Index.Z] = z;
    return this;
  }

  public addInPlace(v: Vec3): this {
    const d = this.data, vd = v.data;
    d[Index.X] += vd[Index.X];
    d[Index.Y] += vd[Index.Y];
    d[Index.Z] += vd[Index.Z];
    return this;
  }

  public static add(a: Vec3, b: Vec3, out: Vec3 = new Vec3()): Vec3 {
    const ad = a.data, bd = b.data, od = out.data;
    od[Index.X] = ad[Index.X] + bd[Index.X];
    od[Index.Y] = ad[Index.Y] + bd[Index.Y];
    od[Index.Z] = ad[Index.Z] + bd[Index.Z];
    return out;
  }

  public subInPlace(v: Vec3): this {
    const d = this.data, vd = v.data;
    d[Index.X] -= vd[Index.X];
    d[Index.Y] -= vd[Index.Y];
    d[Index.Z] -= vd[Index.Z];
    return this;
  }

  public normalizeInPlace(): this {
    const d = this.data;
    const len = Math.hypot(d[Index.X], d[Index.Y], d[Index.Z]);
    if (len > 0) {
      d[Index.X] /= len;
      d[Index.Y] /= len;
      d[Index.Z] /= len;
    } else {
      d[Index.X] = d[Index.Y] = d[Index.Z] = 0;
    }
    return this;
  }

  public add(other: Vec3, out: Vec3 = new Vec3()): Vec3 {
    const d = this.data, od = out.data, odOther = other.data;
    od[Index.X] = d[Index.X] + odOther[Index.X];
    od[Index.Y] = d[Index.Y] + odOther[Index.Y];
    od[Index.Z] = d[Index.Z] + odOther[Index.Z];
    return out;
  }

  public static mul(a: Vec3, b: Vec3, out: Vec3 = new Vec3()): Vec3 {
    const ad = a.data, bd = b.data, od = out.data;
    od[Index.X] = ad[Index.X] * bd[Index.X];
    od[Index.Y] = ad[Index.Y] * bd[Index.Y];
    od[Index.Z] = ad[Index.Z] * bd[Index.Z];
    return out;
  }


  public static sub(a: Vec3, b: Vec3, out: Vec3 = new Vec3()): Vec3 {
    const ad = a.data, bd = b.data, od = out.data;
    od[Index.X] = ad[Index.X] - bd[Index.X];
    od[Index.Y] = ad[Index.Y] - bd[Index.Y];
    od[Index.Z] = ad[Index.Z] - bd[Index.Z];
    return out;
  }

  public static scale(v: Vec3, scalar: number, out: Vec3 = new Vec3()): Vec3 {
    const vd = v.data, od = out.data;
    od[Index.X] = vd[Index.X] * scalar;
    od[Index.Y] = vd[Index.Y] * scalar;
    od[Index.Z] = vd[Index.Z] * scalar;
    return out;
  }

  public static lerp(a: Vec3, b: Vec3, t: number, out: Vec3 = new Vec3()): Vec3 {
    const ad = a.data, bd = b.data, od = out.data;
    od[Index.X] = ad[Index.X] + (bd[Index.X] - ad[Index.X]) * t;
    od[Index.Y] = ad[Index.Y] + (bd[Index.Y] - ad[Index.Y]) * t;
    od[Index.Z] = ad[Index.Z] + (bd[Index.Z] - ad[Index.Z]) * t;
    return out;
  }

  public static dot(a: Vec3, b: Vec3): number {
    const ad = a.data, bd = b.data;
    return ad[Index.X] * bd[Index.X] +
      ad[Index.Y] * bd[Index.Y] +
      ad[Index.Z] * bd[Index.Z];
  }

  public static cross(out: Vec3, a: Vec3, b: Vec3): Vec3 {
    const ad = a.data, bd = b.data, od = out.data;
    const ax = ad[Index.X], ay = ad[Index.Y], az = ad[Index.Z];
    const bx = bd[Index.X], by = bd[Index.Y], bz = bd[Index.Z];

    od[Index.X] = ay * bz - az * by;
    od[Index.Y] = az * bx - ax * bz;
    od[Index.Z] = ax * by - ay * bx;
    return out;
  }

  public static normalize(v: Vec3, out: Vec3): Vec3 {
    const vd = v.data;
    const od = out.data;

    const len = Math.hypot(vd[Index.X], vd[Index.Y], vd[Index.Z]);
    if (len > 0) {
      od[Index.X] = vd[Index.X] / len;
      od[Index.Y] = vd[Index.Y] / len;
      od[Index.Z] = vd[Index.Z] / len;
    } else {
      od[Index.X] = od[Index.Y] = od[Index.Z] = 0;
    }

    return out;
  }


  public static distance(a: Vec3, b: Vec3): number {
    const ad = a.data, bd = b.data;
    const dx = bd[Index.X] - ad[Index.X];
    const dy = bd[Index.Y] - ad[Index.Y];
    const dz = bd[Index.Z] - ad[Index.Z];
    return Math.hypot(dx, dy, dz);
  }

  public static fromVec2(v: Vec2, out: Vec3 = new Vec3()): Vec3 {
    const vd = v.data, od = out.data;
    od[Index.X] = vd[Index.X];
    od[Index.Y] = vd[Index.Y];
    od[Index.Z] = 0;
    return out;
  }
















  public length(): number {
    const d = this.data;
    return Math.hypot(d[Index.X], d[Index.Y], d[Index.Z]);
  }

  public clone(): Vec3 {
    const d = this.data;
    return new Vec3(d[Index.X], d[Index.Y], d[Index.Z]);
  }

  public cloneToVec2(): Vec2 {
    const d = this.data;
    return new Vec2(d[Index.X], d[Index.Y]);
  }

  public toString(): string {
    const d = this.data;
    return `Vec3(${d[Index.X].toFixed(2)}, ${d[Index.Y].toFixed(2)}, ${d[Index.Z].toFixed(2)})`;
  }
}
