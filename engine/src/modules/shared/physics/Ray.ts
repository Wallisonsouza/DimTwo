import { Vec3 } from "../../../core/math/Vec3";

export class Ray {
    origin: Vec3;
    direction: Vec3;

    constructor(origin: Vec3, direction: Vec3) {
        this.origin = origin;
        this.direction = Vec3.normalize(direction, direction);
    }
}