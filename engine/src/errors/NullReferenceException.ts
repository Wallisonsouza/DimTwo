export class NullReferenceException extends Error {
  constructor(msg: string = "") {
    super(msg);
    this.name = "[NullReferenceException]";
  }
}