import { GameEntity } from "@engine/core/base/GameEntity";
import { EngineSystem } from "@engine/core/managers/EngineSystemManager";
import { EngineWindow } from "@engine/core/window/EngineWindow";
import { Engine } from "@engine/Engine";
import { Collider2DSystem } from "@engine/modules/2D/Collider2DSystem";
import { PerspectiveCamera } from "@engine/modules/3D/PerspesctiveCamera";
import { PhysicsSystem } from "@engine/modules/shared/physics/PhysicsSystem";
import { RenderSystem } from "@engine/modules/shared/render/RenderSystem";
import { EditorFreeCameraSystem } from "./EditorFreeCameraSystem";
import { EditorGizmosSystem } from "./EditorGizmosSystem";
import { EditorTransformSystem } from "./EditorTransformSystem";

export class EditorEngine extends Engine {
  constructor() {

    const editorWindow = new EngineWindow();

    super(editorWindow);

    const editorCamera = new GameEntity({
      name: "editor_camera",
      tag: "EditorCamera",
    });

    editorCamera.transform.position.z = 10;
    const cameraComponent = new PerspectiveCamera({
      entity: editorCamera

    });

    this.forceActiveCamera = cameraComponent;

    this.enableSystem(
      EngineSystem.RenderSystem,
      new RenderSystem()
    );

    this.enableSystem(
      EngineSystem.EditorGizmosSystem,
      new EditorGizmosSystem()
    );

    this.enableSystem(
      EngineSystem.EditorTransformSystem,
      new EditorTransformSystem()
    );

    this.enableSystem(
      EngineSystem.EditorFreeCameraSystem,
      new EditorFreeCameraSystem()
    );

    this.enableSystem(
      EngineSystem.PhysicsSystem,
      new PhysicsSystem()
    );

    this.enableSystem(
      EngineSystem.ColliderSystem,
      new Collider2DSystem()
    );


  }
}