import { MeshBuffer } from "@engine/core/webgl/MeshBuffer";
import { Shader } from "@engine/Rendering/Shader";
import type { Render } from "../../../core/base/Render";
import { System } from "../../../core/base/System";
import { Scene } from "../../../core/scene/scene";
import type { Engine } from "../../../Engine";
import { ComponentGroup } from "../../enums/ComponentGroup";
import { Camera } from "../camera/Camera";
import { Component } from "@engine/core/base/Component";


export class RenderSystem extends System {

  private transparentsCache: Render[] = [];

  private renderObjects(
    context: WebGL2RenderingContext,
    engine: Engine,
    scene: Scene,
    renders: Render[],
    opaque: boolean
  ) {

    const shaders = Shader.getAll();

    for (let i = 0; i < shaders.length; i++) {
      const shader = shaders[i];

      if (!shader.system) continue;

      const system = shader.system;
      if (!system) continue;

      const camera = Camera.getActivedCamera();
      system.global(engine, camera, scene, shader);

    }


    for (const render of renders) {
      if (!render.enabled) continue;

      const material = render.material;
      const shader = material?.shader;

      if (!material || !shader) continue;


      if (opaque && (render.color.a < 1 || material.transparent)) {
        this.transparentsCache.push(render);
        continue;
      }

      context.useProgram(shader.program);

      const shaderSystem = shader.system;
      if (!shaderSystem) continue;


      shaderSystem.local?.(render.gameEntity, material);


      const mesh = render.mesh;
      if (!mesh) continue;

      const buffer = MeshBuffer.get(mesh.name);
      if (!buffer) continue;

      context.bindVertexArray(buffer.vao);
      context.drawElements(context.TRIANGLES, buffer.indexCount, context.UNSIGNED_SHORT, 0);

    }


  }

  render() {
    const engine = this.engine;
    const scene = Scene.getLoadedScene();
    const context = engine.engineWindow.context;

    const renders = Component.getAllComponentsByGroup<Render>(ComponentGroup.Render);

    context.depthMask(true);
    context.enable(context.DEPTH_TEST);
    context.disable(context.BLEND);


    this.renderObjects(context, engine, scene, renders, true);

    if (this.transparentsCache.length > 0) {
      /*   const camera = engine.getActivedCamera();
  
        this.transparentsCache.sort((a, b) => {
          const distA = Vec3.distance(camera.transform.position, a.transform.position);
          const distB = Vec3.distance(camera.transform.position, b.transform.position);
          return distA - distB;
        });
  
        context.enable(context.DEPTH_TEST);
        context.depthMask(false);
        context.enable(context.BLEND);
        context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);
  
        this.renderObjects(context, engine, scene, this.transparentsCache, false);
  
        context.depthMask(true);
        context.disable(context.BLEND);
        this.transparentsCache.length = 0; */
    }


  }
}
