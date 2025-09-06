import type { Vec3 } from "@engine/core/math/Vec3";
import type { TextureBuffer } from "@engine/core/webgl/TextureBuffer";
import { WebGL } from "../core/webgl/WebGL";

export class Shader {
  private gl: WebGL2RenderingContext;
  name: string;
  program: WebGLProgram;
  vertexSource: string;
  fragmentSource: string;
  attributes: Map<string, GLint>;
  uniforms: Map<string, WebGLUniformLocation>;
  systemName: string | null = null;

  constructor(gl: WebGL2RenderingContext, name: string, vertexSource: string, fragmentSource: string) {
    this.gl = gl;
    const vertexShader = WebGL.compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = WebGL.compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    const program = WebGL.createProgram(gl, vertexShader, fragmentShader);

    const attributes = WebGL.getAttributes(gl, program);
    const uniforms = WebGL.getUniforms(gl, program);

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    this.vertexSource = vertexSource;
    this.fragmentSource = fragmentSource;
    this.attributes = attributes;
    this.uniforms = uniforms;
    this.program = program;
    this.name = name;

  }

  public warnIfUniformNotFound(type: string, name: string) {
    console.warn(`Uniform:${type} '${name}' not found in shader program '${this.name}'.`);
  }

  public getUniform(name: string): WebGLUniformLocation | null {
    return this.uniforms.get(name) ?? null;
  }

  public getAttribute(name: string): GLint | null {
    return this.attributes.get(name) ?? null;
  }

  public setMat4(name: string, matrix: Float32Array) {
    const gl = this.gl;
    const location = this.getUniform(name);
    if (!location) {
      this.warnIfUniformNotFound("mat4", name);
      return;
    }
    gl.uniformMatrix4fv(location, false, matrix);
  }

  public set4F(name: string, x: number, y: number, z: number, w: number) {
    const gl = this.gl;
    const location = this.getUniform(name);
    if (!location) {
      this.warnIfUniformNotFound("4f", name);
      return;
    }
    gl.uniform4f(location, x, y, z, w);
  }

  public shader_set_uniform_3f(name: string, x: number, y: number, z: number) {
    const gl = this.gl;
    const location = this.getUniform(name);
    if (!location) {
      this.warnIfUniformNotFound("3f", name);
      return;
    }
    gl.uniform3f(location, x, y, z);
  }

  public setVec3(name: string, v: Vec3) {
    const gl = this.gl;
    const location = this.getUniform(name);
    if (!location) {
      this.warnIfUniformNotFound("3f", name);
      return;
    }
    gl.uniform3fv(location, v.data);
  }

  public set2F(name: string, x: number, y: number) {
    const gl = this.gl;
    const location = this.getUniform(name);
    if (!location) {
      this.warnIfUniformNotFound("2f", name);
      return;
    }
    gl.uniform2f(location, x, y);
  }

  public shader_set_uniform_1f(name: string, x: number) {
    const gl = this.gl;
    const location = this.getUniform(name);
    if (!location) {
      this.warnIfUniformNotFound("1f", name);
      return;
    }
    gl.uniform1f(location, x);
  }

  public shader_set_uniform_1i(name: string, x: number) {
    const gl = this.gl;
    const location = this.getUniform(name);
    if (!location) {
      this.warnIfUniformNotFound("1i", name);
      return;
    }
    gl.uniform1i(location, x);
  }

  public setTexture(
    name: string,
    texture: TextureBuffer,
    unit: number = 0
  ) {
    const gl = this.gl;
    const glTexture = texture.gpuData;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, glTexture);

    const location = this.getUniform(name);
    if (!location) {
      this.warnIfUniformNotFound("texture", name);
      return;
    }
    gl.uniform1i(location, unit);
  }
}