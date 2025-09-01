import { Mat4 } from "../math/Mat4";
import { Vec3 } from "../math/Vec3";

export class Display {
    readonly context: WebGL2RenderingContext;
    readonly canvas: HTMLCanvasElement;

    public width: number = 0;
    public height: number = 0;

    private static focused: Display | null = null;

    public static get width() {
        return Display.focused?.width ?? 0;
    }
    public static get height() {
        return Display.focused?.height ?? 0;
    }
    public static get aspect() {

        if (this.width === 0 && this.height === 0 || this.width === 0) {
            return 1;
        }
        return this.width / this.height;
    }

    constructor() {
        this.canvas = document.createElement("canvas");
        this.canvas.className = "engine-canvas";

        const gl = this.canvas.getContext("webgl2");
        if (!gl) throw new Error("WebGL2 not supported");
        this.context = gl;

        this.handleEvents();
    }

    public getAspectRatio(): number {
        return this.canvas.width / this.canvas.height;
    }

    public updateDimensions() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.context.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.width = rect.width;
        this.height = rect.height;
    }
    private handleEvents() {
        window.addEventListener("resize", () => {
            this.updateDimensions();
        });
    }

    public getContext(): WebGL2RenderingContext {
        return this.context;
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }


    public static getFocused(): Display | null {
        return this.focused;
    }

    public static normalize(p: Vec3): Vec3 {
        const ndcX = (2 * p.x) / Display.width - 1;
        const ndcY = 1 - (2 * p.y) / Display.height;
        return new Vec3(ndcX, ndcY, 0);
    }

    cacheMatrix: Mat4 = new Mat4();
}
