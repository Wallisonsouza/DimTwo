
export interface MeshBuffer {
    vao: WebGLVertexArrayObject;
    vbo: WebGLBuffer;
    ebo: WebGLBuffer;
    uvBuffer: WebGLBuffer;
    indexCount: number;
    modelMatrixBuffer: WebGLBuffer | null;
}

