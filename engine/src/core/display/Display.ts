import { Input } from "@game/systems/InputSystem";
import { Mat4 } from "../math/Mat4";
import { Vec3 } from "../math/Vec3";

type ConsoleLineGroup = {
    container: HTMLDivElement;
    title: HTMLDivElement;
    text: HTMLDivElement;
};

export class DebugConsole {
    private container: HTMLDivElement;
    private groups: Map<string, ConsoleLineGroup> = new Map();
    private maxLinesPerGroup: number;

    constructor(parent: HTMLElement, maxLinesPerGroup: number = 50) {
        this.maxLinesPerGroup = maxLinesPerGroup;

        this.container = document.createElement("div");
        this.container.className = "debug-console";
        parent.appendChild(this.container);
    }

    private getOrCreateGroup(groupName: string): ConsoleLineGroup {
        let group = this.groups.get(groupName);
        if (!group) {
            const container = document.createElement("div");
            container.className = "debug-console__group";

            const title = document.createElement("div");
            title.className = "debug-console__group__title";
            title.innerText = groupName;

            const text = document.createElement("div");
            text.className = "debug-console__group__text";

            container.appendChild(title);
            container.appendChild(text);
            this.container.appendChild(container);

            group = { container, title, text };
            this.groups.set(groupName, group);
        }
        return group;
    }

    public log(groupName: string, message: string) {
        const group = this.getOrCreateGroup(groupName);

        const line = document.createElement("div");
        line.className = "debug-console__group__line";
        line.innerText = message;

        group.text.appendChild(line);

        while (group.text.children.length > this.maxLinesPerGroup) {
            group.text.removeChild(group.text.firstChild!);
        }

        group.text.scrollTop = group.text.scrollHeight;
    }

    public clear() {
        this.container.innerHTML = "";
        this.groups.clear();
    }
}


export class Display {
    private readonly context: WebGL2RenderingContext;
    private readonly canvas: HTMLCanvasElement;
    protected readonly container: HTMLDivElement;
    public readonly console: DebugConsole;

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
        this.container = document.createElement("div");
        this.container.className = "window-container";

        this.canvas = document.createElement("canvas");
        this.canvas.className = "engine-canvas";

        this.console = new DebugConsole(this.container, 1);

        const test = document.createElement("div");
        test.className = "aim";
        this.container.appendChild(test);

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
