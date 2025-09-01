import type { GameEntity } from "@engine/core/base/GameEntity";
import { System } from "@engine/core/base/System";

export class CameraSystem extends System {

    player: GameEntity | null = null;
    camera: GameEntity | null = null;
    cameraZ: number = 0;

    start(): void {
        const scene = this.getScene();

        this.player = scene.entities.getByTag("Player");
        this.camera = scene.entities.getByTag("MainCamera");
        this.cameraZ = this.camera?.transform.position.z || 0;
    }
    update(dt: number) {

        if (!this.camera || !this.player) return;

        this.camera.transform.position = this.player.transform.position;
        this.camera.transform.position.z = this.cameraZ;
    }
}
