import { TwodEngineException } from "./TwodEngineException";

export class CameraNotFoundException extends TwodEngineException {
  constructor(message: string) {
    super(message);
    this.name = "[CameraNotFoundException]";
    Object.setPrototypeOf(this, CameraNotFoundException.prototype);
  }
}