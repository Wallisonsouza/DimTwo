import { Vec3 } from "../core/math/Vec3";
import type { MeshBuffer } from "../core/webgl/MeshBuffer";
import { ResourcesManager } from "../global/ResourcesManager";
import { Vec2 } from "../modules/2D/Vec2";

export class Mesh {
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

        ResourcesManager.MeshManager.add(this.name, this);
    }

    public compile(gl: WebGL2RenderingContext): MeshBuffer {
        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);


        const positions = Vec3.vec3Tof32Arr(this.vertices);
        const vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
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