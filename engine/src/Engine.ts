import type { System } from "./core/base/System";
import { Input } from "./core/input/Input";
import type { EngineSystem } from "./core/managers/EngineSystemManager";
import { SimpleManager } from "./core/managers/SimpleManager";
import { SystemManager } from "./core/managers/SystemManager";
import { Time } from "./core/time/Time";
import type { TextureBuffer } from "./core/webgl/TextureBuffer";
import { WebGL } from "./core/webgl/WebGL";
import { Display } from "./core/window/Display";
import { PerspectiveCamera } from "./modules/3D/PerspesctiveCamera";
import { Camera } from "./modules/shared/camera/Camera";

export interface EngineOptions {
  to: string;
}

export class Engine {
  public readonly input: Input;

  public readonly textureBuffers = new SimpleManager<TextureBuffer>("Texture Buffer Manager");
  public readonly systems = new SystemManager();

  private readonly loggedErrors = new Set<string>();

  constructor(options: EngineOptions) {

    const canvas = document.getElementById(options.to) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error();
    }

    WebGL.canvas = canvas;

    const context = canvas.getContext("webgl2");

    if (!context) {
      throw new Error();
    }

    WebGL.context = context;

    this.input = new Input(canvas);

    this.registerTimeEvents();
  }

  private registerTimeEvents(): void {
    Time.on("start", () => this.systems.callStart());
    Time.on("fixedUpdate", () => this.safeFixedUpdate());
    Time.on("update", () => this.safeUpdate());
    Time.on("render", () => this.safeRender());
  }

  private safeUpdate(): void {
    try {
      this.systems.callUpdate();
      this.systems.callLateUpdate();
      this.input.clear();
    } catch (e: any) {
      this.logErrorOnce("update", e);
    }
  }

  private safeRender(): void {
    try {

      const camera = Camera.getActivedCamera();

      if (camera instanceof PerspectiveCamera) {
        camera.aspect = Display.getAspectRatio();
      }

      const context = WebGL.context;
      const color = camera.clearColor;
      context.clearColor(color.r, color.g, color.b, color.a);
      context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

      this.systems.callRender();
      this.systems.callDrawGizmos();
    } catch (e: any) {
      this.logErrorOnce("render", e);
    }
  }


  debug = document.querySelector("#debug")!;

  private safeFixedUpdate(): void {

    this.debug.textContent = Time.fps.toString();
    try {
      this.systems.callFixedUpdate();
    } catch (e: any) {
      this.logErrorOnce("fixedUpdate", e);
    }
  }

  private logErrorOnce(context: string, error: any): void {
    const key = error?.message || error?.toString();
    if (!this.loggedErrors.has(key)) {
      this.loggedErrors.add(key);
      console.error(`Erro inesperado em ${context}`, error);
    }
  }

  public enableSystem(type: EngineSystem, system: System): void {
    system.engine = this;
    this.systems.addSystem(type, system);
  }
}
