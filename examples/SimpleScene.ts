import { GameEntity } from "@engine/core/base/GameEntity";
import { Vec2 } from "@engine/core/math/Vec2";
import { Scene } from "@engine/core/scene/scene";
import { Sprite2D } from "@engine/modules/2D/Sprite2D";
import { configureCamera } from "@game/entities/CameraEntity";
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

    this.addEntity(camera);
    this.addEntity(player);

    configurePlayer(this, player);
    configureCamera(this, camera);

  }
}