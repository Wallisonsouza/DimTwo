import { Input } from "@game/systems/InputSystem";
import { Mat4 } from "../math/Mat4";
import { Vec3 } from "../math/Vec3";

export class Display {

    private readonly context: WebGL2RenderingContext;
    private readonly canvas: HTMLCanvasElement;
    protected readonly container: HTMLDivElement;

    public width: number = 0;
    public height: number = 0;

    private static focused: Display | null = null;

    public static get width() {
        return Display.focused?.width ?? 0;
    };

    public static get height() {
        return Display.focused?.height ?? 0;
    }

    constructor() {
        this.container = document.createElement("div");
        this.container.className = "window-container";

        this.canvas = document.createElement("canvas");
        this.canvas.className = "engine-canvas";

        const test = document.createElement("div");
        test.className = "aim";
        this.container.appendChild(test)

        this.container.appendChild(this.canvas);

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

    public addToDocument(parent: HTMLElement) {
        parent.appendChild(this.container);
    }

    private handleEvents() {
        this.container.addEventListener("click", () => Display.setFocused(this));

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

    public getContainer(): HTMLDivElement {
        return this.container;
    }

    public static getFocused(): Display | null {
        return this.focused;
    }

    public static setFocused(display: Display) {
        if (Display.focused) {
            Input.mouse.disable(display.container);
            Input.keyboard.disable(display.container);
            Display.focused.container.classList.remove("focused");
        }

        display.container.classList.add("focused");
        Display.focused = display;
        Input.mouse.enable(display.container);
        Input.keyboard.enable(display.container);
    }

    public static normalize(p: Vec3): Vec3 {
        const ndcX = (2 * p.x) / Display.width - 1;
        const ndcY = 1 - (2 * p.y) / Display.height;
        return new Vec3(ndcX, ndcY, 0);
    }

    cacheMatrix: Mat4 = new Mat4();

}
