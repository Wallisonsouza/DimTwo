import type { GameEntity } from "@engine//core/base/GameEntity";
import type { Scene } from "@engine//core/scene/scene";
import { BoxCollider2D } from "@engine/modules/2D/BoxCollider2D";
import { RigidBody2D } from "@engine/modules/2D/RigidBody2D";
import { SpriteRender } from "@engine/modules/2D/SpriteRender";
import { Animator } from "@engine/modules/shared/animator/Animator";
import { CollisionLayer } from "@engine/modules/shared/physics/CollisionLayer";
import { PLAYER_ANIMATOR_CONTROLLER } from "../animations/player.animator.controller";
import { PLAYER_SPRITE } from "../sprites/PlayerSprite";
import { CharacterControler2D } from "../systems/character.controller.types";


export function configurePlayer(scene: Scene, entity: GameEntity) {
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

  const boxCollider = new BoxCollider2D({
    ignoreSelfCollisions: true,
    collisionLayer: CollisionLayer.Player
  });

  scene.addComponent(entity, controller);
  scene.addComponent(entity, rigidBody);
  scene.addComponent(entity, spriteRender);
  scene.addComponent(entity, animator);
  scene.addComponent(entity, boxCollider);
}
