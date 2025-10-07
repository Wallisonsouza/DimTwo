import { TwodEngineException } from "./TwodEngineException";

export class NullReferenceException extends TwodEngineException {
  constructor(msg: string) {
    super(msg);
    this.name = "[NullReferenceException]";
    Object.setPrototypeOf(this, NullReferenceException.prototype);
  }
}