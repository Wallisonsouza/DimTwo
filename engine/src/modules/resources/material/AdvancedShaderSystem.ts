import { Uniform } from "@engine/modules/enums/Uniforms";
import { ShaderSystem } from "../../../Rendering/ShaderSystem";
import type { Material } from "@engine/Rendering/Material";
import type { GameEntity } from "@engine/core/base/GameEntity";

export class AdvancedShaderSystem extends ShaderSystem {

  local(gameEntity: GameEntity, material: Material) {

    // if (!material.shader) return;

    // const modelMatrix = gameEntity.transform.getWorldMatrix();

    // material.shader.setMat4(Uniform.ModelMatrix, modelMatrix.data);
    // material.shader.set4F(Uniform.Color, material.color.r, material.color.g, material.color.b, material.color.a);


    // if (!spriteRender.sprite || !spriteRender.sprite.textureID) return;
    // const texture = engine.textureBuffers.get(spriteRender.sprite.textureID);

    // if (!texture) return;

    // material.shader.setTexture(Uniform.Texture, texture, 0);

    // const uvScaleX = spriteRender.sprite.size.x / texture.width;
    // const uvScaleY = spriteRender.sprite.size.y / texture.height;
    // material.shader.set2F("uUVScale", uvScaleX, uvScaleY);

    // const uvOffsetX = spriteRender.sprite.position.x / texture.width;
    // const uvOffsetY = (texture.height - spriteRender.sprite.position.y - spriteRender.sprite.size.y) / texture.height;
    // material.shader.set2F("uUVOffset", uvOffsetX, uvOffsetY);
  }
}
