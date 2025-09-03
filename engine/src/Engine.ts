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
import { SceneNotFoundException } from "./exception /SceneNotFoundException";
import { PerspectiveCamera } from "./modules/3D/PerspesctiveCamera";
import type { Camera } from "./modules/shared/camera/Camera";
import { Shader } from "./Rendering/Shader";

abstract class SceneAbstraction {
  private _internalScene: Scene | null = null;
  public forceActiveCamera: Camera | null = null;

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
      throw new SceneNotFoundException(`[SceneManager.loadScene] Falha ao carregar a cena "${name}". Cena não encontrada.`);
    }

    this.activeScene = clone ? scene.clone() : scene;
    this.onLoadSceneCallback?.(scene);
  }

  public getActivedCamera() {
    if (this.forceActiveCamera !== null && this.forceActiveCamera.enabled) {
      return this.forceActiveCamera;
    }
    return this.activeScene.activeCamera;
  }

}


export class Engine extends SceneAbstraction {
  public readonly engineWindow: EngineWindow;
  public readonly time: Time;
  public readonly input: Input;

  public readonly shaders = new SimpleManager<Shader>("Shader Manager");
  public readonly matrices = new SimpleManager<Mat4>("Matrix Manager");
  public readonly meshBuffers = new SimpleManager<MeshBuffer>("Mesh Buffer Manager");
  public readonly textureBuffers = new SimpleManager<TextureBuffer>("Texture Buffer Manager");
  public readonly systems = new SystemManager();

  private readonly loggedErrors = new Set<string>();

  constructor(engineWindow: EngineWindow) {
    super();
    this.engineWindow = engineWindow;
    this.input = new Input(engineWindow.container);
    this.time = new Time();

    this.registerTimeEvents();
  }

  private registerTimeEvents(): void {
    this.time.on("start", () => this.systems.callStart());
    this.time.on("fixedUpdate", () => this.systems.callFixedUpdate(this.time.fixedDeltaTime));
    this.time.on("update", () => this.safeUpdate());
    this.time.on("render", () => this.safeRender());
  }

  private safeUpdate(): void {
    try {
      this.systems.callUpdate(this.time.deltaTime);
      this.input.clear();
    } catch (e: any) {
      this.logErrorOnce("update", e);
    }
  }

  private safeRender(): void {
    try {
      const camera = this.getActivedCamera();
      if (camera instanceof PerspectiveCamera) {
        camera.aspect = this.engineWindow.aspectRatio;
      }

      const context = this.engineWindow.context;
      const color = camera.clearColor;
      context.clearColor(color.r, color.g, color.b, color.a);
      context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

      this.systems.callRender(this.time.deltaTime);
      this.systems.callDrawGizmos();
    } catch (e: any) {
      this.logErrorOnce("render", e);
    }
  }

  private logErrorOnce(context: string, error: any): void {
    const key = error?.message || error?.toString();
    if (!this.loggedErrors.has(key)) {
      this.loggedErrors.add(key);
      Debug.error(`Erro inesperado em ${context}`, error);
    }
  }

  public enableSystem(type: EngineSystem, system: System): void {
    system.engine = this;
    this.systems.addSystem(type, system);
  }
}
