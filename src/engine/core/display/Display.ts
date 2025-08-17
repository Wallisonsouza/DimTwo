export class Display {

    private readonly context: WebGL2RenderingContext;
    private readonly canvas: HTMLCanvasElement;
    protected readonly container: HTMLDivElement;
    protected readonly optionsBar: HTMLDivElement;

    private static focused: Display | null = null;

    public width: number = 800;
    public height: number = 600;

    constructor() {
        this.container = document.createElement("div");
        this.container.className = "window-container";

        this.optionsBar = document.createElement("div");
        this.optionsBar.className = "engine-options-bar";

        this.canvas = document.createElement("canvas");
        this.canvas.className = "engine-canvas";

        this.container.appendChild(this.optionsBar);
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
        this.updateDimensions();
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
        if (Display.focused) Display.focused.container.classList.remove("focused");

        display.container.classList.add("focused");
        Display.focused = display;
    }
}
