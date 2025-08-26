import type { GameEntity } from "@engine//core/base/GameEntity";
import type { Scene } from "@engine//core/scene/scene";
import { Animator } from "@engine//modules/components/animation/Animator";
import { RigidBody2D } from "@engine//modules/components/physics/RigidBody2D";
import { SpriteRender } from "@engine//modules/components/render/SpriteRender";
import { Transform } from "@engine//modules/components/spatial/Transform";
import { BoxCollider2D } from "@engine/modules/components/physics/BoxCollider2D";
import { SLIME_ANIMATOR_CONTROLLER } from "../animations/controllers/slime.animator.controller";
import { SLIME_SPRITE } from "../sprites/slime.sprite";

export function configureSlime(scene: Scene, entity: GameEntity) {
  const transform: Transform = new Transform();
  transform.position.z = 0

  const spriteReder: SpriteRender = new SpriteRender({
    sprite: SLIME_SPRITE,
    layer: 0,
    material: "advancedMaterial"
  });

  const animator: Animator = new Animator({ controller: SLIME_ANIMATOR_CONTROLLER });

  const rigidBody: RigidBody2D = new RigidBody2D({ useGravity: false });
  const boxCollider = new BoxCollider2D();

  scene.addComponent(entity, transform);
  scene.addComponent(entity, spriteReder);
  scene.addComponent(entity, animator);
  scene.addComponent(entity, rigidBody);
  scene.addComponent(entity, boxCollider);
}