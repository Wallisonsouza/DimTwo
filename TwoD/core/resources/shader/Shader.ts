import { Global } from "../../managers/engine.manager";
import { WebGL } from "../../webgl/WebGL";
import type { TextureType } from "../texture/types";

export class Shader {

    name: string;
    program: WebGLProgram;
    vertexSource: string;
    fragmentSource: string;
    attributes: Map<string, GLint>;
    uniforms: Map<string, WebGLUniformLocation>;

    constructor(name: string, vertexSource: string, fragmentSource: string) {
        const gl = Global.WebGL;
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

    public shader_set_uniform_mat4(name: string, matrix: Float32Array) {
        const gl = Global.WebGL;
        const location = this.getUniform(name);
        if (!location) {
            this.warnIfUniformNotFound("mat4", name);
            return;
        }
        gl.uniformMatrix4fv(location, false, matrix);
    }

    public shader_set_uniform_4f(name: string, x: number, y: number, z: number, w: number) {
        const gl = Global.WebGL;
        const location = this.getUniform(name);
        if (!location) {
            this.warnIfUniformNotFound("4f", name);
            return;
        }
        gl.uniform4f(location, x, y, z, w);
    }

    public shader_set_uniform_3f(name: string, x: number, y: number, z: number) {
        const gl = Global.WebGL;
        const location = this.getUniform(name);
        if (!location) {
            this.warnIfUniformNotFound("3f", name);
            return;
        }
        gl.uniform3f(location, x, y, z);
    }

    public shader_set_uniform_2f(name: string, x: number, y: number) {
        const gl = Global.WebGL;
        const location = this.getUniform(name);
        if (!location) {
            this.warnIfUniformNotFound("2f", name);
            return;
        }
        gl.uniform2f(location, x, y);
    }

    public shader_set_uniform_1f(name: string, x: number) {
        const gl = Global.WebGL;
        const location = this.getUniform(name);
        if (!location) {
            this.warnIfUniformNotFound("1f", name);
            return;
        }
        gl.uniform1f(location, x);
    }

    public shader_set_uniform_1i(name: string, x: number) {
        const gl = Global.WebGL;
        const location = this.getUniform(name);
        if (!location) {
            this.warnIfUniformNotFound("1i", name);
            return;
        }
        gl.uniform1i(location, x);
    }

    public shader_set_uniform_texture(
        name: string,
        texture: TextureType,
        unit: number = 0
    ) {
        const gl = Global.WebGL;
        const glTexture = texture.texture;
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