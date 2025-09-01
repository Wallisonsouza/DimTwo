import { Display } from "./core/display/Display";
import { EngineSystem, EngineSystemManager } from "./core/managers/EngineSystemManager";
import { SceneManager } from "./core/managers/SceneManager";
import { SimpleManager } from "./core/managers/SimpleManager";
import { SystemManager } from "./core/managers/SystemManager";
import type { Mat4 } from "./core/math/Mat4";
import type { Scene } from "./core/scene/scene";
import Time from "./core/time/Time";
import { ResourcesManager } from "./global/manager/manager";
import type { MeshBuffer, TextureBuffer } from "./interfaces/IMeshBuffer";
import { Shader } from "./Rendering/Shader";
import { Texture } from "./Rendering/Texture";

export class Engine {
    public display: Display;

    public getElement() {
        return this.display.getCanvas();
    }

    public getContext() {
        return this.display.getContext();
    }

    public readonly time: Time;
    protected scene: Scene | null = null;

    public shaders: SimpleManager<Shader> = new SimpleManager("Shader Manager");
    public matrices: SimpleManager<Mat4> = new SimpleManager("Matrix Manager");
    public meshBuffers: SimpleManager<MeshBuffer> = new SimpleManager("Mesh Buffer Manager");
    public textureBuffers: SimpleManager<TextureBuffer> = new SimpleManager("Texture Buffer Manager");
    public systems: SystemManager = new SystemManager();
    public usedSystems: EngineSystem[] = [];

    public enableSystem(systemType: EngineSystem) {
        this.usedSystems.push(systemType);
    }

    constructor() {

        this.display = new Display();
        const context = this.display.getContext();
        this.time = new Time();

        this.time.on("start", () => {
            this.systems.callStart();
        });

        this.time.on("fixedUpdate", () => {
            const display = Display.getFocused();
            if (display !== null) {
                display.console.log("----------------Time-------------- ", "");
                display.console.log("FPS: ", this.time.fps.toString());
                display.console.log("Delta time: ", this.time.deltaTime.toString());
                display.console.log("Fixed delta time: ", this.time.fixedDeltaTime.toString());
                display.console.log("Real time: ", this.time.realtimeSinceStartup.toFixed(2));
                display.console.log("Accumulator: ", this.time.accumulator.toString());
            }

            this.systems.callFixedUpdate(this.time.fixedDeltaTime);
        });

        this.time.on("update", () => {
            this.systems.callUpdate(this.time.deltaTime);
            this.systems.callLateUpdate(this.time.deltaTime);
        });


        this.time.on("render", () => {
            if (!this.scene) return;
            const camera = this.scene.getActiveCamera();
            if (!camera) return;
            const color = camera.clearColor;

            context.clearColor(color.r, color.g, color.b, color.a);
            context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

            this.systems.callRender(this.time.deltaTime);
            this.systems.callDrawGizmos();
        });

        this.time.on("stop", () => {
            this.onStopCallback?.();
        })
    }

    loadScene(name: string, clone: boolean = false) {

        const scene = SceneManager.getScene(name);
        if (!scene) {
            throw new Error(`Scene "${name}" not found`);
        }

        const s = clone ? scene.clone() : scene;
        this.loadSceneByInstance(s);
    }

    public unloadScene() {
        if (this.scene) {
            const camera = this.scene.getActiveCamera();
            const clearColor = camera.clearColor;

            const context = this.display.getContext();
            context.clearColor(clearColor.r, clearColor.g, clearColor.b, 1.0);
            context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

            this.systems.clear();
            this.scene = null;
        }
    }

    loadSceneByInstance(scene: Scene) {
        this.unloadScene();
        for (const system of this.usedSystems) {
            let systemInstance = this.systems.getSystem(system);
            if (systemInstance) {
                systemInstance.setScene(scene);
                continue;
            }

            systemInstance = EngineSystemManager.create(system);
            if (!systemInstance) {
                throw new Error(`System ${EngineSystem[system]} could not be created`);
            }

            systemInstance.setScene(scene);
            systemInstance.setEngine(this);
            this.systems.addSystem(system, systemInstance);
        }

        this.scene = scene;
        this.systems.callStart();
        this.onLoadSceneCallback?.(scene);
    }

    setScene(scene: Scene) {
        this.scene = scene;
    }

    getScene() {
        return this.scene;
    }

    public compileShader(name: string, vertSource: string, fragSource: string, system: string) {
        const shader = new Shader(this.getContext(), name, vertSource, fragSource);
        shader.systemName = system;
        this.shaders.add(name, shader);
    }

    public compileTexture(texture: Texture) {
        const textureBuffer = texture.compile(this.getContext());
        if (!textureBuffer) return;
        this.textureBuffers.add(texture.name, textureBuffer);
    }

    public compileMesh(id: string) {
        const mesh = ResourcesManager.MeshManager.get(id);
        if (!mesh) {
            return;
        }

        const meshBuffer = mesh.compile(this.getContext());
        this.meshBuffers.add(mesh.name, meshBuffer);
    }

    protected onFocusCallback?: (engine: Engine) => void;
    protected onLoadSceneCallback?: (scene: Scene) => void;
    protected onStopCallback?: () => void;

    public onStop(callback: () => void) {
        this.onStopCallback = callback;
    }

    public onLoadScene(callback: (scene: Scene) => void) {
        this.onLoadSceneCallback = callback;
    }

    public onFocusWindow(callback: (engine: Engine) => void) {
        this.onFocusCallback = callback;
    }
}
