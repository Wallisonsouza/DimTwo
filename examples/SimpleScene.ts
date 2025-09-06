import { GameEntity } from "@engine/core/base/GameEntity";
import { Quat } from "@engine/core/math/quat";
import { Vec2 } from "@engine/core/math/Vec2";
import { Vec3 } from "@engine/core/math/Vec3";
import { Scene } from "@engine/core/scene/scene";
import { Sprite2D } from "@engine/modules/2D/Sprite2D";
import { configureCamera } from "@game/entities/CameraEntity";
import { configureEntity } from "@game/entities/GroundEntity";
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
    player.transform.position.x = -2;
    const camera = new GameEntity({ name: "Camera", tag: "MainCamera" });


    const quad = new GameEntity({ name: "Quad", tag: "Quad" });
    quad.transform.rotation = Quat.fromEulerAngles(new Vec3(0, 0, 45))
    quad.transform.position.x = 2;


    this.addEntity(camera);
    this.addEntity(player);
    this.addEntity(quad);

    configurePlayer(this, player);
    configureCamera(this, camera);
    configureEntity(this, quad, quadSprite);
  }
}