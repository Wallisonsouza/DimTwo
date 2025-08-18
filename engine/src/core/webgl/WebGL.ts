export class WebGL {
    
    public static compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
        const shader = gl.createShader(type);
        if (!shader) throw new Error("Failed to create shader");

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const info = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error(`Shader compile error: ${info}`);
        }

        return shader;
    }

    public static createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
        const program = gl.createProgram();
        if (!program) throw new Error("Failed to create program");

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const info = gl.getProgramInfoLog(program);
            gl.deleteProgram(program);
            throw new Error(`Program link error: ${info}`);
        }

        return program;
    }

    public static getAttributes(gl: WebGL2RenderingContext, program: WebGLProgram): Map<string, GLint> {
        const attributes = new Map<string, GLint>();
        const attributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

        for (let i = 0; i < attributeCount; i++) {
            const info = gl.getActiveAttrib(program, i);
            if (info) {
                const loc = gl.getAttribLocation(program, info.name);
                attributes.set(info.name, loc);
            }
        }

        return attributes;
    }

    public static getUniforms(gl: WebGL2RenderingContext, program: WebGLProgram): Map<string, WebGLUniformLocation> {
        const uniforms = new Map<string, WebGLUniformLocation>();
        const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

        for (let i = 0; i < uniformCount; i++) {
            const info = gl.getActiveUniform(program, i);
            if (info) {
                const loc = gl.getUniformLocation(program, info.name);
                if (loc) uniforms.set(info.name, loc);
            }
        }

        return uniforms;
    }
}
