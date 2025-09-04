import { EngineConfig } from "@engine/global/EngineConfig";
import type { RigidBody2D } from "@engine/modules/2D/RigidBody2D";
import { ComponentGroup } from "@engine/modules/enums/ComponentGroup";
import { System } from "../../core/base/System";

export class PhysicsSystem extends System {

  fixedUpdate(fdt: number) {
    const components = this.engine.components;
    const rigidbodies = components.getAllByGroup<RigidBody2D>(
      ComponentGroup.RigidBody2D
    );

    for (const rigid of rigidbodies) {
      if (rigid.isStatic) continue;
      rigid.acceleration.set(0, 0);



      if (rigid.useGravity) {
        rigid.acceleration.y += EngineConfig.PHYSICS.gravity.y * rigid.gravityScale;
      }

      rigid.applyDrag();

      rigid.transform.position.x += rigid.velocity.x * fdt + 0.5 * rigid.acceleration.x * fdt * fdt;
      rigid.transform.position.y += rigid.velocity.y * fdt + 0.5 * rigid.acceleration.y * fdt * fdt;

      rigid.velocity.x += rigid.acceleration.x * fdt;
      rigid.velocity.y += rigid.acceleration.y * fdt;

    }
  }
}
