import type { Vec2 } from "@engine/core/math/Vec2";
import type { Vec3 } from "@engine/core/math/Vec3";
import type { TextureBuffer } from "@engine/core/webgl/TextureBuffer";
import { WebGL } from "../core/webgl/WebGL";
import type { ShaderSystem } from "./ShaderSystem";
import { UniformNotFoundException } from "@engine/exception/shader_exceptions";
import type { Color } from "@engine/core/math/Color";


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

  private getUniform(name: string): WebGLUniformLocation | null {
    return this.uniforms.get(name) ?? null;
  }

  private getGL(): WebGL2RenderingContext {
    return ContextLink.getContext();
  }

  private throwUniformNotFound(type: string, name: string): never {
    throw new UniformNotFoundException(
      `Uniform (${type}) "${name}" não encontrado no shader "${this.name}"`
    );
  }

  // ---- setters ----
  public setMat4(name: string, matrix: Float32Array) {
    const location = this.getUniform(name);
    if (!location) this.throwUniformNotFound("mat4", name);

    const gl = this.getGL();
    gl.useProgram(this.program);
    gl.uniformMatrix4fv(location, false, matrix);
  }

  public set4F(name: string, x: number, y: number, z: number, w: number) {
    const location = this.getUniform(name);
    if (!location) this.throwUniformNotFound("vec4", name);

    const gl = this.getGL();
    gl.useProgram(this.program);
    gl.uniform4f(location, x, y, z, w);
  }



  public set3F(name: string, x: number, y: number, z: number) {
    const location = this.getUniform(name);
    if (!location) this.throwUniformNotFound("vec3", name);

    const gl = this.getGL();
    gl.useProgram(this.program);
    gl.uniform3f(location, x, y, z);
  }

  public setVec3(name: string, v: Vec3) {
    const location = this.getUniform(name);
    if (!location) this.throwUniformNotFound("vec3", name);

    const gl = this.getGL();
    gl.useProgram(this.program);
    gl.uniform3fv(location, v.data);
  }

  public setColor(name: string, v: Color) {
    const location = this.getUniform(name);
    if (!location) this.throwUniformNotFound("color", name);

    const gl = this.getGL();
    gl.useProgram(this.program);
    gl.uniform4fv(location, v.data);
  }


  public setVec2(name: string, v: Vec2) {
    const location = this.getUniform(name);
    if (!location) this.throwUniformNotFound("vec2", name);

    const gl = this.getGL();
    gl.useProgram(this.program);
    gl.uniform2fv(location, v.data);
  }

  public set2F(name: string, x: number, y: number) {
    const location = this.getUniform(name);
    if (!location) this.throwUniformNotFound("vec2", name);

    const gl = this.getGL();
    gl.useProgram(this.program);
    gl.uniform2f(location, x, y);
  }

  public setFloat(name: string, x: number) {
    const location = this.getUniform(name);
    if (!location) this.throwUniformNotFound("float", name);

    const gl = this.getGL();
    gl.useProgram(this.program);
    gl.uniform1f(location, x);
  }

  public set1I(name: string, x: number) {
    const location = this.getUniform(name);
    if (!location) this.throwUniformNotFound("int", name);

    const gl = this.getGL();
    gl.useProgram(this.program);
    gl.uniform1i(location, x);
  }

  public setTexture(name: string, texture: TextureBuffer, unit: number = 0) {
    const location = this.getUniform(name);
    if (!location) this.throwUniformNotFound("sampler2D", name);

    const gl = this.getGL();
    gl.useProgram(this.program);
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture.gpuData);
    gl.uniform1i(location, unit);
  }

}
