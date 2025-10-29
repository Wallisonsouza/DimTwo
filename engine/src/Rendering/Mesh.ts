
import { Index } from "../core/math/vec";
import { Vec2 } from "../core/math/Vec2";
import { Vec3 } from "../core/math/Vec3";
import { MeshBuffer } from "../core/webgl/MeshBuffer";

export class Mesh {
  verticesData: Float32Array = new Float32Array();
  normalsData: Float32Array = new Float32Array();
  uvsData: Float32Array = new Float32Array();

  name: string;
  indices: Uint16Array;

  // --- registro estático ---
  private static meshes: Map<string, Mesh> = new Map();

  constructor(
    name: string,
    vertices: Vec3[] = [],
    indices: number[] = [],
    normals: Vec3[] = [],
    uvs: Vec2[] = []
  ) {
    this.name = name;
    this.indices = new Uint16Array(indices);

    this.setVertices(vertices);
    this.setNormals(normals);
    this.setUVs(uvs);

    Mesh.add(this);
    new MeshBuffer(this);
  }

  private static add(mesh: Mesh) {
    if (this.meshes.has(mesh.name)) {
      console.warn(`Mesh "${mesh.name}" já existe. Substituindo.`);
    }
    this.meshes.set(mesh.name, mesh);
  }

  static get(name: string): Mesh | undefined {
    return this.meshes.get(name);
  }

  static getAll(): Mesh[] {
    return Array.from(this.meshes.values());
  }

  static dispose(name: string) {
    this.meshes.delete(name);
  }

  static disposeAll() {
    this.meshes.clear();
  }

  public getVertices(): Vec3[] {
    const vertices: Vec3[] = [];
    for (let i = 0; i < this.verticesData.length; i += 3) {
      vertices.push(new Vec3(
        this.verticesData[i + Index.X],
        this.verticesData[i + Index.Y],
        this.verticesData[i + Index.Z]
      ));
    }
    return vertices;
  }

  public setVertices(vertices: Vec3[]): void {
    if (this.verticesData.length < vertices.length * 3) {
      this.verticesData = new Float32Array(vertices.length * 3);
    }
    for (let i = 0; i < vertices.length; i++) {
      const v = vertices[i].data;
      this.verticesData[i * 3 + Index.X] = v[Index.X];
      this.verticesData[i * 3 + Index.Y] = v[Index.Y];
      this.verticesData[i * 3 + Index.Z] = v[Index.Z];
    }
  }

  public getNormals(): Vec3[] {
    const normals: Vec3[] = [];
    for (let i = 0; i < this.normalsData.length; i += 3) {
      normals.push(new Vec3(
        this.normalsData[i + 0],
        this.normalsData[i + 1],
        this.normalsData[i + 2]
      ));
    }
    return normals;
  }

  public setNormals(normals: Vec3[]): void {
    if (this.normalsData.length < normals.length * 3) {
      this.normalsData = new Float32Array(normals.length * 3);
    }
    for (let i = 0; i < normals.length; i++) {
      const n = normals[i].data;
      this.normalsData[i * 3 + 0] = n[0];
      this.normalsData[i * 3 + 1] = n[1];
      this.normalsData[i * 3 + 2] = n[2];
    }
  }

  public getUVs(): Vec2[] {
    const uvs: Vec2[] = [];
    for (let i = 0; i < this.uvsData.length; i += 2) {
      uvs.push(new Vec2(
        this.uvsData[i],
        this.uvsData[i + 1]
      ));
    }
    return uvs;
  }

  public setUVs(uvs: Vec2[]): void {
    if (this.uvsData.length < uvs.length * 2) {
      this.uvsData = new Float32Array(uvs.length * 2);
    }
    for (let i = 0; i < uvs.length; i++) {
      const uv = uvs[i].data;
      this.uvsData[i * 2 + 0] = uv[0];
      this.uvsData[i * 2 + 1] = uv[1];
    }
  }

  public clone(): Mesh {
    const vertices = this.getVertices().map(v => new Vec3(v.x, v.y, v.z));
    const normals = this.getNormals().map(n => new Vec3(n.x, n.y, n.z));
    const uvs = this.getUVs().map(uv => new Vec2(uv.x, uv.y));
    const indices = Array.from(this.indices);

    // Criamos uma nova mesh com um nome temporário (ou pode gerar único)
    const cloneMesh = new Mesh(this.name + "_clone", vertices, indices, normals, uvs);

    return cloneMesh;
  }
}
