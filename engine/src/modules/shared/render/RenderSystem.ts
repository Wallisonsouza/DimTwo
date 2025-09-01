import type { Render } from "../../../core/base/Render";
import { System } from "../../../core/base/System";
import type { Scene } from "../../../core/scene/scene";
import type { Engine } from "../../../Engine";
import { ResourcesManager } from "../../../global/manager/manager";
import type { Material } from "../../../Rendering/Material";
import { ComponentGroup } from "../../enums/ComponentGroup";

export class RenderSystem extends System {

  private transparentsCache: Render[] = [];

  private renderObjects(
    context: WebGL2RenderingContext,
    engine: Engine,
    scene: Scene,
    renders: Render[],
    opaque: boolean
  ) {


    for (const render of renders) {
      if (!render.enabled) continue;

      const material = ResourcesManager.MaterialManager.get(render.material) as Material;
      if (!material || !material.shaderName) continue;

      if (opaque && (render.color.a < 1 || material.transparent)) {
        this.transparentsCache.push(render);
        continue;
      }

      const shader = engine.shaders.get(material.shaderName);
      if (!shader || !shader.systemName) continue;

      context.useProgram(shader.program);

      const shaderSystem = ResourcesManager.ShaderSystemManager.get(shader.systemName);
      if (!shaderSystem) continue;

      shaderSystem.global?.(engine, scene, shader);
      shaderSystem.local?.(engine, render.gameEntity, scene, shader);

      if (!render.meshName) continue;
      const mesh = ResourcesManager.MeshManager.get(render.meshName);
      if (!mesh) continue;

      const vao = engine.meshBuffers.get(mesh.name);
      if (!vao) continue;

      context.bindVertexArray(vao.vao);
      context.drawElements(context.TRIANGLES, vao.indexCount, context.UNSIGNED_SHORT, 0);
      context.bindVertexArray(null);


    }


  }

  render() {
    const engine = this.getEngine();
    const scene = this.getScene();
    const context = engine.getContext();

    const renders = scene.components.getAllByGroup<Render>(ComponentGroup.Render);

    context.depthMask(true);
    context.enable(context.DEPTH_TEST);
    context.disable(context.BLEND);


    this.renderObjects(context, engine, scene, renders, true);

    if (this.transparentsCache.length > 0) {
      this.transparentsCache.sort((a, b) => a.layer - b.layer);

      context.enable(context.BLEND);
      context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);
      context.depthMask(false);
      context.disable(context.DEPTH_TEST);

      this.renderObjects(context, engine, scene, this.transparentsCache, false);

      context.depthMask(true);
      this.transparentsCache.length = 0;
    }


  }
}
