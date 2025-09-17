import { Quat } from "@engine/core/math/quat";
import { Vec2 } from "@engine/core/math/Vec2";
import { EngineConfig } from "@engine/global/EngineConfig";
import { BodyType, type RigidBody2D } from "@engine/modules/2D/RigidBody2D";
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
      if (rigid.bodyType === BodyType.Static) continue;


      if (rigid.useGravity) {

        const gravityVector = Vec2.mul(Vec2.Down, EngineConfig.PHYSICS.gravity);
        const gravityOffset = Vec2.scale(gravityVector, rigid.gravityScale);

        rigid.linearAcceleration.addInPlace(gravityOffset);
      }


      rigid.applyDrag();

      const deltaPos = PhysicsMath2D.calculateMRUAPosition(
        rigid.linearVelocity,
        rigid.linearAcceleration,
        fdt
      );

      rigid.transform.position.x += deltaPos.x;
      rigid.transform.position.y += deltaPos.y;

      rigid.linearVelocity.x += rigid.linearAcceleration.x * fdt;
      rigid.linearVelocity.y += rigid.linearAcceleration.y * fdt;
      rigid.linearAcceleration.set(0, 0);

      // Angular (quaternion)
      rigid.angularVelocity += rigid.angularAcceleration * fdt;
      rigid.angularAcceleration = 0;

      const halfAngle = 0.5 * rigid.angularVelocity * fdt;
      const deltaRot = new Quat(0, 0, Math.sin(halfAngle), Math.cos(halfAngle));
      rigid.transform.rotation.multiplyInPlace(deltaRot);

    }
  }
}
