
import { ShaderSystem } from "../../../Rendering/ShaderSystem";

export class SimpleShaderSystem extends ShaderSystem {

  /*  global(engine: Engine, scene: Scene, shader: Shader) {
     const camera = engine.getActivedCamera();
     shader.setMat4(Uniforms.ViewProjection, camera.getViewProjectionMatrix().data);
   }
 
   local(_: Engine, transform: Transform, scene: Scene, shader: Shader) {
 
     const spriteRender = scene.components.getComponent<SpriteRender2D>(
       transform.gameEntity, ComponentType.SpriteRender);
     if (!spriteRender) return;
 
 
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
   } */
}