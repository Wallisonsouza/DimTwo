import type { IKeyboardInput } from "../../interfaces/IInput";

export class WebKeyboardInput implements IKeyboardInput {
  private key = new Map<string, boolean>();
  private keyDown = new Map<string, boolean>();
  private keyUp = new Map<string, boolean>();

  private onKeyDown = (e: KeyboardEvent) => this.handleKeyDown(e);
  private onKeyUp = (e: KeyboardEvent) => this.handleKeyUp(e);

  enable() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  disable() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    const code = e.code;
    if (!this.key.get(code)) {
      this.key.set(code, true);
      this.keyDown.set(code, true);
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    const code = e.code;
    this.key.set(code, false);
    this.keyUp.set(code, true);
  }

  clear(): void {
    this.keyDown.clear();
    this.keyUp.clear();
  }

  private getButtonState(map: Map<string, boolean>, code: string): boolean {
    const state = map.get(code) ?? false;
    map.delete(code);
    return state;
  }

  getKeyDown(code: string): boolean {
    return this.getButtonState(this.keyDown, code);
  }

  getKey(code: string): boolean {
    return this.key.get(code) ?? false;
  }

  getKeyUp(code: string): boolean {
    return this.getButtonState(this.keyUp, code);
  }
}

