import { System } from "@engine/core/base/System";
import { GeometryBuilder } from "@engine/core/geometry/GeometryBuilder";
import { TextFile } from "@engine/core/loaders/TextFileLoader";
import { EngineSystem } from "@engine/core/managers/EngineSystemManager";
import { Vec2 } from "@engine/core/math/Vec2";
import { EngineWindow } from "@engine/core/window/EngineWindow";
import { Engine } from "@engine/Engine";
import { CollisionSystem2D } from "@engine/modules/2D/CollisionSystem2D";
import { PhysicsSystem } from "@engine/modules/2D/Physics2DSystem";
import type { RigidBody2D } from "@engine/modules/2D/RigidBody2D";
import { ComponentGroup } from "@engine/modules/enums/ComponentGroup";
import { AsteroidShaderSystem } from "@engine/modules/resources/material/AsteroidShaderSystem";
import { SimpleShaderSystem } from "@engine/modules/resources/material/SimpleShaderSystem";
import { AnimatorSystem } from "@engine/modules/shared/animator/AnimatorSystem";
import { RenderSystem } from "@engine/modules/shared/render/RenderSystem";
import { Material } from "@engine/Rendering/Material";
import { ContextLink, Shader } from "@engine/Rendering/Shader";
import { CameraSystem } from "./systems/CameraSystem";
import { CharacterControlerSystem } from "./systems/CharacterControlerSystem";
import { CharacterControllerAnimationSystem } from "./systems/CharacterControllerAnimationSystem";





export class OrbSystem extends System {
  // posição e massa do planeta central
  planetPosition: Vec2 = new Vec2(0, 0);
  planetMass: number = 200;
  G: number = 5; // constante gravitacional ajustável

  fixedUpdate(): void {
    const rigidbodies = this.engine.components.getAllByGroup<RigidBody2D>(ComponentGroup.RigidBody2D);

    for (const rigid of rigidbodies) {
      if (!rigid.enabled || rigid.isSleeping) continue;

      // vetor do asteroide para o planeta
      const dir = Vec2.sub(this.planetPosition, rigid.transform.position.toVec2(), new Vec2());

      // distância ao quadrado (evita divisão por zero)
      const distSqr = Math.max(dir.lengthSq(), 0.01);

      // força gravitacional
      const forceMag = this.G * rigid.mass * this.planetMass / distSqr;

      // normaliza direção
      dir.normalizeInPlace();

      // aplica força no asteroide
      rigid.forces.addInPlace(Vec2.scale(dir, forceMag));

      // se quiser órbita circular, inicialize a velocidade perpendicular (uma vez)
      if (rigid.linearVelocity.lengthSq() < 0.01) {
        const speed = Math.sqrt(this.G * this.planetMass / Math.sqrt(distSqr));
        rigid.linearVelocity.set(-dir.y, dir.x).normalizeInPlace().scaleInPlace(speed);
      }
    }
  }
}












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
    this.enableSystem(EngineSystem.teste, new OrbSystem());

  }






















  async loadGameResources() {
    ContextLink.setContext(this.engineWindow.context);


    GeometryBuilder.createCicle("wireCircle", { radius: 0.5, divisions: 64 });
    GeometryBuilder.createQuad("fillQuad", { size: new Vec2(1, 1), wired: false });
    GeometryBuilder.createQuad("wireQuad", { size: new Vec2(1, 1), wired: true });


    // asteroid shader e material
    const planetShaderSystem = new AsteroidShaderSystem("planetShaderSystem");

    const planetVert = await TextFile.load("../engine/src/assets/shaders/planetShader.vert");
    const planetFrag = await TextFile.load("../engine/src/assets/shaders/planetShader.frag");

    const planetShader = new Shader({
      name: "planet",
      vert: planetVert,
      frag: planetFrag,
      system: planetShaderSystem
    });

    new Material({ name: "planet", shader: planetShader, transparent: false });


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

    new Material({ name: "asteroid", shader: asteroidShader, transparent: false });

  }
}