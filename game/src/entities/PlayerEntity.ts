import type { GameEntity } from "@engine//core/base/GameEntity";
import type { Scene } from "@engine//core/scene/scene";
import { Animator } from "@engine//modules/components/animation/Animator";
import { BoxCollider2D } from "@engine//modules/components/physics/BoxCollider2D";
import { RigidBody2D } from "@engine//modules/components/physics/RigidBody2D";
import { SpriteRender } from "@engine//modules/components/render/SpriteRender";
import { Transform } from "@engine//modules/components/spatial/Transform";
import { PLAYER_ANIMATOR_CONTROLLER } from "../animations/player.animator.controller";
import { PLAYER_SPRITE } from "../sprites/PlayerSprite";
import { CharacterControler2D } from "../systems/character.controller.types";


export function configurePlayer(scene: Scene, entity: GameEntity) {
  const transform = new Transform();
  const controller = new CharacterControler2D();

  const rigidBody = new RigidBody2D({
    useGravity: false,
    mass: 70
  })

  const spriteRender = new SpriteRender({
    layer: 0,
    sprite: PLAYER_SPRITE,
    material: "advancedMaterial"
  });

  const animator = new Animator({
    controller: PLAYER_ANIMATOR_CONTROLLER
  });

  const boxCollider = new BoxCollider2D();

  scene.addComponent(entity, transform);
  scene.addComponent(entity, controller);
  scene.addComponent(entity, rigidBody);
  scene.addComponent(entity, spriteRender);
  scene.addComponent(entity, animator);
  scene.addComponent(entity, boxCollider);
}
