import { Input } from "@engine/core/input/ElementInput";
import { EngineSystem, EngineSystemManager } from "./core/managers/EngineSystemManager";
import { SceneManager } from "./core/managers/SceneManager";
import { SimpleManager } from "./core/managers/SimpleManager";
import { SystemManager } from "./core/managers/SystemManager";
import type { Mat4 } from "./core/math/Mat4";
import type { Scene } from "./core/scene/scene";
import Time from "./core/time/Time";
import type { MeshBuffer } from "./core/webgl/MeshBuffer";
import type { TextureBuffer } from "./core/webgl/TextureBuffer";
import { EngineWindow } from "./core/window/EngineWindow";
import { NullReferenceException } from "./errors/NullReferenceException";
import { PerspectiveCamera } from "./modules/3D/PerspesctiveCamera";
import type { Camera } from "./modules/shared/camera/Camera";
import { Shader } from "./Rendering/Shader";

abstract class SceneAbstraction {
  private _internalSene: Scene | null = null;

  public get activedScene(): Scene {
    if (!this._internalSene) {
      throw new NullReferenceException("Nao foi possivel ecnontar uma cena");
    }
    return this._internalSene;
  }

  public set activedScene(v: Scene | null) {
    this._internalSene = v;
  }

  public get components() {
    return this.activedScene.components;
  }

  public get entities() {
    return this.activedScene.entities;
  }
}

export class Engine extends SceneAbstraction {
  public targetWindow: EngineWindow;
  public readonly time: Time;
  public input: Input



  public forcedCamera: Camera | null = null;

  public getActivedCamera() {

    if (this.forcedCamera != null) return this.forcedCamera;

    const camera = this.activedScene.getCamera();
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

    super();
    this.targetWindow = engineWindow;
    const context = engineWindow.context;
    this.input = new Input(this.targetWindow.container);


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

      if (!this.activedScene) return;

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
    if (this.activedScene) {
      const camera = this.activedScene.getCamera();
      const clearColor = camera.clearColor;

      const context = this.targetWindow.context;
      context.clearColor(clearColor.r, clearColor.g, clearColor.b, 1.0);
      context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

      this.systems.clear();
      this.activedScene = null;
    }
  }

  loadSceneByInstance(scene: Scene) {
    /*  this.unloadScene(); */
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

    this.activedScene = scene;
    this.systems.callStart();
    this.onLoadSceneCallback?.(scene);
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
