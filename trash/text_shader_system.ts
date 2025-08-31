/* import { ComponentTypes } from "../../../components/component-type";
import { Transform } from "../../../components/spatial/transform/Transform";
import { get_category, get_textRender } from "../../../generators/get_component";
import { EasyGetter } from "../../managers/EasyGetters";
import { Global } from "../../managers/engine.manager";
import { generic_manager_get } from "../../managers/generic_manager";
import { Mat4 } from "../../math/mat4/Mat4";
import { shader_set_uniform_4f, shader_set_uniform_mat4, shader_set_uniform_texture } from "../shader/shader_uniforms";
import type { ShaderSystem } from "../shader/ShaderSystem";
import type { MaterialType } from "./types";

export function textShaderSystem(material: MaterialType): ShaderSystem {
    const shader = generic_manager_get(ResourcesManager.ShaderManager, material.shaderName);
    if (!shader) throw new Error(`Shader ${material.shaderName} not found in SHADER_MANAGER.`);

    return {
        global() {
            const cameras = get_category(ComponentTypes.Camera);
            if (cameras.length === 0) return;
            const camera = cameras[0];

            const transform = Transform.getTransform(camera.getGameEntity());
            if (transform == null) return;

            const viewMatrix = EasyGetter.getMat4(transform.instanceID.getValue())!;
            Mat4.createTR(viewMatrix, transform.position, transform.rotation);
            shader_set_uniform_mat4(shader, "uView", viewMatrix.data);

            const projectionMatrix =  EasyGetter.getMat4(camera.instanceID.getValue())!;
            shader_set_uniform_mat4(shader, "uProjection", projectionMatrix.data);
        },

        local(gameEntity) {

            const transform = Transform.getTransform(gameEntity);
            if (!transform) return;

            const modelMatrix = EasyGetter.getMat4(transform.instanceID.getValue())!;

            Mat4.compose(
                modelMatrix,
                transform.position,
                transform.rotation,
                transform.scale,

            );

            shader_set_uniform_mat4(shader, "uModel", modelMatrix.data);

            const textRender = get_textRender(gameEntity);
            if(textRender == null) return;
            shader_set_uniform_4f(shader, "uColor", textRender.color.r, textRender.color.g, textRender.color.b, textRender.color.a);

            const texture = generic_manager_get(ResourcesManager.TextureManager, textRender.font);
            if(!texture) return;
           
            shader_set_uniform_texture(shader, "uTexture", texture, 0);
        },

    };
}
 */