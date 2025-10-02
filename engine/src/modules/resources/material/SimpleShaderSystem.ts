import type { Scene } from "@engine/core/scene/scene";
import type { Engine } from "@engine/Engine";
import type { Transform } from "@engine/modules/3D/Transform";
import { Uniform } from "@engine/modules/enums/Uniforms";
import type { Material } from "@engine/Rendering/Material";
import type { Shader } from "@engine/Rendering/Shader";
import { ShaderSystem } from "../../../Rendering/ShaderSystem";

export class SimpleShaderSystem extends ShaderSystem {

  local(_: Engine, transform: Transform, scene: Scene, shader: Shader, material: Material) {
    const modelMatrix = transform.getWorldMatrix();
    shader.setMat4(Uniform.ModelMatrix, modelMatrix.data);

    const color = material.color;
    shader.set4F(
      Uniform.Color,
      color.r,
      color.g,
      color.b,
      color.a,
    );
  }
}