import type { GameEntity } from "@engine/core/base/GameEntity";
import { Time } from "@engine/core/time/Time";
import { Uniform } from "@engine/modules/enums/Uniforms";
import type { Material } from "@engine/Rendering/Material";
import { ShaderSystem } from "@engine/Rendering/ShaderSystem";

export class AsteroidShaderSystem extends ShaderSystem {

  local(gameEntity: GameEntity, material: Material) {

    if (!material.shader) return;

    const modelMatrix = gameEntity.transform.getWorldMatrix();
    material.shader.setMat4(Uniform.ModelMatrix, modelMatrix.data);
    // material.shader.setFloat("ENGINE_TIME", Time.realtimeSinceStartup);
  }
}