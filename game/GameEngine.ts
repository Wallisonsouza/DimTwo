import { EngineSystem } from "@engine/core/managers/EngineSystemManager";
import { EngineWindow } from "@engine/core/window/EngineWindow";
import { Engine } from "@engine/Engine";

export class GameEngine extends Engine {
    constructor() {
        const gameWindow = new EngineWindow();

        super(gameWindow);

        this.enableSystem(EngineSystem.RenderSystem);
        this.enableSystem(EngineSystem.AnimatorSystem);
        this.enableSystem(EngineSystem.TerrainSystem);
        this.enableSystem(EngineSystem.CharacterControlerAnimationSystem);
        this.enableSystem(EngineSystem.CharacterControlerSystem);
        this.enableSystem(EngineSystem.ColliderSystem);
        this.enableSystem(EngineSystem.CameraSystem);
    }
}