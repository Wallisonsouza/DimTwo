export class CameraNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "[CameraNotFoundException]";
    Object.setPrototypeOf(this, CameraNotFoundException.prototype);
  }
}
