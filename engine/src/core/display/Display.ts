import { Vec3 } from "../math/Vec3";

export class EngineWindow {
  readonly context: WebGL2RenderingContext;
  readonly canvas: HTMLCanvasElement;

  public width: number = 0;
  public height: number = 0;
  public auto: boolean = true;

  public get aspectRatio() {
    return this.height === 0 ? 1 : this.width / this.height;
  }

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.className = "engine-canvas";

    const gl = this.canvas.getContext("webgl2");
    if (!gl) throw new Error("WebGL2 not supported");
    this.context = gl;

    this.resize();
    this.handleEvents();
  }

  public resize(width?: number, height?: number) {
    if (width === undefined || height === undefined) {
      const rect = this.canvas.getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;
    } else {
      this.width = width;
      this.height = height;
    }

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.floor(this.width * dpr);
    this.canvas.height = Math.floor(this.height * dpr);

    this.context.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  public toNDC(p: Vec3): Vec3 {
    const ndcX = (2 * p.x) / this.width - 1;
    const ndcY = 1 - (2 * p.y) / this.height;
    return new Vec3(ndcX, ndcY, 0);
  }

  private handleEvents() {
    window.addEventListener("resize", () => {
      if (this.auto) {
        this.resize();
      }
    });
  }
}

export class Display {
  private static windows: EngineWindow[] = [];
  private static windowIndex: number = 0;

  public static addEngineWindow(window: EngineWindow) {
    this.windows.push(window);
  }
  public static get current(): EngineWindow | null {
    return this.windows[this.windowIndex] ?? null;
  }

  public static get width() {
    return this.current?.width ?? 0;
  }

  public static get height() {
    return this.current?.height ?? 0;
  }

  public static get aspectRatio() {
    return this.current?.aspectRatio ?? 1;
  }

  public static setActive(index: number) {
    if (index >= 0 && index < this.windows.length) {
      this.windowIndex = index;
    }
  }
}
