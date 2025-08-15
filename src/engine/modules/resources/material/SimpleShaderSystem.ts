
import type { GameEntity } from "../../../core/base/GameEntity";
import { Mat4 } from "../../../core/math/Mat4";
import type { Scene } from "../../../core/scene/scene";
import type { Engine } from "../../../Engine";
import type { Camera } from "../../components/render/Camera";
import type { SpriteRender } from "../../components/render/SpriteRender";
import { Transform } from "../../components/spatial/Transform";
import { ComponentType } from "../../enums/ComponentType";
import type { Shader } from "../shader/Shader";
import { ShaderSystem } from "../shader/ShaderSystem";

export class SimpleShaderSystem extends ShaderSystem {

    global(engine: Engine, scene: Scene, shader: Shader, camera: Camera) {
        const cameraTransform = scene.components.getComponent<Transform>(camera.getGameEntity(), ComponentType.Transform);
        if (!cameraTransform) return;

        const viewMatrix = camera.viewMatrix;
        Mat4.createTR(viewMatrix, cameraTransform.position, cameraTransform.rotation);
        shader.shader_set_uniform_mat4("uView", viewMatrix.data);

        const projectionMatrix = camera.projection;
        Mat4.projection(projectionMatrix, camera.fov, camera.aspect, camera.near, camera.far)
        shader.shader_set_uniform_mat4("uProjection", projectionMatrix.data);
    }

    local(engine: Engine, entity: GameEntity, scene: Scene, shader: Shader) {
        const transform = scene.components.getComponent<Transform>(entity, ComponentType.Transform);
        if (!transform) return;

        const spriteRender = scene.components.getComponent<SpriteRender>(entity, ComponentType.SpriteRender);
        if (!spriteRender) return;


        const modelMatrix = transform.modelMatrix;

        Mat4.compose(modelMatrix, transform.position, transform.rotation, transform.scale);
        shader.shader_set_uniform_mat4("uModel", modelMatrix.data);

        shader.shader_set_uniform_4f(
            "uColor",
            spriteRender.color.r,
            spriteRender.color.g,
            spriteRender.color.b,
            spriteRender.color.a,
        );
    }
}