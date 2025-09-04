import type { GameEntity } from "@engine//core/base/GameEntity";
import type { Scene } from "@engine//core/scene/scene";
import { Vec2 } from "@engine/core/math/Vec2";
import { BoxCollider2D } from "@engine/modules/2D/BoxCollider2D";
import { RigidBody2D } from "@engine/modules/2D/RigidBody2D";
import { SpriteRender2D } from "@engine/modules/2D/SpriteRender2D";
import { Animator } from "@engine/modules/shared/animator/Animator";
import { CollisionLayer } from "@engine/modules/shared/physics/CollisionLayer";
import { PLAYER_ANIMATOR_CONTROLLER } from "../animations/player.animator.controller";
import { PLAYER_SPRITE } from "../sprites/PlayerSprite";
import { CharacterControler2D } from "../systems/character.controller.types";

export function configurePlayer(scene: Scene, entity: GameEntity) {
  const controller = new CharacterControler2D();

  const spriteRender = new SpriteRender2D({
    layer: 0,
    sprite: PLAYER_SPRITE,
    material: "advancedMaterial"
  });

  const animator = new Animator({
    controller: PLAYER_ANIMATOR_CONTROLLER
  });

  const rigidBody = new RigidBody2D({
    mass: 1,
    drag: 0,
    useGravity: true
  })

  const boxCollider = new BoxCollider2D({
    ignoreSelfCollisions: true,
    size: new Vec2(0.5, 0.5),
    collisionLayer: CollisionLayer.Player
  });

  scene.addComponent(entity, controller);
  scene.addComponent(entity, rigidBody);
  scene.addComponent(entity, spriteRender);
  scene.addComponent(entity, animator);
  scene.addComponent(entity, boxCollider);
}
