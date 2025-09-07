import { Quat } from "@engine/core/math/quat";
import { Vec3 } from "@engine/core/math/Vec3";
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

      // Aplicar gravidade
      if (rigid.useGravity) {
        rigid.linearAcceleration.y += EngineConfig.PHYSICS.gravity.y * rigid.gravityScale;
      }

      // Aplicar drag
      rigid.applyDrag();

      // --- Atualiza posição linear ---
      const deltaPos = PhysicsMath2D.calculateMRUAPosition(
        rigid.linearVelocity,
        rigid.linearAcceleration,
        fdt
      );

      rigid.transform.position.x += deltaPos.x;
      rigid.transform.position.y += deltaPos.y;

      // Atualiza velocidade linear
      rigid.linearVelocity.x += rigid.linearAcceleration.x * fdt;
      rigid.linearVelocity.y += rigid.linearAcceleration.y * fdt;
      rigid.linearAcceleration.set(0, 0);

      // --- Atualiza rotação usando quaternion ---
      const deltaAngle = rigid.angularVelocity * fdt;
      const deltaQuat = Quat.fromEulerAngles(new Vec3(0, 0, deltaAngle));
      rigid.transform.rotation.multiplyInPlace(deltaQuat);

      // Atualiza velocidade angular
      rigid.angularVelocity += rigid.angularAcceleration * fdt;
      rigid.angularAcceleration = 0;
    }
  }
}
