import { Input } from "@engine/core/input/ElementInput";
import type { System } from "./core/base/System";
import type { EngineSystem } from "./core/managers/EngineSystemManager";
import { SceneManager } from "./core/managers/SceneManager";
import { SimpleManager } from "./core/managers/SimpleManager";
import { SystemManager } from "./core/managers/SystemManager";
import type { Mat4 } from "./core/math/Mat4";
import type { Scene } from "./core/scene/scene";
import Time from "./core/time/Time";
import type { MeshBuffer } from "./core/webgl/MeshBuffer";
import type { TextureBuffer } from "./core/webgl/TextureBuffer";
import { EngineWindow } from "./core/window/EngineWindow";
import { Debug } from "./exception /Debug";
import { NullReferenceException } from "./exception /NullReferenceException";
import { SceneNotFoundException } from "./exception /SceneNotFoundException";
import { PerspectiveCamera } from "./modules/3D/PerspesctiveCamera";
import type { Camera } from "./modules/shared/camera/Camera";
import { Shader } from "./Rendering/Shader";

abstract class SceneAbstraction {
  private _internalScene: Scene | null = null;

  public get activeScene(): Scene {
    if (!this._internalScene) {
      throw new SceneNotFoundException("Nenhuma cena está ativa na engine");
    }
    return this._internalScene;
  }

  public set activeScene(v: Scene | null) {
    this._internalScene = v;
  }

  public get components() {
    return this.activeScene?.components ?? [];
  }

  public get entities() {
    return this.activeScene?.entities ?? [];
  }

  protected onLoadSceneCallback?: (scene: Scene) => void;
  public onLoadScene(callback: (scene: Scene) => void) {
    this.onLoadSceneCallback = callback;
  }

  loadScene(name: string, clone: boolean = false) {

    const scene = SceneManager.getScene(name);
    if (!scene) {
      throw new SceneNotFoundException(
        `[SceneManager.loadScene] Falha ao carregar a cena "${name}". Cena não encontrada.`
      );

    }

    this.activeScene = clone ? scene.clone() : scene;
    this.onLoadSceneCallback?.(scene);
  }

}


export class Engine extends SceneAbstraction {
  public engineWindow: EngineWindow;
  public readonly time: Time;
  public input: Input



  public forcedCamera: Camera | null = null;

  public getActivedCamera() {

    if (this.forcedCamera != null) return this.forcedCamera;

    const camera = this.activeScene.getCamera();
    if (!camera) throw new NullReferenceException();

    return camera;
  }

  public shaders: SimpleManager<Shader> = new SimpleManager("Shader Manager");
  public matrices: SimpleManager<Mat4> = new SimpleManager("Matrix Manager");
  public meshBuffers: SimpleManager<MeshBuffer> = new SimpleManager("Mesh Buffer Manager");
  public textureBuffers: SimpleManager<TextureBuffer> = new SimpleManager("Texture Buffer Manager");
  public systems: SystemManager = new SystemManager();

  public enableSystem(type: EngineSystem, system: System) {
    system.engine = this;
    this.systems.addSystem(type, system);
  }

  constructor(engineWindow: EngineWindow) {

    super();
    this.engineWindow = engineWindow;
    this.input = new Input(this.engineWindow.container);

    this.time = new Time();

    this.time.on("start", () => {
      this.systems.callStart();
    });

    this.time.on("fixedUpdate", () => {
      this.systems.callFixedUpdate(this.time.fixedDeltaTime);
    });
    const loggedErrors = new Set<string>();

    this.time.on("update", () => {
      try {
        this.systems.callUpdate(this.time.deltaTime);
        this.input.clear();
      } catch (e: any) {
        const key = e?.message || e?.toString();
        if (!loggedErrors.has(key)) {
          loggedErrors.add(key);
          Debug.error("Erro inesperado em update", e);
        }
      }
    });

    this.time.on("render", () => {
      try {
        if (!this.activeScene) return;

        const camera = this.getActivedCamera();
        if (camera instanceof PerspectiveCamera) camera.aspect = this.engineWindow.aspectRatio;

        const color = camera.clearColor;
        const context = this.engineWindow.context;
        context.clearColor(color.r, color.g, color.b, color.a);
        context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

        this.systems.callRender(this.time.deltaTime);
        this.systems.callDrawGizmos();
      } catch (e: any) {
        const key = e?.message || e?.toString();
        if (!loggedErrors.has(key)) {
          loggedErrors.add(key);
          Debug.error("Erro inesperado em render", e);
        }

      }
    });


    this.time.on("stop", () => {
      this.onStopCallback?.();
    })
  }

  protected onStopCallback?: () => void;
  public onStop(callback: () => void) {
    this.onStopCallback = callback;
  }


}
