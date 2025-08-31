import { Vec3 } from "./Vec3";

export class Vec4 {
    constructor(public x: number, public y: number, public z: number, public w: number = 1) {}

    public perspectiveDivide(): Vec3 {
        if (this.w === 0) {
            throw new Error("Não é possível dividir por w = 0 no perspectiveDivide.");
        }
        return new Vec3(
            this.x / this.w,
            this.y / this.w,
            this.z / this.w
        );
    }

    public static create() {
        return new Vec4(0, 0, 0, 1);
    }

    public set(x: number, y: number, z: number, w: number = 1): this {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    }

}

