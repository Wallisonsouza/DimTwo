/* import type { Scene } from "@engine/core/scene/scene";
import type { Engine } from "@engine/Engine";
import type { Transform } from "@engine/modules/3D/Transform";
import { Uniform } from "@engine/modules/enums/Uniforms";
import { Gizmos } from "editor/src/EditorGizmosSystem";
import type { Shader } from "../../../Rendering/Shader";
import { ShaderSystem } from "../../../Rendering/ShaderSystem";

export class GizmosShaderSystem extends ShaderSystem {

  local(_: Engine, transform: Transform, scene: Scene, shader: Shader) {
    const modelMatrix = transform.getWorldMatrix();

    shader.setMat4(Uniform.ModelMatrix, modelMatrix.data);

    const color = Gizmos.color;
    shader.set4F(
      "uColor",
      color.r,
      color.g,
      color.b,
      color.a,
    );
  }
} */