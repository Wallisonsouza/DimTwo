export class TwodEngineException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "[TwodEngineException]";
    Object.setPrototypeOf(this, TwodEngineException.prototype);
  }
}
