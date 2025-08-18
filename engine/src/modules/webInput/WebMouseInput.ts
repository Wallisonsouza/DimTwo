import { Vec2 } from "../../core/math/Vec2";
import type { IMouseInput } from "../../interfaces/IInput";

export class WebMouseInput implements IMouseInput {
  private button = new Map<number, boolean>();
  private buttonDown = new Map<number, boolean>();
  private buttonUp = new Map<number, boolean>();
  private position = new Vec2(0, 0);
  private movement = new Vec2(0, 0);
  private scrollDelta = new Vec2(0, 0);
  private scrollCallback: ((delta: Vec2) => void) | null = null;

  private onMouseDown = (e: MouseEvent) => this.handleButtonDown(e);
  private onMouseUp = (e: MouseEvent) => this.handleButtonUp(e);
  private onMouseMove = (e: MouseEvent) => this.handleMouseMove(e);
  private onWheel = (e: WheelEvent) => this.handleScroll(e);

  enable() {
    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('wheel', this.onWheel);
  }

  disable() {
    document.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('wheel', this.onWheel);
  }

  private handleButtonDown(e: MouseEvent): void {
    if (!this.button.get(e.button)) {
      this.button.set(e.button, true);
      this.buttonDown.set(e.button, true);
    }
  }

  private handleButtonUp(e: MouseEvent): void {
    this.button.set(e.button, false);
    this.buttonUp.set(e.button, true);
  }

  private handleMouseMove(e: MouseEvent): void {
    this.position = new Vec2(e.clientX, e.clientY);
    this.movement = new Vec2(e.movementX, e.movementY);
  }

  private handleScroll(e: WheelEvent): void {
    this.scrollDelta = new Vec2(e.deltaX, e.deltaY);
    if (this.scrollCallback) {
      this.scrollCallback(this.scrollDelta);
    }
  }

  clear(): void {
    this.buttonDown.clear();
    this.buttonUp.clear();
    this.movement = new Vec2(0, 0);
    this.scrollDelta = new Vec2(0, 0);
  }

  getMouseButtonDown(button: number): boolean {
    return this.buttonDown.get(button) ?? false;
  }

  getMouseButton(button: number): boolean {
    return this.button.get(button) ?? false;
  }

  getMouseButtonUp(button: number): boolean {
    return this.buttonUp.get(button) ?? false;
  }

  getMousePosition(): Vec2 {
    return this.position;
  }

  getMouseMovement(): Vec2 {
    return this.movement;
  }

  getScrollDelta(): Vec2 {
    return this.scrollDelta;
  }

  onMouseScroll(callback: (delta: Vec2) => void): void {
    this.scrollCallback = callback;
  }
}
