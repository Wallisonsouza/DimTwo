import type { GameEntity } from "@engine/core/base/GameEntity";
import { Color } from "@engine/core/math/Color";
import { Mat4 } from "@engine/core/math/Mat4";
import type { Scene } from "@engine/core/scene/scene";
import type { Engine } from "@engine/Engine";
import type { Collider2D } from "@engine/modules/components/physics/collider/Collider2D";
import { ComponentType } from "@engine/modules/enums/ComponentType";
import { Uniforms } from "@engine/modules/enums/Uniforms";
import type { Shader } from "../shader/Shader";
import { ShaderSystem } from "../shader/ShaderSystem";

export class GizmosShaderSystem extends ShaderSystem {

    global(engine: Engine, scene: Scene, shader: Shader) {
        const camera = scene.getActiveCamera();
        shader.setMat4(Uniforms.ViewProjection, camera.getViewProjectionMatrix().data);
    }

    local(_: Engine, gameEntity: GameEntity, scene: Scene, shader: Shader) {

        const collider = scene.components.getComponent<Collider2D>(gameEntity.id.getValue(), ComponentType.BoxCollider2D);
        if (!collider) return;

        const transform = gameEntity.transform;
        const modelMatrix = transform.getWorldMatrix();

        Mat4.compose(modelMatrix, transform.position, transform.rotation, transform.scale);
        shader.setMat4("uModel", modelMatrix.data);

        const color = collider.isColliding ? Color.green : Color.red;


       /*  const camera = scene.getActiveCamera();
        const ray = camera.screenPointToRay(Input.mouse.getMousePosition());
        collider.bounds. */
       


        shader.set4F(
            "uColor",
            color.r,
            color.g,
            color.b,
            color.a,
        );
    }
}