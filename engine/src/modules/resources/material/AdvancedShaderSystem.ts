import type { Transform } from "@engine/modules/3D/Transform";
import { Uniforms } from "@engine/modules/enums/Uniforms";
import type { Scene } from "../../../core/scene/scene";
import type { Engine } from "../../../Engine";
import type { Shader } from "../../../Rendering/Shader";
import { ShaderSystem } from "../../../Rendering/ShaderSystem";
import type { SpriteRender2D } from "../../2D/SpriteRender2D";
import { ComponentType } from "../../enums/ComponentType";

export class AdvancedShaderSystem extends ShaderSystem {
  global(engine: Engine, scene: Scene, shader: Shader) {
    const camera = engine.getActivedCamera();
    shader.setMat4(Uniforms.ViewProjection, camera.getViewProjectionMatrix().data);
  }

  local(engine: Engine, transform: Transform, scene: Scene, shader: Shader) {

    const spriteRender = scene.components.getComponent<SpriteRender2D>(
      transform.gameEntity,
      ComponentType.SpriteRender
    );

    if (!spriteRender) return;


    const modelMatrix = transform.getWorldMatrix();

    shader.setMat4(Uniforms.Model, modelMatrix.data);
    shader.set4F(Uniforms.Color, spriteRender.color.r, spriteRender.color.g, spriteRender.color.b, spriteRender.color.a);


    if (!spriteRender.sprite || !spriteRender.sprite.textureID) return;
    const texture = engine.textureBuffers.get(spriteRender.sprite.textureID);

    if (!texture) return;

    shader.setTexture(Uniforms.Texture, texture, 0);

    const uvScaleX = spriteRender.sprite.size.x / texture.width;
    const uvScaleY = spriteRender.sprite.size.y / texture.height;
    shader.set2F("uUVScale", uvScaleX, uvScaleY);

    const uvOffsetX = spriteRender.sprite.position.x / texture.width;
    const uvOffsetY = (texture.height - spriteRender.sprite.position.y - spriteRender.sprite.size.y) / texture.height;
    shader.set2F("uUVOffset", uvOffsetX, uvOffsetY);
  }
}
