import type { AsyncResource } from "./AsyncResource";


export class ImageFileLoader implements AsyncResource<HTMLImageElement> {
    constructor(private path: string) { }

    async load(): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = this.path;
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image at ${this.path}`));
        });
    }
}