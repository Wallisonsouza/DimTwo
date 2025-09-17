import { GameEntity } from "@engine/core/base/GameEntity";
import { Quat } from "@engine/core/math/quat";
import { Vec2 } from "@engine/core/math/Vec2";
import { Vec3 } from "@engine/core/math/Vec3";
import { Scene } from "@engine/core/scene/scene";
import { Sprite2D } from "@engine/modules/2D/Sprite2D";
import { configureCamera } from "@game/entities/CameraEntity";
import { configureGround } from "@game/entities/GroundEntity";
import { configurePlayer } from "@game/entities/PlayerEntity";

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

    const player = new GameEntity({ name: "Player", tag: "Player" });


    const camera = new GameEntity({ name: "Camera", tag: "MainCamera" });
    player.transform.rotation = Quat.fromEulerAngles(new Vec3(0, 0, -35))

    const ground = new GameEntity({ name: "Ground", tag: "Ground" });
    ground.transform.scale.x = 10;
    ground.transform.position.y = -3;
    /*     ground.transform.position.x = 5.1; */
    ground.transform.rotation = Quat.fromEulerAngles(new Vec3(0, 0,))


    /*  const quad = new GameEntity({ name: "Quad", tag: "Quad" });
     this.addEntity(quad);
     configureEntity(this, quad, quadSprite); */




    this.addEntity(camera);
    this.addEntity(player);

    this.addEntity(ground);

    configurePlayer(this, player);
    configureCamera(this, camera);

    configureGround(this, ground, quadSprite)
  }
}