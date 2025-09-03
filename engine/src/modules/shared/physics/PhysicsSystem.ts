import { EngineConfig } from "@engine/global/EngineConfig";
import type { RigidBody2D } from "@engine/modules/2D/RigidBody2D";
import { ComponentGroup } from "@engine/modules/enums/ComponentGroup";
import { System } from "../../../core/base/System";

export class PhysicsSystem extends System {
  fixedUpdate(fdt: number) {
    const components = this.engine.components;

    const rigidbodies = components.getAllByGroup<RigidBody2D>(
      ComponentGroup.RigidBody2D
    );

    for (const rigid of rigidbodies) {
      if (rigid.isStatic) continue;

      if (rigid.useGravity) {
        rigid.velocity.x += EngineConfig.PHYSICS.gravity.x * fdt;
        rigid.velocity.y += EngineConfig.PHYSICS.gravity.y * fdt;
      }

      const decay = Math.exp(-rigid.drag * fdt);
      rigid.velocity.x *= decay;
      rigid.velocity.y *= decay;

      rigid.transform.position.x -= rigid.velocity.x * fdt;
      rigid.transform.position.y += rigid.velocity.y * fdt;
    }
  }
}
