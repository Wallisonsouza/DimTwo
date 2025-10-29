import { Mesh } from "../../Rendering/Mesh";
import type { Vec2 } from "../math/Vec2";
import { Vec3 } from "../math/Vec3";

export class Line {
  public static createWireLineMesh(name: string): Mesh {
    const vertices: Vec3[] = [
      new Vec3(0, 0, 0),
      new Vec3(1, 0, 0),
    ];

    const indices: number[] = [
      0, 1,
    ];

    const normals: Vec3[] = [];
    const uvs: Vec2[] = [];

    return new Mesh(name, vertices, indices, normals, uvs);
  }
}
