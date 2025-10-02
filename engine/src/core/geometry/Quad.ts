import { Mesh } from "@engine/Rendering/Mesh";
import { Vec2 } from "../math/Vec2";
import { Vec3 } from "../math/Vec3";

export interface QuadOptions {
  size?: Vec2;
  wired?: boolean;
}

export class Quad {

  public static createQuadMesh(name: string, options: QuadOptions = {}): Mesh {
    const size = options.size ?? new Vec2(1, 1);
    const wired = options.wired ?? false;
    const halfSize = new Vec3(size.x * 0.5, size.y * 0.5);

    const vertices: Vec3[] = [
      new Vec3(-halfSize.x, -halfSize.y, 0),
      new Vec3(halfSize.x, -halfSize.y, 0),
      new Vec3(halfSize.x, halfSize.y, 0),
      new Vec3(-halfSize.x, halfSize.y, 0),
    ];

    const normals: Vec3[] = wired ? [] : [
      new Vec3(0, 0, 1),
      new Vec3(0, 0, 1),
      new Vec3(0, 0, 1),
      new Vec3(0, 0, 1),
    ];

    const uvs: Vec2[] = wired ? [] : [
      new Vec2(0, 0),
      new Vec2(1, 0),
      new Vec2(1, 1),
      new Vec2(0, 1),
    ];

    const indices: number[] = wired
      ? [0, 1, 1, 2, 2, 3, 3, 0]
      : [0, 1, 2, 2, 3, 0];

    return new Mesh(name, vertices, indices, normals, uvs);
  }
}
