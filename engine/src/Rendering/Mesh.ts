import { Index } from "@engine/core/math/vec";
import { Vec2 } from "../core/math/Vec2";
import { Vec3 } from "../core/math/Vec3";
import type { MeshBuffer } from "../core/webgl/MeshBuffer";
import { ResourcesManager } from "../global/ResourcesManager";

export class Mesh {

  data: Float32Array = new Float32Array();

  public getVertices(): Vec3[] {
    const vertices: Vec3[] = [];
    for (let i = 0; i < this.data.length; i += 3) {
      vertices.push(new Vec3(
        this.data[i + Index.X],
        this.data[i + Index.Y],
        this.data[i + Index.Z]
      ));
    }
    return vertices;
  }

  public setVertices(vertices: Vec3[]): void {
    if (this.data.length < vertices.length * 3) {
      this.data = new Float32Array(vertices.length * 3);
    }

    for (let i = 0; i < vertices.length; i++) {
      const v = vertices[i].data;
      this.data[i * 3 + Index.X] = v[Index.X];
      this.data[i * 3 + Index.Y] = v[Index.Y];
      this.data[i * 3 + Index.Z] = v[Index.Z];
    }
  }

  name: string;
  vertices: Vec3[];
  indices: number[];
  normals: Vec3[];
  uvs: Vec2[];

  constructor(
    name: string,
    vertices: Vec3[] = [],
    indices: number[] = [],
    normals: Vec3[] = [],
    uvs: Vec2[] = []
  ) {
    this.name = name;
    this.vertices = vertices;
    this.indices = indices;
    this.normals = normals;
    this.uvs = uvs;

    this.setVertices(vertices);
    ResourcesManager.MeshManager.add(this.name, this);
  }

  public compile(gl: WebGL2RenderingContext): MeshBuffer {
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, this.data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);


    const uvs = Vec2.vec2ArrayTof32Array(this.uvs);
    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);


    const indices = new Uint16Array(this.indices);
    const ebo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);


    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return {
      vao,
      vbo,
      uvBuffer,
      ebo,
      modelMatrixBuffer: null,
      indexCount: this.indices.length,
    };
  }
}