import { Mesh } from "../../Rendering/Mesh";
import { Mathf } from "../math/Mathf";
import { Vec2 } from "../math/Vec2";
import { Vec3 } from "../math/Vec3";

export interface CircleOptions {
  radius?: number;       // padrão: 1
  divisions?: number;    // padrão: 16
  wired?: boolean;       // padrão: false
}

export class Circle {

  public static createCircleMesh(name: string, options: CircleOptions = {}): Mesh {
    const vertices: Vec3[] = [];
    const indices: number[] = [];
    const normals: Vec3[] = [];
    const uvs: Vec2[] = [];

    const radius = options.radius ?? 1;
    const divisions = options.divisions ?? 16;
    const wired = options.wired ?? false;

    const angleStep = Mathf.PI_2 / divisions;

    if (!wired) {
      // centro para triangulação
      vertices.push(new Vec3(0, 0, 0));
      uvs.push(new Vec2(0.5, 0.5));
      normals.push(new Vec3(0, 0, 1));
    }

    for (let i = 0; i < divisions; i++) {
      const angle = i * angleStep;

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      vertices.push(new Vec3(x, y, 0));
      uvs.push(new Vec2((x / radius + 1) * 0.5, (y / radius + 1) * 0.5));
      normals.push(new Vec3(0, 0, 1));
    }

    if (wired) {
      // índices para wireframe
      for (let i = 0; i < divisions; i++) {
        indices.push(i, (i + 1) % divisions);
      }
    } else {
      // índices para fill
      for (let i = 1; i <= divisions; i++) {
        const next = i % divisions + 1;
        indices.push(0, i, next);
      }
    }

    return new Mesh(name, vertices, indices, normals, uvs);
  }
}
