/* import { Color } from "../../../../engine/src/core/math/Color";
import { Mat4 } from "../../../../engine/src/core/math/Mat4";
import { Scene } from "../../../../engine/src/core/scene/scene";
import { Engine } from "../../../../engine/src/Engine";
import { SpriteRender } from "../../../../engine/src/modules/components/render/SpriteRender";
import { Transform } from "../../../../engine/src/modules/components/spatial/Transform";
import { ComponentType } from "../../../../engine/src/modules/enums/ComponentType";
import { Shader } from "../../../../engine/src/modules/resources/shader/Shader";
import { ShaderSystem } from "../../../../engine/src/modules/resources/shader/ShaderSystem";

export class GizmosShaderSystem extends ShaderSystem {

    global(engine: Engine, scene: Scene, shader: Shader) {

        let camera = scene.getActiveCamera();

        let cameraTransform = scene.components.getComponent<Transform>(camera.getEntityID(), ComponentType.Transform);

        camera.aspect = engine.display.getAspectRatio();

        if (!cameraTransform) return;

        const viewMatrix = camera.viewMatrix;
        Mat4.createTR(viewMatrix, cameraTransform.position, cameraTransform.rotation);
        shader.shader_set_uniform_mat4("uView", viewMatrix.data);

        const projectionMatrix = camera.projection;
        Mat4.projection(projectionMatrix, camera.fov, camera.aspect, camera.near, camera.far)
        shader.shader_set_uniform_mat4("uProjection", projectionMatrix.data);
    }

    local(engine: Engine, entityID: number, scene: Scene, shader: Shader) {
        const transform = scene.components.getComponent<Transform>(entityID, ComponentType.Transform);
        if (!transform) return;

        const spriteRender = scene.components.getComponent<SpriteRender>(entityID, ComponentType.SpriteRender);
        if (!spriteRender) return;


        const modelMatrix = transform.modelMatrix;

        Mat4.compose(modelMatrix, transform.position, transform.rotation, transform.scale);
        shader.shader_set_uniform_mat4("uModel", modelMatrix.data);

        shader.shader_set_uniform_4f(
            "uColor",
            Color.green.r,
            Color.green.g,
            Color.green.b,
            Color.green.a,
        );
    }
} */