import type { GameEntity } from "@engine//core/base/GameEntity";
import type { Scene } from "@engine//core/scene/scene";
import { PerspectiveCamera } from "@engine/modules/3D/PerspesctiveCamera";

export function configureCamera(scene: Scene, entity: GameEntity) {
  const camera = new PerspectiveCamera();
  scene.addComponent(entity, camera);

}