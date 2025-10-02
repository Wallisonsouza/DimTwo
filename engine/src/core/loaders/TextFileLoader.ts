import type { AsyncResource } from "./AsyncResource";

export class TextFileLoader implements AsyncResource<string> {
  constructor(private path: string) { }

  async load(): Promise<string> {
    const response = await fetch(this.path);
    return await response.text();
  }
}



export class TextFile {
  static async load(path: string): Promise<string> {
    const response = await fetch(path);
    return await response.text();
  }
}
