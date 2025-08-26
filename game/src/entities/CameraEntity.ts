import type { GameEntity } from "@engine//core/base/GameEntity";
import type { Scene } from "@engine//core/scene/scene";
import { Camera } from "@engine//modules/components/render/Camera";
import { Transform } from "@engine//modules/components/spatial/Transform";

export function configureCamera(scene: Scene, entity: GameEntity){
  const camera: Camera = new Camera();
  const transform: Transform = new Transform();
  transform.position.z = 10;

  scene.addComponent(entity, camera);
  scene.addComponent(entity, transform);
}