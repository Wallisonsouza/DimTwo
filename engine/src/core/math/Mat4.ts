import type { Vec3 } from "./Vec3";
import type { Quat } from "./quat";

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

    public static compose(m: Mat4, t: Vec3, r: Quat, s: Vec3) {
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

    public static createTR(m: Mat4, t: Vec3, r: Quat) {
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

}