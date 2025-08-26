import { Mat4 } from "../../../core/math/Mat4";
import { Vec3 } from "../../../core/math/Vec3";
import type { Scene } from "../../../core/scene/scene";
import type { Engine } from "../../../Engine";
import type { SpriteRender } from "../../components/render/SpriteRender";
import { Transform } from "../../components/spatial/Transform";
import { ComponentType } from "../../enums/ComponentType";
import type { Shader } from "../shader/Shader";
import { ShaderSystem } from "../shader/ShaderSystem";

export class AdvancedShaderSystem extends ShaderSystem {
    private flip: Vec3 = new Vec3(0, 0, 0);

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

        if (!spriteRender.sprite) return;

        const modelMatrix = transform.modelMatrix;

        this.flip.x = spriteRender.flipHorizontal ? -transform.scale.x : transform.scale.x;
        this.flip.y = spriteRender.flipVertical ? -transform.scale.y : transform.scale.y;
        this.flip.z = transform.scale.z;

        Mat4.compose(
            modelMatrix,
            transform.position,
            transform.rotation,
            this.flip,

        );

        shader.shader_set_uniform_mat4("uModel", modelMatrix.data);
        shader.shader_set_uniform_4f("uColor", spriteRender.color.r, spriteRender.color.g, spriteRender.color.b, spriteRender.color.a);

        const texture = engine.textureBuffers.get(spriteRender.sprite.textureID)!;
        shader.shader_set_uniform_texture("uTexture", texture, 0);

        const uvScaleX = spriteRender.sprite.size.x / texture.width;
        const uvScaleY = spriteRender.sprite.size.y / texture.height;
        shader.shader_set_uniform_2f("uUVScale", uvScaleX, uvScaleY);

        const uvOffsetX = spriteRender.sprite.position.x / texture.width;
        const uvOffsetY = (texture.height - spriteRender.sprite.position.y - spriteRender.sprite.size.y) / texture.height;
        shader.shader_set_uniform_2f("uUVOffset", uvOffsetX, uvOffsetY); 
    }
}
