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

    public static euler_to_quat(q: Quat, v: Vec3): void {
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
    }

    public clone() {
        return new Quat(this.x, this.y, this.z, this.w);
    }
}



