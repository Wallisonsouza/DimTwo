import type { Transform } from "@engine/modules/3D/Transform";

import { Uniform } from "@engine/modules/enums/Uniforms";
import type { Camera } from "@engine/modules/shared/camera/Camera";
import type { Scene } from "../core/scene/scene";
import type { Engine } from "../Engine";
import type { Material } from "./Material";
import type { Shader } from "./Shader";

export class ShaderSystem {
  name: string;

  public global(engine: Engine, camera: Camera, scene: Scene, shader: Shader): void {

    const vp = camera.getViewProjectionMatrix();
    shader.setMat4(Uniform.ViewProjectionMatrix, vp.data);

  }

  local?(_: Engine, transform: Transform, scene: Scene, shader: Shader, material: Material): void;

  constructor(name: string) {
    this.name = name;
  }
}
