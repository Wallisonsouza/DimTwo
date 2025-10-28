import { GameEntity } from "@engine/core/base/GameEntity";
import { System } from "@engine/core/base/System";
import { Vec3 } from "@engine/core/math/Vec3";
import { Time } from "@engine/core/time/Time";

export class CameraSystem extends System {

  player: GameEntity | null = null;
  camera: GameEntity | null = null;
  cameraZ: number = 20;

  start(): void {
    
    this.player = GameEntity.getGameEntityByTag("Player");
    this.camera = GameEntity.getGameEntityByTag("MainCamera");

  }

  update() {
    if (!this.camera || !this.player) return;

    const target = this.player.transform.position.clone();
    target.z = this.cameraZ;

    this.camera.transform.position = Vec3.lerp(
      this.camera.transform.position,
      target,
      Time.deltaTime
    )
  }
}