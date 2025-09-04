import { Vec2 } from "./Vec2";

export class Vec3 {
  public x: number;
  public y: number;
  public z: number;

  public toString() {
    return `Vec3(${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)})`
  }

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public static lerp(a: Vec3, b: Vec3, t: number, out: Vec3): Vec3 {
    out.x = a.x + (b.x - a.x) * t;
    out.y = a.y + (b.y - a.y) * t;
    out.z = a.z + (b.z - a.z) * t;
    return out;
  }

  static distanceTo(a: Vec3, b: Vec3): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dz = b.z - a.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  public static sub(a: Vec3, b: Vec3, out: Vec3 = new Vec3()): Vec3 {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    out.z = a.z - b.z;
    return out;
  }

  public subtractInplace(other: Vec3): this {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
    return this;
  }

  public normalizeInPlace(): this {
    const length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    if (length === 0) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      return this;
    }
    this.x /= length;
    this.y /= length;
    this.z /= length;
    return this;
  }


  public set(x: number | Vec3, y?: number, z?: number): this {
    if (x instanceof Vec3) {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
    } else {
      this.x = x;
      this.y = y ?? this.y;
      this.z = z ?? this.z;
    }
    return this;
  }

  equals(v: Vec3): boolean {
    return this.x === v.x && this.y === v.y && this.z === v.z;
  }

  public static mult(out: Vec3, a: Vec3, b: Vec3): Vec3 {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    out.z = a.z * b.z;
    return out;
  }

  public static scale(a: Vec3, scalar: number, out: Vec3 = new Vec3()): Vec3 {
    out.x = a.x * scalar;
    out.y = a.y * scalar;
    out.z = a.z * scalar;
    return out;
  }

  public static cross(out: Vec3, a: Vec3, b: Vec3): Vec3 {
    out.x = a.y * b.z - a.z * b.y;
    out.y = a.z * b.x - a.x * b.z;
    out.z = a.x * b.y - a.y * b.x;
    return out;
  }

  public static add(a: Vec3, b: Vec3, out: Vec3 = new Vec3()): Vec3 {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    out.z = a.z + b.z;
    return out;
  }
  public addInPlace(other: Vec3): this {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    return this;
  }

  public static fromVec2(v: Vec2) {
    return new Vec3(v.x, v.y);
  }

  public static normalize(v: Vec3, out: Vec3 = new Vec3()) {
    const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

    if (length > 0) {
      out.x = v.x / length;
      out.y = v.y / length;
      out.z = v.z / length;
    } else {
      out.x = 0;
      out.y = 0;
      out.z = 0;
    }

    return out;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  public clone() {
    return new Vec3(this.x, this.y, this.z);
  }

  public cloneToVec2() {
    return new Vec2(this.x, this.y);
  }


  public scale(scalar: number) {
    return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  public static dot(a: Vec3, b: Vec3): number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  public static normalizeVec3(v: Vec3): Vec3 {
    const length = Math.hypot(v.x, v.y, v.z);
    return length > 0
      ? new Vec3(v.x / length, v.y / length, v.z / length)
      : new Vec3(0, 0, 0);
  }

  public static vec3Tof32Arr(vectors: Vec3[], out?: Float32Array): Float32Array {
    if (!out || out.length < vectors.length * 3) {
      out = new Float32Array(vectors.length * 3);
    }
    for (let i = 0; i < vectors.length; i++) {
      const v = vectors[i];
      out[i * 3] = v.x;
      out[i * 3 + 1] = v.y;
      out[i * 3 + 2] = v.z;
    }
    return out;
  }
}