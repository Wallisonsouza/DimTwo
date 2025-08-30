import type { GameEntity } from "@engine/core/base/GameEntity";
import { System } from "@engine/core/base/System";

export class CameraSystem extends System {

    private target: GameEntity | null = null;
    private camera: GameEntity | null = null;

    start() {
        const scene = this.getScene();
        this.camera = scene.entities.getByTag("MainCamera");
        this.target = scene.entities.getByTag("Player");
    }

    update(dt: number) {
        if (!this.target || !this.camera) return;
        const target = this.target.transform.position.clone();
        target.z = this.camera.transform.position.z;
        this.camera.transform.position = target;

    }
}