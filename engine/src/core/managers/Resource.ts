export interface BaseResource {
    name: string;
    type: "shader" | "texture" | "mesh";
}

export interface ShaderResource extends BaseResource {
    type: "shader";
    vert: string;
    frag: string;
    system: string;
}

export interface TextureResource extends BaseResource {
    type: "texture";
    path: string;
}

export interface MeshResource extends BaseResource {
    type: "mesh";
    path: string;
}


export type EngineResource = ShaderResource | TextureResource | MeshResource;
