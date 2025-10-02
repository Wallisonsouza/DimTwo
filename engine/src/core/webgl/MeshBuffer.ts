import type { Mesh } from "@engine/Rendering/Mesh";
import { ContextLink } from "@engine/Rendering/Shader";

export class MeshBuffer {
  vao: WebGLVertexArrayObject;
  vbo: WebGLBuffer;
  ebo: WebGLBuffer;
  nbo: WebGLBuffer;
  uvBuffer: WebGLBuffer;
  indexCount: number;
  name: string;

  private static buffers: Map<string, MeshBuffer> = new Map();

  constructor(mesh: Mesh) {
    this.name = mesh.name;
    this.indexCount = mesh.indices.length;

    const gl = ContextLink.getContext();

    this.vao = gl.createVertexArray()!;
    gl.bindVertexArray(this.vao);


    this.vbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.verticesData, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);


    this.nbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.nbo);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.normalsData, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);


    this.uvBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.uvsData, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);


    this.ebo = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);


    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);


    MeshBuffer.add(this);
  }

  private static add(buffer: MeshBuffer) {
    if (this.buffers.has(buffer.name)) {
      console.warn(`MeshBuffer "${buffer.name}" já existe. Substituindo.`);
    }
    this.buffers.set(buffer.name, buffer);
  }

  static get(name: string): MeshBuffer | undefined {
    return this.buffers.get(name);
  }

  static getAll(): MeshBuffer[] {
    return Array.from(this.buffers.values());
  }

  static disposeAll() {
    for (const buffer of this.buffers.values()) {
      buffer.dispose();
    }
    this.buffers.clear();
  }

  bind() {
    const gl = ContextLink.getContext();
    gl.bindVertexArray(this.vao);
  }

  unbind() {
    const gl = ContextLink.getContext();
    gl.bindVertexArray(null);
  }

  draw() {
    const gl = ContextLink.getContext();
    this.bind();
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
    this.unbind();
  }

  dispose() {
    const gl = ContextLink.getContext();
    gl.deleteVertexArray(this.vao);
    gl.deleteBuffer(this.vbo);
    gl.deleteBuffer(this.ebo);
    gl.deleteBuffer(this.nbo);
    gl.deleteBuffer(this.uvBuffer);

    MeshBuffer.buffers.delete(this.name);
  }
}
