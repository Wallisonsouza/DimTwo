import type { GameEntity } from "../../../core/base/GameEntity";
import type { Material } from "../../../Rendering/Material";
import { ShaderSystem } from "../../../Rendering/ShaderSystem";
import { Uniform } from "../../enums/Uniforms";

export class SimpleShaderSystem extends ShaderSystem {

  local(gameEntity: GameEntity, material: Material) {

    if (!material.shader) return;

    const modelMatrix = gameEntity.transform.getWorldMatrix();

    material.shader.setMat4(Uniform.ModelMatrix, modelMatrix.data);

    const color = material.color;
    material.shader.set4F(
      Uniform.Color,
      color.r,
      color.g,
      color.b,
      color.a,
    );
  }
}