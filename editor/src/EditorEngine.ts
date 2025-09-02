import { GameEntity } from "@engine/core/base/GameEntity";
import { EngineSystem } from "@engine/core/managers/EngineSystemManager";
import { EngineWindow } from "@engine/core/window/EngineWindow";
import { Engine } from "@engine/Engine";
import { PerspectiveCamera } from "@engine/modules/3D/PerspesctiveCamera";

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

    this.forcedCamera = cameraComponent;

    this.enableSystem(EngineSystem.RenderSystem);
    this.enableSystem(EngineSystem.EditorGizmosSystem);
    this.enableSystem(EngineSystem.EditorTransformSystem);
    this.enableSystem(EngineSystem.EditorFreeCameraSystem);

  }
}