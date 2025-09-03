import { EngineSystem } from "@engine/core/managers/EngineSystemManager";
import { EngineWindow } from "@engine/core/window/EngineWindow";
import { Engine } from "@engine/Engine";
import { Collider2DSystem } from "@engine/modules/2D/Collider2DSystem";
import { PhysicsSystem } from "@engine/modules/2D/Physics2DSystem";
import { AnimatorSystem } from "@engine/modules/shared/animator/AnimatorSystem";
import { RenderSystem } from "@engine/modules/shared/render/RenderSystem";
import { CameraSystem } from "./systems/CameraSystem";
import { CharacterControlerSystem } from "./systems/CharacterControlerSystem";
import { CharacterControllerAnimationSystem } from "./systems/CharacterControllerAnimationSystem";

export class GameEngine extends Engine {
  constructor() {

    const gameWindow = new EngineWindow();

    super(gameWindow);

    this.enableSystem(EngineSystem.RenderSystem, new RenderSystem());
    this.enableSystem(EngineSystem.AnimatorSystem, new AnimatorSystem());
    this.enableSystem(EngineSystem.CharacterControlerAnimationSystem, new CharacterControllerAnimationSystem());

    this.enableSystem(EngineSystem.PhysicsSystem, new PhysicsSystem());
    this.enableSystem(EngineSystem.CameraSystem, new CameraSystem());
    this.enableSystem(EngineSystem.CharacterControlerSystem, new CharacterControlerSystem());
    this.enableSystem(EngineSystem.CharacterControlerAnimationSystem, new CharacterControllerAnimationSystem());

    this.enableSystem(
      EngineSystem.ColliderSystem,
      new Collider2DSystem()
    );

  }
}



