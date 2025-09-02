/* import { Vec3 } from "@engine/core/math/Vec3";
import type { KeyCode } from "@engine/modules/webInput/WebKeyCode";

export class WindowInput {
    private key = new Map<string, boolean>();
    private keyDown = new Map<string, boolean>();
    private keyUp = new Map<string, boolean>();

    private button = new Map<number, boolean>();
    private buttonDown = new Map<number, boolean>();
    private buttonUp = new Map<number, boolean>();

    private position = new Vec3(0, 0, 0);
    private movement = new Vec3(0, 0, 0);
    private scrollDelta = new Vec3(0, 0, 0);
    private scrollCallback: ((delta: Vec3) => void) | null = null;

    private onKeyDown = (e: KeyboardEvent) => {
        if (!this.key.get(e.code)) {
            this.key.set(e.code, true);
            this.keyDown.set(e.code, true);
        }
    };
    private onKeyUp = (e: KeyboardEvent) => {
        this.key.set(e.code, false);
        this.keyUp.set(e.code, true);
    };
    private onMouseDown = (e: MouseEvent) => {
        if (!this.button.get(e.button)) {
            this.button.set(e.button, true);
            this.buttonDown.set(e.button, true);
        }
    };
    private onMouseUp = (e: MouseEvent) => {
        this.button.set(e.button, false);
        this.buttonUp.set(e.button, true);
    };
    private onMouseMove = (e: MouseEvent) => {
        this.position = new Vec3(e.clientX, e.clientY, 0);
        this.movement = new Vec3(e.movementX, e.movementY, 0);
    };
    private onWheel = (e: WheelEvent) => {
        this.scrollDelta = new Vec3(e.deltaX, e.deltaY, 0);
        if (this.scrollCallback) this.scrollCallback(this.scrollDelta);
    };

    public enable() {
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
        window.addEventListener("mousedown", this.onMouseDown);
        window.addEventListener("mouseup", this.onMouseUp);
        window.addEventListener("mousemove", this.onMouseMove);
        window.addEventListener("wheel", this.onWheel);
    }

    public disable() {
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);
        window.removeEventListener("mousedown", this.onMouseDown);
        window.removeEventListener("mouseup", this.onMouseUp);
        window.removeEventListener("mousemove", this.onMouseMove);
        window.removeEventListener("wheel", this.onWheel);
        this.clear();
    }

    public getKey(code: KeyCode) { return this.key.get(code) ?? false; }
    public getKeyDown(code: KeyCode) { return this.keyDown.get(code) ?? false; }
    public getKeyUp(code: KeyCode) { return this.keyUp.get(code) ?? false; }

    public getMouseButton(button: number) { return this.button.get(button) ?? false; }
    public getMouseButtonDown(button: number) { return this.buttonDown.get(button) ?? false; }
    public getMouseButtonUp(button: number) { return this.buttonUp.get(button) ?? false; }

    public getMousePosition(): Vec3 { return this.position; }
    public getMouseMovement(): Vec3 { return this.movement; }
    public getScrollDelta(): Vec3 { return this.scrollDelta; }

    public onMouseScroll(callback: (delta: Vec3) => void) { this.scrollCallback = callback; }

    public clear() {
        this.keyDown.clear();
        this.keyUp.clear();
        this.buttonDown.clear();
        this.buttonUp.clear();
        this.movement = new Vec3(0, 0, 0);
        this.scrollDelta = new Vec3(0, 0, 0);
    }
}

export const Input = new WindowInput();
Input.enable(); */