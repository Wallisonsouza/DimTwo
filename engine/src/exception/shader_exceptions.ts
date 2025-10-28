import { TwodEngineException } from "./TwodEngineException";

export class UniformNotFoundException extends TwodEngineException {
  constructor(message: string) {
    super(message);
    this.name = "[UniformNotFoundException]";
    Object.setPrototypeOf(this, UniformNotFoundException.prototype);
  }
}
