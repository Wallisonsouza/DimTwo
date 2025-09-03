import type { GameEntity } from "@engine/core/base/GameEntity";
import { Color } from "@engine/core/math/Color";
import { Mat4 } from "@engine/core/math/Mat4";
import { Vec3 } from "@engine/core/math/Vec3";
import type { Scene } from "@engine/core/scene/scene";
import type { Engine } from "@engine/Engine";
import type { Collider2D } from "@engine/modules/2D/Collider2D";
import { ComponentType } from "@engine/modules/enums/ComponentType";
import { Uniforms } from "@engine/modules/enums/Uniforms";
import type { Shader } from "../../../Rendering/Shader";
import { ShaderSystem } from "../../../Rendering/ShaderSystem";

export class GizmosShaderSystem extends ShaderSystem {

  global(engine: Engine, scene: Scene, shader: Shader) {
    const camera = engine.getActivedCamera();
    shader.setMat4(Uniforms.ViewProjection, camera.getViewProjectionMatrix().data);
  }

  local(_: Engine, gameEntity: GameEntity, scene: Scene, shader: Shader) {

    const collider = scene.components.getComponent<Collider2D>(gameEntity, ComponentType.BoxCollider2D);
    if (!collider) return;

    const transform = gameEntity.transform;
    const modelMatrix = transform.getWorldMatrix();

    const scaleX = transform.scale.x * collider.size.x;
    const scaleY = transform.scale.y * collider.size.y;

    Mat4.compose(modelMatrix, transform.position, transform.rotation, new Vec3(scaleX, scaleY));
    shader.setMat4("uModel", modelMatrix.data);

    const color = collider.isColliding ? Color.Green : Color.Red;
    shader.set4F(
      "uColor",
      color.r,
      color.g,
      color.b,
      color.a,
    );
  }
}