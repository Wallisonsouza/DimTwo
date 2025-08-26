import type { IKeyboardInput } from "../../interfaces/IInput";

export class WebKeyboardInput implements IKeyboardInput {
  private key = new Map<string, boolean>();
  private keyDown = new Map<string, boolean>();
  private keyUp = new Map<string, boolean>();

  private onKeyDown = (e: KeyboardEvent) => this.handleKeyDown(e);
  private onKeyUp = (e: KeyboardEvent) => this.handleKeyUp(e);

  enable(target: HTMLElement) {

   target.tabIndex = 0;
    target.addEventListener('keydown', this.onKeyDown);
    target.addEventListener('keyup', this.onKeyUp);
  }

  disable(target: HTMLElement) {
    target.removeEventListener('keydown', this.onKeyDown);
    target.removeEventListener('keyup', this.onKeyUp);
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

  /** Limpa os estados de teclas de um frame */
  clear(): void {
    this.keyDown.clear();
    this.keyUp.clear();
  }

  /** Retorna true se a tecla foi pressionada neste frame */
  getKeyDown(code: string): boolean {
    return this.keyDown.get(code) ?? false;
  }

  /** Retorna true se a tecla está pressionada atualmente */
  getKey(code: string): boolean {
    return this.key.get(code) ?? false;
  }

  /** Retorna true se a tecla foi solta neste frame */
  getKeyUp(code: string): boolean {
    return this.keyUp.get(code) ?? false;
  }
}
