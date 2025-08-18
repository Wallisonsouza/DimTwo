import type { IKeyboardInput, IMouseInput } from "./IInput";

export class InputBuilder {
  keyboard: IKeyboardInput;
  mouse: IMouseInput;

  constructor(keyboard: IKeyboardInput, mouse: IMouseInput) {
    this.keyboard = keyboard;
    this.mouse = mouse;
  }

  enable() {
    this.keyboard.enable();
    this.mouse.enable();
  }

  disable() {
    this.keyboard.disable();
    this.mouse.disable();
  }

  clear() {
    this.keyboard.clear();
    this.mouse.clear();
  }
}
