import type { GameEntity } from "@engine//core/base/GameEntity";
import type { Scene } from "@engine//core/scene/scene";
import { PerspesctiveCamera } from "@engine/modules/components/render/PerspesctiveCamera";

export function configureCamera(scene: Scene, entity: GameEntity) {
  const camera = new PerspesctiveCamera();
  scene.addComponent(entity, camera);
  camera.transform.position.z = 5;
}