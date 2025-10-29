import { Vec3 } from "../../core/math/Vec3";


export class Plane {
  public normal: Vec3;
  public point: Vec3;

  constructor(normal: Vec3, point: Vec3) {
    this.normal = Vec3.normalize(normal, new Vec3(0, 0, 0));
    this.point = point.clone();
  }

  public intersectRay(rayOrigin: Vec3, rayDir: Vec3, outPoint?: Vec3): number | null {
    const denom = Vec3.dot(this.normal, rayDir);
    if (Math.abs(denom) < 1e-6) {
      return null;
    }

    const diff = Vec3.sub(this.point, rayOrigin);
    const t = Vec3.dot(diff, this.normal) / denom;

    if (t < 0) return null;

    if (outPoint) {
      outPoint.set(
        rayOrigin.x + rayDir.x * t,
        rayOrigin.y + rayDir.y * t,
        rayOrigin.z + rayDir.z * t
      );
    }

    return t;
  }
}