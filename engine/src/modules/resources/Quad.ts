import { Vec2 } from "../../core/math/Vec2";
import { Vec3 } from "../../core/math/Vec3";
import { Mesh } from "../../Rendering/Mesh";

export class Quad {
    public static createFillQuadMesh(name: string, size: Vec3): Mesh {
        const halfSize = new Vec3(size.x * 0.5, size.y * 0.5, size.z * 0.5);

        const vertices: Vec3[] = [
            new Vec3(-halfSize.x, -halfSize.y, 0),
            new Vec3(halfSize.x, -halfSize.y, 0),
            new Vec3(halfSize.x, halfSize.y, 0),
            new Vec3(-halfSize.x, halfSize.y, 0),
        ];

        const indices: number[] = [
            0, 1, 2,
            2, 3, 0,
        ];

        const normals: Vec3[] = [
            new Vec3(0, 0, 1),
            new Vec3(0, 0, 1),
            new Vec3(0, 0, 1),
            new Vec3(0, 0, 1),
        ];

        const uvs: Vec2[] = [
            new Vec2(0, 0),
            new Vec2(1, 0),
            new Vec2(1, 1),
            new Vec2(0, 1),
        ];

        return new Mesh(name, vertices, indices, normals, uvs);
    }

    public static createWireQuadMesh(name: string, size: Vec3): Mesh {
        const halfSize = new Vec3(size.x * 0.5, size.y * 0.5, size.z * 0.5);

        const vertices: Vec3[] = [
            new Vec3(-halfSize.x, -halfSize.y, 0),
            new Vec3(halfSize.x, -halfSize.y, 0),
            new Vec3(halfSize.x, halfSize.y, 0),
            new Vec3(-halfSize.x, halfSize.y, 0),
        ];

        const indices: number[] = [
            0, 1,
            1, 2,
            2, 3,
            3, 0,
        ];

        const normals: Vec3[] = [];
        const uvs: Vec2[] = [];

        return new Mesh(name, vertices, indices, normals, uvs);
    }
}

export function createWireCircleMesh(name: string, radius: number, divisions: number): Mesh {
    const vertices: Vec3[] = [];
    const indices: number[] = [];

    const angleStep = (Math.PI * 2) / divisions;

    for (let i = 0; i < divisions; i++) {
        const angle = i * angleStep;
        vertices.push(new Vec3(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            0
        ));
    }

    for (let i = 0; i < divisions; i++) {
        indices.push(i, (i + 1) % divisions);
    }

    const normals: Vec3[] = [];
    const uvs: Vec2[] = [];

    return new Mesh(name, vertices, indices, normals, uvs);
}
