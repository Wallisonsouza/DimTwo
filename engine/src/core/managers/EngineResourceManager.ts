import type { AsyncResource } from "../loaders/AsyncResource";

export class EngineResourceManager {
    private static resources: Map<string, any> = new Map();
    private static registry: Map<string, AsyncResource<any>> = new Map();

    public static register<T>(name: string, loader: AsyncResource<T>) {
        this.registry.set(name, loader);
    }

    public static async load() {
        for (const [name, loader] of this.registry.entries()) {
            const loaded = await loader.load();
            this.resources.set(name, loaded);
        }
    }

    public static get<T>(name: string): T | undefined {
        return this.resources.get(name) as T | undefined;
    }
}