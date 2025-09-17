import { EngineSystem } from "@engine/core/managers/EngineSystemManager";
import { EngineWindow } from "@engine/core/window/EngineWindow";
import { Engine } from "@engine/Engine";
import { CollisionCorrector2D } from "@engine/modules/2D/CollisionCorrectorSystem2D";
import { CollisionSystem2D } from "@engine/modules/2D/CollisionSystem2D";
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

    // loop de update
    this.enableSystem(EngineSystem.CameraSystem, new CameraSystem());
    this.enableSystem(EngineSystem.AnimatorSystem, new AnimatorSystem());
    this.enableSystem(EngineSystem.CharacterControlerAnimationSystem, new CharacterControllerAnimationSystem());
    this.enableSystem(EngineSystem.RenderSystem, new RenderSystem());
    this.enableSystem(EngineSystem.CharacterControlerSystem, new CharacterControlerSystem());
    this.enableSystem(EngineSystem.PhysicsSystem, new PhysicsSystem());
    this.enableSystem(EngineSystem.ColliderSystem, new CollisionSystem2D());
    this.enableSystem(999, new CollisionCorrector2D());
  }
}



