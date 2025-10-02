import type { GameEntity } from "@engine//core/base/GameEntity";
import type { Scene } from "@engine//core/scene/scene";
import { Vec2 } from "@engine/core/math/Vec2";
import { Sprite2D } from "@engine/modules/2D/Sprite2D";
import { SpriteRender2D } from "@engine/modules/2D/SpriteRender2D";
import { Material } from "@engine/Rendering/Material";
import { Mesh } from "@engine/Rendering/Mesh";
import { CharacterControler2D } from "../systems/character.controller.types";

const quadSprite = new Sprite2D({
  textureID: "primitives",
  position: new Vec2(512 + 8, 512),
  size: new Vec2(512, 512),
});

const triangleSprite = new Sprite2D({
  textureID: "primitives",
  position: new Vec2(0, 0),
  size: new Vec2(512, 512),
});

const circleSprite = new Sprite2D({
  textureID: "primitives",
  position: new Vec2(1024 + 16, 0),
  size: new Vec2(512, 512),
});


export function configurePlayer(scene: Scene, entity: GameEntity) {
  const controller = new CharacterControler2D();

  entity.transform.scale.setFromNumber(10, 10, 0)
  const spriteRender = new SpriteRender2D({
    mesh: Mesh.get("fillQuad"),
    layer: 0,
    sprite: quadSprite,
    material: Material.get("asteroid")
  });

  /*  const rigidBody = new RigidBody2D({
     useGravity: true,
     freezeRotation: false
   })
 
   const boxCollider = new BoxCollider2D({
     physicsMaterial: new PhysicsMaterial({
       dynamicFriction: 0.1
     })
 
 
   }); */

  /* scene.addComponent(entity, rigidBody);
   scene.addComponent(entity, boxCollider); */

  /*   const animator = new Animator({
      controller: PLAYER_ANIMATOR_CONTROLLER
    });
      scene.addComponent(entity, animator);
   */


  scene.addComponent(entity, controller);

  scene.addComponent(entity, spriteRender);

}
