import { ElementInput } from "@game/systems/ElementInput";
import { EngineWindow } from "./core/display/Display";
import { EngineSystem, EngineSystemManager } from "./core/managers/EngineSystemManager";
import { SceneManager } from "./core/managers/SceneManager";
import { SimpleManager } from "./core/managers/SimpleManager";
import { SystemManager } from "./core/managers/SystemManager";
import type { Mat4 } from "./core/math/Mat4";
import type { Scene } from "./core/scene/scene";
import Time from "./core/time/Time";
import type { MeshBuffer } from "./core/webgl/MeshBuffer";
import type { TextureBuffer } from "./core/webgl/TextureBuffer";
import { NullReferenceException } from "./errors/NullReferenceException";
import { PerspectiveCamera } from "./modules/3D/PerspesctiveCamera";
import type { Camera } from "./modules/shared/camera/Camera";
import { Shader } from "./Rendering/Shader";

export enum Cameras {
  "MainCamera",
  "EditorCamera"
}

export class Engine {
  public targetWindow: EngineWindow;
  public readonly time: Time;
  protected scene: Scene | null = null;
  public input: ElementInput;

  public forcedCamera: Camera | null = null;

  public getActivedCamera() {

    if (this.forcedCamera != null) return this.forcedCamera;

    const scene = this.getScene();
    if (!scene) throw new NullReferenceException();

    const camera = scene.getCamera();
    if (!camera) throw new NullReferenceException();

    return camera;
  }

  public shaders: SimpleManager<Shader> = new SimpleManager("Shader Manager");
  public matrices: SimpleManager<Mat4> = new SimpleManager("Matrix Manager");
  public meshBuffers: SimpleManager<MeshBuffer> = new SimpleManager("Mesh Buffer Manager");
  public textureBuffers: SimpleManager<TextureBuffer> = new SimpleManager("Texture Buffer Manager");
  public systems: SystemManager = new SystemManager();
  public usedSystems: EngineSystem[] = [];

  public enableSystem(systemType: EngineSystem) {
    this.usedSystems.push(systemType);
  }

  constructor(engineWindow: EngineWindow) {

    this.targetWindow = engineWindow;
    const context = engineWindow.context;
    this.input = new ElementInput(this.targetWindow.container);


    this.time = new Time();

    this.time.on("start", () => {
      this.systems.callStart();
    });

    this.time.on("fixedUpdate", () => {
      this.systems.callFixedUpdate(this.time.fixedDeltaTime);
    });

    this.time.on("update", () => {
      this.systems.callUpdate(this.time.deltaTime);
      this.systems.callLateUpdate(this.time.deltaTime);
    });

    this.time.on("lateUpdate", () => {
      this.input.clear()
    });


    this.time.on("render", () => {

      if (!this.scene) return;

      const camera = this.getActivedCamera();
      if (camera instanceof PerspectiveCamera) camera.aspect = this.targetWindow.aspectRatio;

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
      const camera = this.scene.getCamera();
      const clearColor = camera.clearColor;

      const context = this.targetWindow.context;
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
    if (!this.scene) throw new NullReferenceException();
    return this.scene;
  }

  protected onLoadSceneCallback?: (scene: Scene) => void;
  protected onStopCallback?: () => void;

  public onStop(callback: () => void) {
    this.onStopCallback = callback;
  }

  public onLoadScene(callback: (scene: Scene) => void) {
    this.onLoadSceneCallback = callback;
  }

}
