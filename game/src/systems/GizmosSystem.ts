import { System } from "@engine/core/base/System";
import { ResourcesManager } from "@engine/global/ResourcesManager";
import type { Collider2D } from "@engine/modules/2D/Collider2D";
import { ComponentGroup } from "@engine/modules/enums/ComponentGroup";
import type { Mesh } from "@engine/Rendering/Mesh";

export class GizmosSystem extends System {
  onDrawGizmos(): void {
    const scene = this.getScene();
    const engine = this.getEngine();
    const gl = engine.engineWindow.context;

    const shader = engine.shaders.get("gizmos");
    if (!shader || !shader.systemName) return;

    const shaderSystem = ResourcesManager.ShaderSystemManager.get(shader.systemName);
    if (!shaderSystem) return;

    gl.useProgram(shader.program);
    shaderSystem.global?.(engine, scene, shader);

    const colliders = scene.components.getAllByGroup<Collider2D>(ComponentGroup.Collider);
    const mesh = ResourcesManager.MeshManager.get("wireQuad") as Mesh;
    if (!mesh) return;

    for (const collider of colliders) {

      shaderSystem.local?.(engine, collider.gameEntity, scene, shader);

      const vao = engine.meshBuffers.get(mesh.name);
      if (!vao) continue;

      gl.bindVertexArray(vao.vao);
      gl.drawElements(gl.LINES, vao.indexCount, gl.UNSIGNED_SHORT, 0);
      gl.bindVertexArray(null);
    }
  }
}
