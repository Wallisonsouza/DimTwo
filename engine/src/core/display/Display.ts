import { Vec3 } from "../math/Vec3";

// ---------------------------
// EngineWindow
// ---------------------------
export class EngineWindow {
  readonly context: WebGL2RenderingContext;
  readonly canvas: HTMLCanvasElement;
  readonly container: HTMLDivElement;

  public isFocus: boolean = false;
  public width = 0;
  public height = 0;
  public auto: boolean = true;

  public get aspectRatio() {
    return this.height === 0 ? 1 : this.width / this.height;
  }

  constructor() {
    this.container = document.createElement("div");
    this.container.className = "engine-window";

    this.canvas = document.createElement("canvas");
    this.canvas.className = "engine-canvas";

    this.container.appendChild(this.canvas);

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

    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context.viewport(0, 0, this.width, this.height);
  }

  public toNDC(p: Vec3): Vec3 {
    const ndcX = (2 * p.x) / this.width - 1;
    const ndcY = 1 - (2 * p.y) / this.height;
    return new Vec3(ndcX, ndcY, 0);
  }

  private handleEvents() {
    window.addEventListener("resize", () => {
      this.resize();
    });
  }
}

// ---------------------------
// Display
// ---------------------------
export class Display {
  private static windows: EngineWindow[] = [];
  private static windowIndex = 0;

  public static get current(): EngineWindow | null {
    return this.windows[this.windowIndex] ?? null;
  }

  public static addEngineWindow(window: EngineWindow) {
    const index = this.windows.length;
    this.windows.push(window);

    // Clique na janela ativa ela
    window.container.addEventListener("click", () => {
      this.setActive(index);
    });
  }

  public static get width() {
    return this.current?.width || 0;
  }

  public static get height() {
    return this.current?.height || 0;
  }

  public static get aspectRatio() {
    return this.current?.aspectRatio || 1;
  }

  public static toNDC(point: Vec3) {
    return this.current?.toNDC(point) || new Vec3(0, 0, 0);
  }

  public static setActive(index: number) {
    if (index < 0 || index >= this.windows.length) return;

    const prev = this.current;
    if (prev) prev.isFocus = false;

    this.windowIndex = index;
    const active = this.current!;
    active.isFocus = true;
  }
}
