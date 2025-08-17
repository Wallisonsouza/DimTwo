import { Vec2 } from "../../core/math/Vec2";
import { Vec3 } from "../../core/math/Vec3";
import { createMesh } from "../../modules/generators/create.mesh";
import type { Mesh } from "../../modules/resources/mesh/Mesh";

export function createFillSquareMesh(size: Vec3): Mesh {
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

    return createMesh("fillSquare", vertices, indices, normals, uvs);
}

export function createWireSquareMesh(name: string, size: Vec3): Mesh {
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

    return createMesh(name, vertices, indices, normals, uvs);
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

    return createMesh(name, vertices, indices, normals, uvs);
}
