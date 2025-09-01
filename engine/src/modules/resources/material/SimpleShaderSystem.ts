
import type { GameEntity } from "@engine/core/base/GameEntity";
import { Uniforms } from "@engine/modules/enums/Uniforms";
import { Mat4 } from "../../../core/math/Mat4";
import type { Scene } from "../../../core/scene/scene";
import type { Engine } from "../../../Engine";
import type { Shader } from "../../../Rendering/Shader";
import { ShaderSystem } from "../../../Rendering/ShaderSystem";
import type { SpriteRender2D } from "../../2D/SpriteRender2D";
import { ComponentType } from "../../enums/ComponentType";

export class SimpleShaderSystem extends ShaderSystem {

    global(engine: Engine, scene: Scene, shader: Shader) {
        const camera = scene.getActiveCamera();
        shader.setMat4(Uniforms.ViewProjection, camera.getViewProjectionMatrix().data);
    }

    local(_: Engine, gameEntity: GameEntity, scene: Scene, shader: Shader) {
     
        const spriteRender = scene.components.getComponent<SpriteRender2D>(gameEntity.id.getValue(), ComponentType.SpriteRender);
        if (!spriteRender) return;

        const transform = gameEntity.transform;
        const modelMatrix = transform.getWorldMatrix();

        Mat4.compose(modelMatrix, transform.position, transform.rotation, transform.scale);
        shader.setMat4("uModel", modelMatrix.data);

        shader.set4F(
            "uColor",
            spriteRender.color.r,
            spriteRender.color.g,
            spriteRender.color.b,
            spriteRender.color.a,
        );
    }
}