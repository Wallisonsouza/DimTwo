import type { Engine } from "@engine/Engine";
import { ResourcesManager } from "@engine/global/ResourcesManager";
import { Shader } from "@engine/Rendering/Shader";
import { Texture } from "@engine/Rendering/Texture";
import type { AsyncResource } from "../loaders/AsyncResource";
import type { EngineResource } from "./Resource";

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

    public static compileShader(engine: Engine, name: string, vertSource: string, fragSource: string, system: string) {
        const shader = new Shader(engine.targetWindow.context, name, vertSource, fragSource);
        shader.systemName = system;
        engine.shaders.add(name, shader);
    }

    public static compileTexture(engine: Engine, texture: Texture) {
        const textureBuffer = texture.compile(engine.targetWindow.context);
        if (!textureBuffer) return;
        engine.textureBuffers.add(texture.name, textureBuffer);
    }

    public static compileMesh(engine: Engine, id: string) {
        const mesh = ResourcesManager.MeshManager.get(id);
        if (!mesh) {
            return;
        }

        const meshBuffer = mesh.compile(engine.targetWindow.context);
        engine.meshBuffers.add(mesh.name, meshBuffer);
    }

    public static loadResources(editor: Engine, resources: EngineResource[]) {
        for (const res of resources) {
            switch (res.type) {
                case "shader":
                    EngineResourceManager.compileShader(
                        editor,
                        res.name,
                        EngineResourceManager.get(res.vert)!,
                        EngineResourceManager.get(res.frag)!,
                        res.system
                    );
                    break;

                case "texture":
                    const tex = new Texture(res.name, res.path);
                    EngineResourceManager.compileTexture(editor, tex);
                    break;

                case "mesh":
                    EngineResourceManager.compileMesh(editor, res.name);
                    break;
            }
        }
    }

}