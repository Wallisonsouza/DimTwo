import { Display } from "@engine/core/display/Display";
import type { Render } from "../../../core/base/Render";
import { System } from "../../../core/base/System";
import type { Scene } from "../../../core/scene/scene";
import type { Engine } from "../../../Engine";
import { ResourcesManager } from "../../../global/manager/manager";
import { ComponentGroup } from "../../enums/ComponentGroup";
import type { Material } from "../../resources/material/Material";

export class RenderSystem extends System {

  private transparentsCache: Render[] = [];
  private drawCallCount: number = 0;

  private renderObjects(
    context: WebGL2RenderingContext,
    engine: Engine,
    scene: Scene,
    renders: Render[],
    opaque: boolean
  ): number { // retorna draw calls
    let drawCalls = 0;

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

      drawCalls++;
    }

    return drawCalls;
  }

  render() {
    const engine = this.getEngine();
    const scene = this.getScene();
    const context = engine.getContext();

    const renders = scene.components.getAllByGroup<Render>(ComponentGroup.Render);

    context.depthMask(true);
    context.enable(context.DEPTH_TEST);
    context.disable(context.BLEND);

    const startOpaque = performance.now();
    const opaqueDrawCalls = this.renderObjects(context, engine, scene, renders, true);
    const endOpaque = performance.now();

    const display = Display.getFocused();
    if (display) {
      display.console.log( "---------------- Render ----------------", "");
      display.console.log("RenderStats0", `Total: ${renders.length}`);
      display.console.log("RenderStats1", `Opaques: ${renders.length - this.transparentsCache.length}`);
      display.console.log("RenderStats2", `Transparents: ${this.transparentsCache.length}`);
      display.console.log("RenderStats3", `Opaque DrawCalls: ${opaqueDrawCalls}`);
      display.console.log("RenderStats4", `Opaque Render Time: ${(endOpaque - startOpaque).toFixed(2)}ms`);
    }

    if (this.transparentsCache.length > 0) {
      this.transparentsCache.sort((a, b) => a.layer - b.layer);

      context.enable(context.BLEND);
      context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);
      context.depthMask(false);
      context.disable(context.DEPTH_TEST);

      const startTransparent = performance.now();
      const transparentDrawCalls = this.renderObjects(context, engine, scene, this.transparentsCache, false);
      const endTransparent = performance.now();

      context.depthMask(true);
      this.transparentsCache.length = 0;

      if (display) {
        display.console.log("RenderStats", `Transparent DrawCalls: ${transparentDrawCalls}`);
        display.console.log("RenderStats", `Transparent Render Time: ${(endTransparent - startTransparent).toFixed(2)}ms`);
      }
    }

    
  }
}
