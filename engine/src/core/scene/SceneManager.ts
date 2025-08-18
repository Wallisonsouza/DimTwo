import type { Scene } from "./scene";

export abstract class SceneManager {
    private static scenes: Map<string, Scene> = new Map();

    public static addScene(scene: Scene): void {
        this.scenes.set(scene.name, scene);
    }

    public static getScene(name: string) {
        return this.scenes.get(name) ?? null;
    }
}
