import { GameEntity } from "@engine/core/base/GameEntity";
import { Vec2 } from "@engine/core/math/Vec2";
import { Vec3 } from "@engine/core/math/Vec3";
import { Scene } from "@engine/core/scene/scene";
import { BoxCollider2D } from "@engine/modules/2D/BoxCollider2D";
import { RigidBody2D } from "@engine/modules/2D/RigidBody2D";
import { Sprite2D } from "@engine/modules/2D/Sprite2D";
import { SpriteRender2D } from "@engine/modules/2D/SpriteRender2D";

export class SimpleScene extends Scene {
  constructor() {
    super("SimpleScene");

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

    create(this, "Quad Example", quadSprite, new Vec3(0, 0, 0), true);
    create(this, "Triangle Example", triangleSprite, new Vec3(1.5, 0, 0), true);
    create(this, "Circle Example", circleSprite, new Vec3(3, 0, 0));

    const ground = create(this, "Ground Example", quadSprite, new Vec3(0, 0, 0));
    ground.transform.scale = new Vec3(10, 1, 0);
    ground.transform.position = new Vec3(0, -5);

  }
}


function create(scene: Scene, name: string, sprite: Sprite2D, position: Vec3, gravity: boolean = false) {

  const entity = new GameEntity({ name: name });
  entity.transform.position = position;

  const spriteRender = new SpriteRender2D({
    material: "advancedMaterial",
    sprite: sprite
  });

  const rigd = new RigidBody2D({
    useGravity: gravity
  })


  const boxCollider = new BoxCollider2D({
    ignoreSelfCollisions: true,

  });

  scene.addComponent(entity, spriteRender);
  scene.addComponent(entity, boxCollider);
  scene.addComponent(entity, rigd);

  return entity;
}