import { ResourcesManager } from "../global/manager/manager";

export interface MaterialOptions {
    name: string;
    shaderName?: string;
    transparent?: boolean;
}

export class Material {
    name: string;
    shaderName: string | null;
    transparent: boolean;

    constructor(options: MaterialOptions) {
        this.name = options.name;
        this.shaderName = options.shaderName ?? null;
        this.transparent = options.transparent ?? false;
        ResourcesManager.MaterialManager.add(this.name, this);
    }
}
