import { System } from "../../engine/src/core/base/System";
import { ResourcesManager } from "../../engine/src/global/manager/manager";
import type { Collider } from "../../engine/src/modules/components/physics/collider/types";
import { ComponentGroup } from "../../engine/src/modules/enums/ComponentGroup";
import type { Mesh } from "../../engine/src/modules/resources/mesh/Mesh";

export class GizmosSystem extends System {
    onDrawGizmos(): void {
        const scene = this.getScene();
        const engine = this.getEngine();
        const gl = engine.getContext();

        const shader = engine.shaders.get("gizmos");
        if (!shader || !shader.systemName) return;

        const shaderSystem = ResourcesManager.ShaderSystemManager.get(shader.systemName);
        if (!shaderSystem) return;

        gl.useProgram(shader.program);
        shaderSystem.global?.(engine, scene, shader);

        const colliders = scene.components.getAllByGroup<Collider>(ComponentGroup.Collider);
        const mesh = ResourcesManager.MeshManager.get("wireQuad") as Mesh;
        if (!mesh) return;

        for (const collider of colliders) {
            const entityID = collider.getEntityID();
            shaderSystem.local?.(engine, entityID, scene, shader);

            const vao = engine.meshBuffers.get(mesh.name);
            if (!vao) continue;

            gl.bindVertexArray(vao.vao);
            gl.drawElements(gl.LINES, vao.indexCount, gl.UNSIGNED_SHORT, 0);
            gl.bindVertexArray(null);
        }
    }
}
