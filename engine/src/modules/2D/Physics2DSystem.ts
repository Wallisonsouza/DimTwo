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

      // aplica gravidade na aceleração
      if (rigid.useGravity) {
        rigid.acceleration.y += EngineConfig.PHYSICS.gravity.y * rigid.gravityScale;
      }

      // cinemática
      rigid.transform.position.x += rigid.velocity.x * fdt + 0.5 * rigid.acceleration.x * fdt * fdt;
      rigid.transform.position.y += rigid.velocity.y * fdt + 0.5 * rigid.acceleration.y * fdt * fdt;

      // atualiza velocidade
      rigid.velocity.x += rigid.acceleration.x * fdt;
      rigid.velocity.y += rigid.acceleration.y * fdt;

      // aplica drag
      const dragFactor = Math.max(0, 1 - rigid.drag * fdt);
      rigid.velocity.x *= dragFactor;
      rigid.velocity.y *= dragFactor;

      // reseta aceleração
      rigid.acceleration.set(0, 0);
    }
  }
}
