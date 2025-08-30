import type { GameEntity } from "@engine/core/base/GameEntity";
import { Uniforms } from "@engine/modules/enums/Uniforms";
import { Mat4 } from "../../../core/math/Mat4";
import { Vec3 } from "../../../core/math/Vec3";
import type { Scene } from "../../../core/scene/scene";
import type { Engine } from "../../../Engine";
import type { SpriteRender } from "../../components/render/SpriteRender";
import { ComponentType } from "../../enums/ComponentType";
import type { Shader } from "../shader/Shader";
import { ShaderSystem } from "../shader/ShaderSystem";

export class AdvancedShaderSystem extends ShaderSystem {
    private flip: Vec3 = new Vec3(0, 0, 0);

    global(engine: Engine, scene: Scene, shader: Shader) {
        const camera = scene.getActiveCamera();
        camera.aspect = engine.display.getAspectRatio();

        shader.setMat4(Uniforms.View, camera.getViewMatrix().data);
        shader.setMat4(Uniforms.Projection, camera.getProjectionMatrix().data);
    }

    local(engine: Engine, gameEntity: GameEntity, scene: Scene, shader: Shader) {

        const spriteRender = scene.components.getComponent<SpriteRender>(gameEntity.id.getValue(), ComponentType.SpriteRender);
        if (!spriteRender) return;

        if (!spriteRender.sprite) return;

        const transform = gameEntity.transform;
        const modelMatrix = transform.getWorldMatrix();

        this.flip.x = spriteRender.flipHorizontal ? -transform.scale.x : transform.scale.x;
        this.flip.y = spriteRender.flipVertical ? -transform.scale.y : transform.scale.y;
        this.flip.z = transform.scale.z;

        Mat4.compose(
            modelMatrix,
            transform.position,
            transform.rotation,
            this.flip,

        );

        shader.setMat4(Uniforms.Model, modelMatrix.data);
        shader.set4F(Uniforms.Color, spriteRender.color.r, spriteRender.color.g, spriteRender.color.b, spriteRender.color.a);

        const texture = engine.textureBuffers.get(spriteRender.sprite.textureID ?? "")!;
        shader.setTexture(Uniforms.Texture, texture, 0);

        const uvScaleX = spriteRender.sprite.size.x / texture.width;
        const uvScaleY = spriteRender.sprite.size.y / texture.height;
        shader.set2F("uUVScale", uvScaleX, uvScaleY);

        const uvOffsetX = spriteRender.sprite.position.x / texture.width;
        const uvOffsetY = (texture.height - spriteRender.sprite.position.y - spriteRender.sprite.size.y) / texture.height;
        shader.set2F("uUVOffset", uvOffsetX, uvOffsetY);
    }
}
