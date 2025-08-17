import type { Render } from "../../core/base/Render";
import { System } from "../../core/base/System";
import { ResourcesManager } from "../../global/manager/manager";
import type { Transform } from "../components/spatial/Transform";
import { ComponentGroup, ComponentType } from "../enums/ComponentType";


export class RenderSystem extends System {

  render() {
    const scene = this.getScene();
    const components = scene.components;
    const engine = this.getEngine();
    const shaders = engine.shaders;
    const gl = engine.getContext();

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const renders = components
      .getAllByGroup<Render>(ComponentGroup.Render)
      .filter(r => r.enabled);

    const rendersByLayer = new Map<number, Render[]>();
    for (const render of renders) {
      const layer = render.layer ?? 0;
      if (!rendersByLayer.has(layer)) {
        rendersByLayer.set(layer, []);
      }
      rendersByLayer.get(layer)!.push(render);
    }

    // Ordena layers (menor para maior)
    const sortedLayers = [...rendersByLayer.keys()].sort((a, b) => a - b);

    // Renderiza layer por layer
    for (const layer of sortedLayers) {
      for (const render of rendersByLayer.get(layer)!) {
        const entityID = render.getEntityID();

        const material = ResourcesManager.MaterialManager.get(render.material);
        if (!material || !material.shaderName) continue;

        const shader = shaders.get(material.shaderName)!;
        gl.useProgram(shader.program);

        const transform = components.getComponent<Transform>(
          entityID,
          ComponentType.Transform
        );
        if (!transform) continue;

        const shaderSystem = ResourcesManager.ShaderSystemManager.get(material.name);
        if (!shaderSystem) continue;

        shaderSystem.global?.(engine, scene, shader);
        shaderSystem.local?.(engine, entityID, scene, shader);

        if (!render.meshName) return;
        const mesh = ResourcesManager.MeshManager.get(render.meshName);
        if (!mesh) continue;

        const vao = engine.meshBuffers.get(mesh.name);
        if (!vao) continue;

        gl.bindVertexArray(vao.vao);
        gl.drawElements(gl.TRIANGLES, vao.indexCount, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
      }
    }
  }
}
