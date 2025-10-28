import { Uniform } from "@engine/modules/enums/Uniforms";
import type { Camera } from "@engine/modules/shared/camera/Camera";
import type { Scene } from "../core/scene/scene";
import type { Engine } from "../Engine";
import type { Material } from "./Material";
import type { Shader } from "./Shader";
import type { GameEntity } from "@engine/core/base/GameEntity";

export class ShaderSystem {
  name: string;

  public global(engine: Engine, camera: Camera, scene: Scene, shader: Shader): void {

    const vp = camera.getViewProjectionMatrix();
    shader.setMat4(Uniform.ViewProjectionMatrix, vp.data);

  }

  local?(entity: GameEntity, material: Material): void;

  constructor(name: string) {
    this.name = name;
  }
}
