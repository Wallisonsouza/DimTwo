import { Gizmos } from "@editor/EditorGizmosSystem";
import type { Scene } from "@engine/core/scene/scene";
import type { Engine } from "@engine/Engine";
import type { Transform } from "@engine/modules/3D/Transform";
import { Uniforms } from "@engine/modules/enums/Uniforms";
import type { Shader } from "../../../Rendering/Shader";
import { ShaderSystem } from "../../../Rendering/ShaderSystem";

export class GizmosShaderSystem extends ShaderSystem {

  global(engine: Engine, scene: Scene, shader: Shader) {
    const camera = engine.getActivedCamera();
    shader.setMat4(Uniforms.ViewProjection, camera.getViewProjectionMatrix().data);
  }

  local(_: Engine, transform: Transform, scene: Scene, shader: Shader) {
    const modelMatrix = transform.getWorldMatrix();

    shader.setMat4("uModel", modelMatrix.data);

    const color = Gizmos.color;
    shader.set4F(
      "uColor",
      color.r,
      color.g,
      color.b,
      color.a,
    );
  }
}