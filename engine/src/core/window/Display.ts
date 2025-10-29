import { Vec3 } from "../math/Vec3";
import { WebGL } from "../webgl/WebGL";

export abstract class Display {
  public static width = 0;
  public static height = 0;

  public static getAspectRatio() {
    return Display.height === 0 ? 1 : Display.width / Display.height;
  }

  constructor() {
    this.resize();
    this.handleEvents();
  }

  public resize(width?: number, height?: number) {

    const canvas = WebGL.canvas;
    const context = WebGL.context;

    if (width === undefined || height === undefined) {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      Display.width = Math.round(rect.width * dpr);
      Display.height = Math.round(rect.height * dpr);
    } else {
      Display.width = Math.round(width);
      Display.height = Math.round(height);
    }

    canvas.width = Display.width;
    canvas.height = Display.height;
    context.viewport(0, 0, Display.width, Display.height);
  }


  public static toNDC(p: Vec3): Vec3 {
    const ndcX = (2 * p.x) / Display.width - 1;
    const ndcY = 1 - (2 * p.y) / Display.height;
    return new Vec3(ndcX, ndcY, 0);
  }

  private handleEvents() {
    window.addEventListener("resize", () => {
      this.resize();
    });
  }
}