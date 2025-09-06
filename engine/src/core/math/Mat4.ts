import type { Vec3 } from "./Vec3";
import { Vec4 } from "./Vec4";
import { Quat } from "./quat";

export class Mat4Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Mat4Error";
  }

  public static readonly INVERT_ERROR = new Mat4Error("Matriz singular, não é possível inverter.");
}

export class Mat4 {
  public readonly data: Float32Array;

  constructor() {
    this.data = new Float32Array(16)
  }

  public static create(
    m00: number = 1.0, m10: number = 0.0, m20: number = 0.0, m30: number = 0.0,
    m01: number = 0.0, m11: number = 1.0, m21: number = 0.0, m31: number = 0.0,
    m02: number = 0.0, m12: number = 0.0, m22: number = 1.0, m32: number = 0.0,
    m03: number = 0.0, m13: number = 0.0, m23: number = 0.0, m33: number = 1.0) {

    const mat4: Mat4 = new Mat4();
    mat4.data.set([
      m00, m10, m20, m30,
      m01, m11, m21, m31,
      m02, m12, m22, m32,
      m03, m13, m23, m33
    ]);

    return mat4;
  }

  public static multiply(a: Mat4, b: Mat4, out: Mat4 = new Mat4()): Mat4 {
    const ae = a.data;
    const be = b.data;
    const oe = out.data;

    const a00 = ae[0], a01 = ae[1], a02 = ae[2], a03 = ae[3];
    const a10 = ae[4], a11 = ae[5], a12 = ae[6], a13 = ae[7];
    const a20 = ae[8], a21 = ae[9], a22 = ae[10], a23 = ae[11];
    const a30 = ae[12], a31 = ae[13], a32 = ae[14], a33 = ae[15];

    const b00 = be[0], b01 = be[1], b02 = be[2], b03 = be[3];
    const b10 = be[4], b11 = be[5], b12 = be[6], b13 = be[7];
    const b20 = be[8], b21 = be[9], b22 = be[10], b23 = be[11];
    const b30 = be[12], b31 = be[13], b32 = be[14], b33 = be[15];

    oe[0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03;
    oe[1] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03;
    oe[2] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03;
    oe[3] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03;

    oe[4] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13;
    oe[5] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13;
    oe[6] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13;
    oe[7] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13;

    oe[8] = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23;
    oe[9] = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23;
    oe[10] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23;
    oe[11] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23;

    oe[12] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33;
    oe[13] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33;
    oe[14] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33;
    oe[15] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33;

    return out;
  }

  public static zero(mat4: Mat4) {
    mat4.data.set(
      [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
      ]
    )

    return mat4;
  }

  public static identity(mat4: Mat4) {
    mat4.data.set(
      [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ]
    )

    return mat4;
  }

  public static composeTRS(m: Mat4, t: Vec3, r: Quat, s: Vec3) {
    const x = r.x, y = r.y, z = r.z, w = r.w;

    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;

    const xx = x * x2;
    const xy = x * y2;
    const xz = x * z2;
    const yy = y * y2;
    const yz = y * z2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;

    const sx = s.x, sy = s.y, sz = s.z;

    const e = m.data;

    e[0] = (1 - (yy + zz)) * sx;
    e[1] = (xy + wz) * sx;
    e[2] = (xz - wy) * sx;
    e[3] = 0;

    e[4] = (xy - wz) * sy;
    e[5] = (1 - (xx + zz)) * sy;
    e[6] = (yz + wx) * sy;
    e[7] = 0;

    e[8] = (xz + wy) * sz;
    e[9] = (yz - wx) * sz;
    e[10] = (1 - (xx + yy)) * sz;
    e[11] = 0;

    // Translação
    e[12] = t.x;
    e[13] = t.y;
    e[14] = t.z;
    e[15] = 1;
  }

  public static composeTR(m: Mat4, t: Vec3, r: Quat) {
    const x = r.x, y = r.y, z = r.z, w = r.w;

    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;

    const xx = x * x2;
    const xy = x * y2;
    const xz = x * z2;
    const yy = y * y2;
    const yz = y * z2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;


    const e = m.data;

    // Escala + rotação
    e[0] = (1 - (yy + zz));
    e[1] = (xy + wz);
    e[2] = (xz - wy);
    e[3] = 0;

    e[4] = (xy - wz);
    e[5] = (1 - (xx + zz));
    e[6] = (yz + wx);
    e[7] = 0;

    e[8] = (xz + wy);
    e[9] = (yz - wx);
    e[10] = (1 - (xx + yy));
    e[11] = 0;

    e[12] = t.x;
    e[13] = t.y;
    e[14] = t.z;
    e[15] = 1;
  }

  public static composeTRInverse(m: Mat4, t: Vec3, r: Quat) {
    const conj = Quat.conjugate(r);
    const ix = conj.x, iy = conj.y, iz = conj.z, iw = conj.w;

    const x2 = ix + ix;
    const y2 = iy + iy;
    const z2 = iz + iz;

    const xx = ix * x2;
    const xy = ix * y2;
    const xz = ix * z2;
    const yy = iy * y2;
    const yz = iy * z2;
    const zz = iz * z2;
    const wx = iw * x2;
    const wy = iw * y2;
    const wz = iw * z2;

    const e = m.data;

    // Rotação inversa
    e[0] = 1 - (yy + zz);
    e[1] = xy + wz;
    e[2] = xz - wy;
    e[3] = 0;

    e[4] = xy - wz;
    e[5] = 1 - (xx + zz);
    e[6] = yz + wx;
    e[7] = 0;

    e[8] = xz + wy;
    e[9] = yz - wx;
    e[10] = 1 - (xx + yy);
    e[11] = 0;

    // Translação inversa: -Rᵀ * t
    e[12] = -(e[0] * t.x + e[4] * t.y + e[8] * t.z);
    e[13] = -(e[1] * t.x + e[5] * t.y + e[9] * t.z);
    e[14] = -(e[2] * t.x + e[6] * t.y + e[10] * t.z);
    e[15] = 1;
  }


  public static projection(m: Mat4, fovY: number, aspect: number, near: number, far: number) {
    const fovRadians = (fovY * Math.PI) / 180;
    const f = 1.0 / Math.tan(fovRadians / 2);
    const nf = 1 / (near - far);

    const e = m.data;
    e[0] = f / aspect;
    e[5] = f;
    e[10] = (far + near) * nf;
    e[11] = -1;
    e[14] = (2 * far * near) * nf;
    e[15] = 0;
  }

  public static orthographic(
    m: Mat4,
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ) {
    const e = m.data;

    const lr = 1 / (right - left);
    const bt = 1 / (top - bottom);
    const nf = 1 / (far - near);

    e[0] = 2 * lr;
    e[1] = 0;
    e[2] = 0;
    e[3] = 0;

    e[4] = 0;
    e[5] = 2 * bt;
    e[6] = 0;
    e[7] = 0;

    e[8] = 0;
    e[9] = 0;
    e[10] = -2 * nf;
    e[11] = 0;

    e[12] = -(right + left) * lr;
    e[13] = -(top + bottom) * bt;
    e[14] = -(far + near) * nf;
    e[15] = 1;
  }


  public static multiplyVec4(m: Mat4, v: Vec4): Vec4 {
    const e = m.data;
    const x = v.x, y = v.y, z = v.z, w = v.w;

    return new Vec4(
      e[0] * x + e[4] * y + e[8] * z + e[12] * w,
      e[1] * x + e[5] * y + e[9] * z + e[13] * w,
      e[2] * x + e[6] * y + e[10] * z + e[14] * w,
      e[3] * x + e[7] * y + e[11] * z + e[15] * w
    );
  }

  public static invert(input: Mat4, output: Mat4): Mat4 | null {
    const a = input.data;
    const o = output.data;

    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    // determinante
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) return null;
    det = 1.0 / det;

    o[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    o[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    o[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    o[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    o[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    o[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    o[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    o[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    o[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    o[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    o[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    o[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    o[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    o[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    o[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    o[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return output;
  }


}