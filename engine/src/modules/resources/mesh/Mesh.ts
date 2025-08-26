import { Instantiable } from "../../../core/base/Instantiable";
import { Vec2 } from "../../../core/math/Vec2";
import { Vec3 } from "../../../core/math/Vec3";
import { ResourcesManager } from "../../../global/manager/manager";
import type { MeshBuffer } from "../../../interfaces/IMeshBuffer";

export class Mesh extends Instantiable {
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
        super();
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

    generateMeshFromImage(image: HTMLImageElement) {

    }
}


function simplifyPolygon(points: number[], tolerance: number): number[] {
    function getSqDist(px: number, py: number, qx: number, qy: number) {
        const dx = px - qx;
        const dy = py - qy;
        return dx * dx + dy * dy;
    }

    function simplifyDP(start: number, end: number, pts: number[], out: number[]) {
        let maxDist = 0;
        let index = 0;
        const sx = pts[start * 2], sy = pts[start * 2 + 1];
        const ex = pts[end * 2], ey = pts[end * 2 + 1];

        for (let i = start + 1; i < end; i++) {
            const px = pts[i * 2], py = pts[i * 2 + 1];
            const dist = Math.abs((ey - sy) * px - (ex - sx) * py + ex * sy - ey * sx) /
                         Math.sqrt((ey - sy) ** 2 + (ex - sx) ** 2);
            if (dist > maxDist) { index = i; maxDist = dist; }
        }

        if (maxDist > tolerance) {
            simplifyDP(start, index, pts, out);
            simplifyDP(index, end, pts, out);
        } else {
            out.push(pts[start * 2], pts[start * 2 + 1]);
        }
    }

    const result: number[] = [];
    simplifyDP(0, points.length / 2 - 1, points, result);
    // adicionar último ponto
    result.push(points[points.length - 2], points[points.length - 1]);
    return result;
}



function marchingSquares(mask: boolean[][]): number[] {
    const h = mask.length;
    const w = mask[0].length;
    const polygon: number[] = [];

    // Encontra primeiro pixel opaco
    let startX = -1, startY = -1;
    outer: for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            if (mask[y][x]) { startX = x; startY = y; break outer; }
        }
    }
    if (startX === -1) return polygon;

    let x = startX, y = startY, dir = 0;
    const visited = new Set<string>();

    do {
        polygon.push(x, y);
        visited.add(`${x},${y}`);

        const right = (x + 1 < w) ? mask[y][x + 1] : false;
        const down = (y + 1 < h) ? mask[y + 1][x] : false;
        const left = (x - 1 >= 0) ? mask[y][x - 1] : false;
        const up = (y - 1 >= 0) ? mask[y - 1][x] : false;

        if (dir !== 2 && right) { x++; dir = 0; }
        else if (dir !== 3 && down) { y++; dir = 1; }
        else if (dir !== 0 && left) { x--; dir = 2; }
        else if (dir !== 1 && up) { y--; dir = 3; }
        else break;

        if (x === startX && y === startY) break;
        if (visited.has(`${x},${y}`)) break;
    } while (true);

    return polygon;
}
