import type { GameEntity } from "@engine//core/base/GameEntity";
import type { Scene } from "@engine//core/scene/scene";
import { Camera } from "@engine//modules/components/render/Camera";

export function configureCamera(scene: Scene, entity: GameEntity) {
  const camera: Camera = new Camera();
  scene.addComponent(entity, camera);
  camera.transform.position.z = 10;
}