import type { Camera } from "@engine/modules/components/render/Camera";
import { Input } from "@game/systems/InputSystem";
import { Mat4 } from "../math/Mat4";
import { Vec2 } from "../math/Vec2";
import { Vec3 } from "../math/Vec3";
import { Vec4 } from "../math/Vec4";

export class Display {

    private readonly context: WebGL2RenderingContext;
    private readonly canvas: HTMLCanvasElement;
    protected readonly container: HTMLDivElement;

    private static focused: Display | null = null;

    public width: number = 800;
    public height: number = 600;

    constructor() {
        this.container = document.createElement("div");
        this.container.className = "window-container";

        this.canvas = document.createElement("canvas");
        this.canvas.className = "engine-canvas";

        this.container.appendChild(this.canvas);

        const gl = this.canvas.getContext("webgl2");
        if (!gl) throw new Error("WebGL2 not supported");
        this.context = gl;

        this.handleEvents();
    }

    public getAspectRatio(): number {
        return this.width / this.height;
    }

    public getInternalAspectRatio(): number {
        return this.canvas.width / this.canvas.height;
    }
    public setResolution(width: number, height: number) {
        this.canvas.width = width;
        this.canvas.height = height;

        this.updateDimensions();
        this.context.viewport(0, 0, width, height);
    }

    private updateDimensions() {
        const rect = this.canvas.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
    }

    public addToDocument(parent: HTMLElement) {
        parent.appendChild(this.container);
    }

    private handleEvents() {
        this.container.addEventListener("click", () => this.setFocused(this));

        window.addEventListener("resize", () => {
            this.updateDimensions();
            this.context.viewport(0, 0, this.canvas.width, this.canvas.height);
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

    public setFocused(display: Display) {
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

    public toNDC(p: Vec2): Vec2 {
        const rect = this.container.getBoundingClientRect();
        const xInContainer = p.x - rect.left;
        const yInContainer = p.y - rect.top;

        const ndcX = (2 * xInContainer) / rect.width - 1;
        const ndcY = 1 - (2 * yInContainer) / rect.height;

        return new Vec2(ndcX, ndcY);
    }

    toWorld(mouse: Vec2, camera: Camera, zDepth: number = -1): Vec3 {

        const ndc = this.toNDC(mouse);

        const clip = new Vec4(ndc.x, ndc.y, zDepth, 1);

        const projInverse = camera.projection;
        const worldVec4 = Mat4.multiplyVec4(projInverse, clip);

        worldVec4.x /= worldVec4.w;
        worldVec4.y /= worldVec4.w;
        worldVec4.z /= worldVec4.w;

        return new Vec3(worldVec4.x, worldVec4.y, worldVec4.z);
    }


}
