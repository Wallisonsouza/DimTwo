import type { Vec2 } from "../../core/math/Vec2";
import type { Vec3 } from "../../core/math/Vec3";
import { ResourcesManager } from "../../global/manager/manager";
import { Mesh } from "../resources/mesh/Mesh";

export function createMesh(name: string, vertices: Vec3[], indices: number[], normals: Vec3[], uvs: Vec2[]) {

    const mesh = new Mesh(name, vertices, indices, normals, uvs);
    ResourcesManager.MeshManager.add( mesh.instanceID.getValue().toString(), mesh);
    return mesh;
}