import type { Vec2 } from "@engine/core/math/Vec2";
import type { Vec3 } from "@engine/core/math/Vec3";
import type { TextureBuffer } from "@engine/core/webgl/TextureBuffer";
import { WebGL } from "../core/webgl/WebGL";
import type { ShaderSystem } from "./ShaderSystem";


export class ContextLink {
  private static _context: WebGL2RenderingContext | null = null;

  public static setContext(gl: WebGL2RenderingContext) {
    this._context = gl;
  }

  public static getContext(): WebGL2RenderingContext {
    if (!this._context) {
      throw new Error("WebGL context not set. Chame ContextLink.setContext(gl) primeiro.");
    }
    return this._context;
  }
}

export type ShaderOptions = {
  name: string;
  system?: ShaderSystem | null;
  vert: string;
  frag: string;
};

export class Shader {
  name: string;
  program: WebGLProgram;
  attributes: Map<string, GLint>;
  uniforms: Map<string, WebGLUniformLocation>;
  system: ShaderSystem | null = null;

  private static shaders: Map<string, Shader> = new Map();

  // --- Registro estático ---
  static get(name: string): Shader | undefined {
    return this.shaders.get(name);
  }

  static getAll(): Shader[] {
    return Array.from(this.shaders.values());
  }

  private static add(shader: Shader) {
    if (this.shaders.has(shader.name)) {
      console.warn(`Shader "${shader.name}" já existe. Substituindo.`);
    }
    this.shaders.set(shader.name, shader);
  }

  constructor(options: ShaderOptions) {
    const { name, vert: vertexSource, frag: fragmentSource, system = null } = options;
    const gl = ContextLink.getContext();

    const vertexShader = WebGL.compileShader(gl, name, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = WebGL.compileShader(gl, name, gl.FRAGMENT_SHADER, fragmentSource);
    const program = WebGL.createProgram(gl, vertexShader, fragmentShader);

    this.attributes = WebGL.getAttributes(gl, program);
    this.uniforms = WebGL.getUniforms(gl, program);
    this.program = program;
    this.name = name;
    this.system = system;

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    Shader.add(this);
  }

  private warnIfUniformNotFound(type: string, name: string) {
    console.warn(`Uniform:${type} '${name}' not found in shader program '${this.name}'.`);
  }

  private getUniform(name: string): WebGLUniformLocation | null {
    return this.uniforms.get(name) ?? null;
  }

  private getGL(): WebGL2RenderingContext {
    return ContextLink.getContext();
  }

  // ---- setters ----
  public setMat4(name: string, matrix: Float32Array) {
    const gl = this.getGL();
    gl.useProgram(this.program);
    const location = this.getUniform(name);
    if (!location) return this.warnIfUniformNotFound("mat4", name);
    gl.uniformMatrix4fv(location, false, matrix);
  }

  public set4F(name: string, x: number, y: number, z: number, w: number) {
    const gl = this.getGL();
    gl.useProgram(this.program);
    const location = this.getUniform(name);
    if (!location) return this.warnIfUniformNotFound("4f", name);
    gl.uniform4f(location, x, y, z, w);
  }

  public set3F(name: string, x: number, y: number, z: number) {
    const gl = this.getGL();
    gl.useProgram(this.program);
    const location = this.getUniform(name);
    if (!location) return this.warnIfUniformNotFound("3f", name);
    gl.uniform3f(location, x, y, z);
  }

  public setVec3(name: string, v: Vec3) {
    const gl = this.getGL();
    gl.useProgram(this.program);
    const location = this.getUniform(name);
    if (!location) return this.warnIfUniformNotFound("vec3", name);
    gl.uniform3fv(location, v.data);
  }

  public setVec2(name: string, v: Vec2) {
    const gl = this.getGL();
    gl.useProgram(this.program);
    const location = this.getUniform(name);
    if (!location) return this.warnIfUniformNotFound("vec2", name);
    gl.uniform2fv(location, v.data);
  }

  public set2F(name: string, x: number, y: number) {
    const gl = this.getGL();
    gl.useProgram(this.program);
    const location = this.getUniform(name);
    if (!location) return this.warnIfUniformNotFound("2f", name);
    gl.uniform2f(location, x, y);
  }

  public setFloat(name: string, x: number) {
    const gl = this.getGL();
    gl.useProgram(this.program);
    const location = this.getUniform(name);
    if (!location) return this.warnIfUniformNotFound("float", name);
    gl.uniform1f(location, x);
  }

  public set1I(name: string, x: number) {
    const gl = this.getGL();
    gl.useProgram(this.program);
    const location = this.getUniform(name);
    if (!location) return this.warnIfUniformNotFound("int", name);
    gl.uniform1i(location, x);
  }

  public setTexture(name: string, texture: TextureBuffer, unit: number = 0) {
    const gl = this.getGL();
    gl.useProgram(this.program);
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture.gpuData);

    const location = this.getUniform(name);
    if (!location) return this.warnIfUniformNotFound("sampler2D", name);
    gl.uniform1i(location, unit);
  }
}
