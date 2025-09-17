import { TwodEngineException } from "./TwodEngineException";

export class SceneNotFoundException extends TwodEngineException {
  constructor(message: string) {
    super(message);
    this.name = "[SceneNotFoundException]";
    Object.setPrototypeOf(this, SceneNotFoundException.prototype);
  }
}
