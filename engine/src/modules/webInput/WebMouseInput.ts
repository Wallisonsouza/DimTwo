import { Vec3 } from "@engine/core/math/Vec3";
import { Vec2 } from "@engine/modules/2D/Vec2";

export class WebMouseInput  {
  private targetElement: HTMLElement | null = null;

  private button = new Map<number, boolean>();
  private buttonDown = new Map<number, boolean>();
  private buttonUp = new Map<number, boolean>();
  private position = new Vec3(0, 0, 0);
  private movement = new Vec3(0, 0, 0);
  private scrollDelta = new Vec2(0, 0);
  private scrollCallback: ((delta: Vec2) => void) | null = null;

  private onMouseDown = (e: MouseEvent) => this.handleButtonDown(e);
  private onMouseUp = (e: MouseEvent) => this.handleButtonUp(e);
  private onMouseMove = (e: MouseEvent) => this.handleMouseMove(e);
  private onWheel = (e: WheelEvent) => this.handleScroll(e);

  enable(target: HTMLElement) {
    this.targetElement = target;
    target.addEventListener('mousedown', this.onMouseDown);
    target.addEventListener('mouseup', this.onMouseUp);
    target.addEventListener('mousemove', this.onMouseMove);
    target.addEventListener('wheel', this.onWheel);
  }

  disable(target: HTMLElement) {
    target.removeEventListener('mousedown', this.onMouseDown);
    target.removeEventListener('mouseup', this.onMouseUp);
    target.removeEventListener('mousemove', this.onMouseMove);
    target.removeEventListener('wheel', this.onWheel);
    this.targetElement = null;
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
    if (!this.targetElement) return;

    const rect = this.targetElement.getBoundingClientRect();
    this.position = new Vec3(e.clientX - rect.left, e.clientY - rect.top, 0);
    this.movement = new Vec3(e.movementX, e.movementY, 0);
  }

  private handleScroll(e: WheelEvent): void {
    this.scrollDelta = new Vec2(e.deltaX, e.deltaY);
    if (this.scrollCallback) this.scrollCallback(this.scrollDelta);
  }

  clear(): void {
    this.buttonDown.clear();
    this.buttonUp.clear();
    this.movement = new Vec3(0, 0, 0);
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

  getMousePosition(): Vec3 {
    return this.position;
  }

  getMouseMovement(): Vec3 {
    return this.movement;
  }

  getScrollDelta(): Vec2 {
    return this.scrollDelta;
  }

  onMouseScroll(callback: (delta: Vec2) => void): void {
    this.scrollCallback = callback;
  }
}
