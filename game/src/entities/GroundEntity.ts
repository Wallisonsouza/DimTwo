import { GameEntity } from "@engine/core/base/GameEntity";
import type { Scene } from "@engine/core/scene/scene";
import { BoxCollider2D } from "@engine/modules/2D/BoxCollider2D";
import { BodyType, RigidBody2D } from "@engine/modules/2D/RigidBody2D";
import type { Sprite2D } from "@engine/modules/2D/Sprite2D";
import { SpriteRender2D } from "@engine/modules/2D/SpriteRender2D";

export function configureGround(
  scene: Scene,
  entity: GameEntity,
  sprite: Sprite2D
) {
  const spriteRender = new SpriteRender2D({
    material: "advancedMaterial",
    sprite: sprite
  });

  const rigd = new RigidBody2D({
    useGravity: false,
    bodyType: BodyType.Static
  })

  const boxCollider = new BoxCollider2D({

    /*   physicsMaterial: new PhysicsMaterial({
        restitution: 0.1,
        dynamicFriction: 1000,
        staticFriction: 1000
      }), */
    ignoreSelfCollisions: true,

  });

  scene.addComponent(entity, spriteRender);
  scene.addComponent(entity, boxCollider);
  scene.addComponent(entity, rigd);
}


export function configureEntity(
  scene: Scene,
  entity: GameEntity,
  sprite: Sprite2D
) {
  const spriteRender = new SpriteRender2D({
    material: "advancedMaterial",
    sprite: sprite
  });

  const rigd = new RigidBody2D({
    useGravity: false
  })

  const boxCollider = new BoxCollider2D({
    ignoreSelfCollisions: true,

  });

  scene.addComponent(entity, spriteRender);
  scene.addComponent(entity, boxCollider);
  scene.addComponent(entity, rigd);
}
