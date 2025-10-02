import type { Scene } from "@engine/core/scene/scene";
import { Time } from "@engine/core/time/Time";
import type { Engine } from "@engine/Engine";
import type { Transform } from "@engine/modules/3D/Transform";
import { Uniform } from "@engine/modules/enums/Uniforms";
import type { Shader } from "@engine/Rendering/Shader";
import { ShaderSystem } from "@engine/Rendering/ShaderSystem";

export class AsteroidShaderSystem extends ShaderSystem {

  local(_: Engine, transform: Transform, scene: Scene, shader: Shader) {
    const modelMatrix = transform.getWorldMatrix();
    shader.setMat4(Uniform.ModelMatrix, modelMatrix.data);
    shader.setFloat("ENGINE_TIME", Time.realtimeSinceStartup);

  }
}