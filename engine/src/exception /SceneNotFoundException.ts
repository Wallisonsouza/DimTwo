export class SceneNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "[SceneNotFoundException]";
    Object.setPrototypeOf(this, SceneNotFoundException.prototype);
  }
}
