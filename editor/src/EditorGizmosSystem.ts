import { System } from "@engine/core/base/System";
import { Color } from "@engine/core/math/Color";
import { Quat } from "@engine/core/math/quat";
import { Vec2 } from "@engine/core/math/Vec2";
import { Vec3 } from "@engine/core/math/Vec3";
import type { Engine } from "@engine/Engine";
import { ResourcesManager } from "@engine/global/ResourcesManager";
import { BoxCollider2D } from "@engine/modules/2D/BoxCollider2D";
import type { RigidBody2D } from "@engine/modules/2D/RigidBody2D";
import { Transform } from "@engine/modules/3D/Transform";
import { ComponentType } from "@engine/modules/enums/ComponentType";

export interface GizmosGeometry {
  transform: Transform;
  mesh: "fillQuad" | "wireQuad" | "wireCircle" | "fillCircle";
  type: "wire" | "fill";
  color: Color;
}

export class Gizmos {
  public static geometries: GizmosGeometry[] = [];
  public static defaultColor: Color = Color.Green;
  public static color = Color.Green;

  public static drawWireQuad(
    position: Vec3 = new Vec3(),
    scale: Vec3 = new Vec3(1, 1, 1),
    rotation: Quat = new Quat(),
    color: Color = Color.Green
  ) {
    this.geometries.push({
      mesh: "wireQuad",
      color: color,
      type: "wire",
      transform: new Transform({ position, scale, rotation }),
    });
  }

  public static drawWireCircle(
    position: Vec3 = new Vec3(),
    radius: number = 1,
    rotation: Quat = new Quat(),
    color: Color = Color.Green
  ) {
    this.geometries.push({
      mesh: "wireCircle",
      type: "wire",
      color: color,
      transform: new Transform({ position, scale: new Vec3(radius, radius, radius), rotation }),
    });
  }

  public static drawFillCircle(
    position: Vec3 = new Vec3(),
    radius: number = 1,
    rotation: Quat = new Quat(),
    color: Color = Color.Green
  ) {
    this.geometries.push({
      mesh: "fillCircle",
      type: "fill",
      color: color,
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
      const halfSize = Vec2.scale(collider.size, 0.5);
      const offset = collider.center;

      const vertices: Vec2[] = [
        Vec2.add(offset, new Vec2(-halfSize.x, -halfSize.y)),
        Vec2.add(offset, new Vec2(halfSize.x, -halfSize.y)),
        Vec2.add(offset, new Vec2(halfSize.x, halfSize.y)),
        Vec2.add(offset, new Vec2(-halfSize.x, halfSize.y)),
      ];

      const worldVertices: Vec3[] = vertices.map(
        v => collider.transform.transformPointToWorldSpace(Vec3.fromVec2(v))
      );

      Gizmos.color = Color.Green;

      for (let i = 0; i < 4; i++) {
        Gizmos.drawWireCircle(worldVertices[i], 0.1);
        Gizmos.render(this.engine);
        for (const point of collider.contacts) {
          Gizmos.drawFillCircle(Vec3.fromVec2(point), 0.1);
          Gizmos.render(this.engine);
        }
      }

      Gizmos.color = Color.Red;
      Gizmos.render(this.engine);
    }


    Gizmos.color = Color.Yellow;
    for (const rigid of this.engine.components.getAllOfType<RigidBody2D>(ComponentType.RigidBody2D)) {
      Gizmos.drawFillCircle(rigid.getCenterOfMass(), 0.2);
    }
    Gizmos.render(this.engine);

    Gizmos.clear();
  }

}
