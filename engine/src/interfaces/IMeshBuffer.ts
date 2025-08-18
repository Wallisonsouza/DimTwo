
export interface MeshBuffer {
    vao: WebGLVertexArrayObject;
    vbo: WebGLBuffer;
    ebo: WebGLBuffer;
    uvBuffer: WebGLBuffer;
    indexCount: number;
    modelMatrixBuffer: WebGLBuffer | null;
}

export interface TextureBuffer {
    width: number;
    height: number;
    gpuData: WebGLTexture;
}



/* export function createDynamicMeshVAO(gl: WebGL2RenderingContext, mesh: Mesh): GLVAO {
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const positions = Vec3.vec3Tof32Arr(mesh.vertices);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    gl.bufferData(gl.ARRAY_BUFFER, positions.byteLength, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

    const uvs = Vec2.vec2ArrayTof32Array(mesh.uvs);
    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uvs.byteLength, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

    const indices = new Uint16Array(mesh.indices);
    const ebo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, uvs);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return {
        vao,
        vbo,
        uvBuffer,
        ebo,
        modelMatrixBuffer: null,
        indexCount: mesh.indices.length,
    };
}

export function updateDynamicMesh(gl: WebGL2RenderingContext, meshGL: GLVAO, mesh: Mesh) {
    const newPositions = Vec3.vec3Tof32Arr(mesh.vertices);
    const newUVs = Vec2.vec2ArrayTof32Array(mesh.uvs);
    const newIndices = new Uint16Array(mesh.indices);

    gl.bindBuffer(gl.ARRAY_BUFFER, meshGL.vbo);
    const vboSize = gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE);
    if (newPositions.byteLength > vboSize) {
        gl.bufferData(gl.ARRAY_BUFFER, newPositions, gl.DYNAMIC_DRAW);
    } else {
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, newPositions);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, meshGL.uvBuffer);
    const uvboSize = gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE);
    if (newUVs.byteLength > uvboSize) {
        gl.bufferData(gl.ARRAY_BUFFER, newUVs, gl.DYNAMIC_DRAW);
    } else {
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, newUVs);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshGL.ebo);
    const eboSize = gl.getBufferParameter(gl.ELEMENT_ARRAY_BUFFER, gl.BUFFER_SIZE);
    if (newIndices.byteLength > eboSize) {
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, newIndices, gl.STATIC_DRAW);
    } else {
        gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, newIndices);
    }

    meshGL.indexCount = mesh.indices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

export function createTextMesh(
    text: string,
    fontData: FontData,
    scale: number = 1,
    lineHeight: number = 100,
    spacement: number = 64
): Mesh {
    const positions: Vec3[] = [];
    const uvs: Vec2[] = [];
    const indices: number[] = [];

    let cursorX = 0;
    let cursorY = 0;
    let indexOffset = 0;

    const textureWidth = fontData.texture.width;
    const textureHeight = fontData.texture.height;

    for (const char of text) {
        if (char === '\n') {
            cursorX = 0;
            cursorY -= lineHeight * scale;
            continue;
        }

        const glyph = fontData.glyphs.get(char);
        if (!glyph) {
            cursorX += spacement * scale;
            continue;
        }

        const x0 = cursorX + glyph.xoffset * scale;
        const y0 = cursorY - glyph.yoffset * scale;
        const x1 = x0 + glyph.width * scale;
        const y1 = y0 - glyph.height * scale;

        const u0 = glyph.x / textureWidth;
        const v0 = glyph.y / textureHeight;
        const u1 = (glyph.x + glyph.width) / textureWidth;
        const v1 = (glyph.y + glyph.height) / textureHeight;

        positions.push(
            { x: x0, y: y0, z: 0 },
            { x: x1, y: y0, z: 0 },
            { x: x1, y: y1, z: 0 },
            { x: x0, y: y1, z: 0 }
        );

        uvs.push(
            { x: u0, y: v0 },
            { x: u1, y: v0 },
            { x: u1, y: v1 },
            { x: u0, y: v1 }
        );

        indices.push(
            indexOffset, indexOffset + 1, indexOffset + 2,
            indexOffset, indexOffset + 2, indexOffset + 3
        );

        indexOffset += 4;
        cursorX += glyph.xadvance * scale;
    }

    const mesh: Mesh = {
        instanceID: new Id(),
        name: "text_mesh",
        normals: [],
        vertices: positions,
        uvs: uvs,
        indices: indices,
    };

    return mesh;
}

 */