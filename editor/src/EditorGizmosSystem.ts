import { System } from "@engine/core/base/System";
import { Color } from "@engine/core/math/Color";
import { Quat } from "@engine/core/math/quat";
import { Vec3 } from "@engine/core/math/Vec3";
import type { Engine } from "@engine/Engine";
import { ResourcesManager } from "@engine/global/ResourcesManager";
import { BoxCollider2D } from "@engine/modules/2D/BoxCollider2D";
import { Transform } from "@engine/modules/3D/Transform";
import { ComponentType } from "@engine/modules/enums/ComponentType";

export interface GizmosGeometry {
  transform: Transform;
  mesh: "fillQuad" | "wireQuad" | "wireCircle";
  type: "wire";
}

export class Gizmos {
  public static geometries: GizmosGeometry[] = [];
  public static defaultColor: Color = Color.Green;
  public static color = Color.Green;

  public static drawWireQuad(
    position: Vec3 = new Vec3(),
    scale: Vec3 = new Vec3(1, 1, 1),
    rotation: Quat = new Quat(),
  ) {
    this.geometries.push({
      mesh: "wireQuad",
      type: "wire",
      transform: new Transform({ position, scale, rotation }),
    });
  }

  public static drawWireCircle(
    position: Vec3 = new Vec3(),
    radius: number = 1,
    rotation: Quat = new Quat(),
  ) {
    this.geometries.push({
      mesh: "wireCircle",
      type: "wire",
      transform: new Transform({ position, scale: new Vec3(radius, radius, radius), rotation }),
    });
  }

  public static clear() {
    this.geometries = [];
  }

  public static render(engine: Engine) {
    const scene = engine.activeScene;
    const gl = engine.engineWindow.context;

    const shader = engine.shaders.get("gizmos");
    if (!shader || !shader.systemName) return;

    const shaderSystem = ResourcesManager.ShaderSystemManager.get(shader.systemName);
    if (!shaderSystem) return;

    gl.useProgram(shader.program);
    shaderSystem.global?.(engine, scene, shader);

    for (const geo of Gizmos.geometries) {
      const vao = engine.meshBuffers.get(geo.mesh);
      if (!vao) continue;

      shaderSystem.local?.(engine, geo.transform, scene, shader);

      gl.bindVertexArray(vao.vao);
      gl.drawElements(geo.type === "wire" ? gl.LINES : gl.TRIANGLES, vao.indexCount, gl.UNSIGNED_SHORT, 0);
      gl.bindVertexArray(null);
    }
    Gizmos.clear();
  }
}

export class EditorGizmosSystem extends System {
  onDrawGizmos(): void {

    for (const collider of this.engine.components.getAllOfType<BoxCollider2D>(ComponentType.BoxCollider2D)) {

      const realPos = Vec3.add(collider.transform.position, Vec3.fromVec2(collider.center));
      const realSize = Vec3.mult(collider.transform.scale, Vec3.fromVec2(collider.size));

      Gizmos.drawWireQuad(realPos, realSize, collider.transform.rotation);

    }
    Gizmos.render(this.engine);
    Gizmos.clear();

  }
}
