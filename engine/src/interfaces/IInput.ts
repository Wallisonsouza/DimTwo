import type { Vec2 } from "../core/math/Vec2";

export interface IInputDevice {
  enable(target: HTMLElement): void;
  disable(target: HTMLElement): void;
  clear(): void;
}

export interface IMouseInput extends IInputDevice {
  getMouseButton(button: number): boolean;
  getMouseButtonDown(button: number): boolean;
  getMouseButtonUp(button: number): boolean;
  getMousePosition(): Vec2;
  getMouseMovement(): Vec2;
  getScrollDelta(): Vec2;
  onMouseScroll(callback: (delta: Vec2) => void): void;
}

export interface IKeyboardInput extends IInputDevice {
  getKey(code: string): boolean;
  getKeyDown(code: string): boolean;
  getKeyUp(code: string): boolean;
}
