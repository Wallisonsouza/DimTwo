import { GameEntity } from "@engine/core/base/GameEntity";
import { SceneManager } from "@engine/core/managers/SceneManager";
import { Scene } from "@engine/core/scene/scene";
import { configureCamera } from "./entities/CameraEntity";
import { configurePlayer } from "./entities/PlayerEntity";
import { configureSlime } from "./entities/SlimeEntity";

export class SimpleScene extends Scene {

    constructor() {
        super("SimpleScene");

        const playerEntity = new GameEntity({ name: "player", tag: "Player" });
        this.addEntity(playerEntity);
        configurePlayer(this, playerEntity);

        const slimeEntity = new GameEntity({ name: "slime", tag: "Enemy" });
        this.addEntity(slimeEntity);
        configureSlime(this, slimeEntity);

        const cameraEntity = new GameEntity({ name: "camera", tag: "MainCamera" });
        this.addEntity(cameraEntity);
        configureCamera(this, cameraEntity);

        SceneManager.addScene(this);
    }
}