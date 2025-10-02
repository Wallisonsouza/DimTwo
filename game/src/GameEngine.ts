import { GeometryBuilder } from "@engine/core/geometry/GeometryBuilder";
import { TextFile } from "@engine/core/loaders/TextFileLoader";
import { EngineSystem } from "@engine/core/managers/EngineSystemManager";
import { Vec2 } from "@engine/core/math/Vec2";
import { EngineWindow } from "@engine/core/window/EngineWindow";
import { Engine } from "@engine/Engine";
import { CollisionSystem2D } from "@engine/modules/2D/CollisionSystem2D";
import { PhysicsSystem } from "@engine/modules/2D/Physics2DSystem";
import { AsteroidShaderSystem } from "@engine/modules/resources/material/AsteroidShaderSystem";
import { SimpleShaderSystem } from "@engine/modules/resources/material/SimpleShaderSystem";
import { AnimatorSystem } from "@engine/modules/shared/animator/AnimatorSystem";
import { RenderSystem } from "@engine/modules/shared/render/RenderSystem";
import { Material } from "@engine/Rendering/Material";
import { ContextLink, Shader } from "@engine/Rendering/Shader";
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

  }


  async loadGameResources() {
    ContextLink.setContext(this.engineWindow.context);


    GeometryBuilder.createCicle("wireCircle", { radius: 0.5, divisions: 64 });
    GeometryBuilder.createQuad("fillQuad", { size: new Vec2(1, 1), wired: false });
    GeometryBuilder.createQuad("wireQuad", { size: new Vec2(1, 1), wired: true });


    // asteroid shader e material
    const asteroidShaderSystem = new AsteroidShaderSystem("asteroidShaderSystem");

    const asteroidVert = await TextFile.load("../engine/src/assets/shaders/asteroidShader.vert");
    const asteroidFrag = await TextFile.load("../engine/src/assets/shaders/asteroidShader.frag");

    const asteroidShader = new Shader({
      name: "asteroid",
      vert: asteroidVert,
      frag: asteroidFrag,
      system: asteroidShaderSystem
    });

    new Material({ name: "asteroid", shader: asteroidShader, transparent: true });

    // simple shader e material
    const simpleShaderSystem = new SimpleShaderSystem("simpleShaderSystem");

    const simpleVert = await TextFile.load("../engine/src/assets/shaders/simpleShader.vert");
    const simpleFrag = await TextFile.load("../engine/src/assets/shaders/simpleShader.frag");

    const simpleShader = new Shader({
      name: "simple",
      vert: simpleVert,
      frag: simpleFrag,
      system: simpleShaderSystem
    });

    new Material({ name: "simple", shader: simpleShader, transparent: false });

  }
}