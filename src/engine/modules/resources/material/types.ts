export interface MaterialOptions {
    name: string;
    shaderName?: string;
}

export class Material {
    name: string;
    shaderName: string | null;

    constructor(options: MaterialOptions) {
        this.name = options.name;
        this.shaderName = options.shaderName ?? null;
    }
}
