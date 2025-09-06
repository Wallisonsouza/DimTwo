import { EngineConfig } from "@engine/global/EngineConfig";
import type { RigidBody2D } from "@engine/modules/2D/RigidBody2D";
import { ComponentGroup } from "@engine/modules/enums/ComponentGroup";
import { System } from "../../core/base/System";
import { PhysicsMath2D } from "./PhysicsMath2D";

export class PhysicsSystem extends System {

  fixedUpdate(fdt: number) {
    const components = this.engine.components;
    const rigidbodies = components.getAllByGroup<RigidBody2D>(
      ComponentGroup.RigidBody2D
    );

    for (const rigid of rigidbodies) {
      if (rigid.useGravity) {
        rigid.linearAcceleration.y += EngineConfig.PHYSICS.gravity.y * rigid.gravityScale;
      }

      rigid.applyDrag();

      const position = PhysicsMath2D
        .calculateMRUAPosition(
          rigid.linearVelocity,
          rigid.linearAcceleration,
          fdt
        );

      rigid.transform.position.x += position.x;
      rigid.transform.position.y += position.y;

      rigid.linearVelocity.x += rigid.linearAcceleration.x * fdt;
      rigid.linearVelocity.y += rigid.linearAcceleration.y * fdt;
      rigid.linearAcceleration.set(0, 0);
    }
  }
}
