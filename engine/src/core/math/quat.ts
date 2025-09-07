import { Mathf } from "./Mathf";
import type { Vec3 } from "./Vec3";

export class Quat {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  public multiplyInPlace(other: Quat) {
    const ax = this.x, ay = this.y, az = this.z, aw = this.w;
    const bx = other.x, by = other.y, bz = other.z, bw = other.w;

    this.x = aw * bx + ax * bw + ay * bz - az * by;
    this.y = aw * by - ax * bz + ay * bw + az * bx;
    this.z = aw * bz + ax * by - ay * bx + az * bw;
    this.w = aw * bw - ax * bx - ay * by - az * bz;

    return this;
  }

  public static getRotationZFromQuat(q: Quat): number {
    const sinr_cosp = 2 * (q.w * q.z + q.x * q.y);
    const cosr_cosp = 1 - 2 * (q.y * q.y + q.z * q.z);
    return Math.atan2(sinr_cosp, cosr_cosp);
  }

  public static fromEulerAngles(v: Vec3, q: Quat = new Quat()): Quat {
    const rollRad = Mathf.degToRad(v.x) * 0.5;
    const pitchRad = Mathf.degToRad(v.y) * 0.5;
    const yawRad = Mathf.degToRad(v.z) * 0.5;

    const sinRoll = Mathf.sin(rollRad);
    const cosRoll = Mathf.cos(rollRad);
    const sinPitch = Mathf.sin(pitchRad);
    const cosPitch = Mathf.cos(pitchRad);
    const sinYaw = Mathf.sin(yawRad);
    const cosYaw = Mathf.cos(yawRad);

    const x = cosPitch * sinRoll * cosYaw - cosRoll * sinPitch * sinYaw;
    const y = cosRoll * sinPitch * cosYaw + sinRoll * cosPitch * sinYaw;
    const z = cosRoll * cosPitch * sinYaw - sinRoll * sinPitch * cosYaw;
    const w = cosRoll * cosPitch * cosYaw + sinRoll * sinPitch * sinYaw;

    q.w = w;
    q.x = x;
    q.y = y;
    q.z = z;

    return q;
  }

  equals(q: Quat): boolean {
    return this.x === q.x && this.y === q.y && this.z === q.z && this.w === q.w;
  }
  public set(x: number | Quat, y?: number, z?: number, w?: number): this {
    if (x instanceof Quat) {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
      this.w = x.w;
    } else {
      this.x = x;
      this.y = y ?? this.y;
      this.z = z ?? this.z;
      this.w = w ?? this.w;
    }
    return this;
  }

  public static conjugate(q: Quat): Quat {
    return new Quat(-q.x, -q.y, -q.z, q.w);
  }

  public clone() {
    return new Quat(this.x, this.y, this.z, this.w);
  }
}



