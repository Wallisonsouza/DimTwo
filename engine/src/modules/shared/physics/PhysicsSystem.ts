import { System } from "../../../core/base/System";
import { EngineConfig } from "../../../global/EngineConfig";
import type { RigidBody2D } from "../../2D/RigidBody2D";
import type { Transform } from "../../3D/Transform";
import { ComponentGroup } from "../../enums/ComponentGroup";
import { ComponentType } from "../../enums/ComponentType";

export class PhysicsSystem extends System {
  fixedUpdate(fdt: number) {

    const scene = this.engine.activeScene;
    const components = scene.components;

    const rigidbodies = components.getAllByGroup<RigidBody2D>(
      ComponentGroup.RigidBody2D
    );

    for (const rigid of rigidbodies) {
      if (rigid.isStatic) continue;

      const transform = components.getComponent<Transform>(
        rigid.gameEntity,
        ComponentType.Transform
      );

      if (!transform) continue;

      if (rigid.useGravity) {
        rigid.velocity.x += EngineConfig.PHYSICS.gravity.x * fdt;
        rigid.velocity.y += EngineConfig.PHYSICS.gravity.y * fdt;
      }

      const decay = Math.exp(-rigid.drag * fdt);
      rigid.velocity.x *= decay;
      rigid.velocity.y *= decay;

      transform.position.x -= rigid.velocity.x * fdt;
      transform.position.y += rigid.velocity.y * fdt;
    }
  }
}
