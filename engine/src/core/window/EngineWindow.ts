import { Vec3 } from "../math/Vec3";

export class EngineWindow {
  readonly context: WebGL2RenderingContext;
  readonly canvas: HTMLCanvasElement;
  readonly container: HTMLDivElement;

  static current: EngineWindow;

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

    this.container.addEventListener("click", () => {
      this.setCurrentWindow();
    });

    if (!EngineWindow.current) {
      this.setCurrentWindow();
    }

    this.resize();
    this.handleEvents();
  }


  private setCurrentWindow() {
    if (EngineWindow.current) {
      EngineWindow.current.isFocus = false;
    }

    this.isFocus = true;
    EngineWindow.current = this;
  }

  public resize(width?: number, height?: number) {
    if (width === undefined || height === undefined) {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      this.width = Math.round(rect.width * dpr);
      this.height = Math.round(rect.height * dpr);
    } else {
      this.width = Math.round(width);
      this.height = Math.round(height);
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