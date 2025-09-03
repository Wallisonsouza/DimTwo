import type { GameEntity } from "@engine/core/base/GameEntity";
import { System } from "@engine/core/base/System";

export class CameraSystem extends System {

  player: GameEntity | null = null;
  camera: GameEntity | null = null;
  cameraZ: number = 0;

  start(): void {
    this.player = this.engine.entities.getByTag("Player");
    this.camera = this.engine.entities.getByTag("MainCamera");
    this.cameraZ = this.camera?.transform.position.z || 0;
  }
  update() {
    if (!this.camera || !this.player) return;
    this.camera.transform.position = this.player.transform.position;
    this.camera.transform.position.z = this.cameraZ;
  }
}












