import { Quat } from "@engine/core/math/quat";
import { Vec2 } from "@engine/core/math/Vec2";
import { Vec3 } from "@engine/core/math/Vec3";
import { EngineConfig } from "@engine/global/EngineConfig";
import { BodyType, type RigidBody2D } from "@engine/modules/2D/RigidBody2D";
import { ComponentGroup } from "@engine/modules/enums/ComponentGroup";
import { System, type CollisionEvent2D } from "../../core/base/System";
import { ComponentType } from "../enums/ComponentType";
import type { Collider2D } from "./Collider2D";
import { PhysicsMath2D } from "./PhysicsMath2D";
import { Sleep } from "./Sleep2D";

export class PhysicsSystem extends System {

  linearThreshold: number = 0.01;
  angularThreshold: number = 0.01;

  timeToSleep: number = 1;
  stillTime: number = 0;

  fixedUpdate(fixedDeltaTime: number) {
    const rigidbodies = this.engine.components.getAllByGroup<RigidBody2D>(ComponentGroup.RigidBody2D);

    for (const rigid of rigidbodies) {

      Sleep.updateSleepState(rigid, fixedDeltaTime);

      if (!rigid.enabled || rigid.isSleeping) continue;
      if (rigid.bodyType === BodyType.Static) continue;

      // Gravidade
      if (rigid.useGravity) {
        const gravityVector = Vec2.mul(Vec2.Down, EngineConfig.PHYSICS.gravity);
        const gravityOffset = Vec2.scale(gravityVector, rigid.gravityScale);
        rigid.linearAcceleration.addInPlace(gravityOffset);
      }

      // Aplicar física linear e angular
      rigid.applyDrag();

      const deltaPos = PhysicsMath2D.calculateMRUAPosition(
        rigid.linearVelocity,
        rigid.linearAcceleration,
        fixedDeltaTime
      );

      rigid.transform.position.addInPlace(Vec3.fromVec2(deltaPos));

      rigid.linearVelocity.addInPlace(Vec2.scale(rigid.linearAcceleration, fixedDeltaTime));

      rigid.lastLinearVelocity.copy(rigid.linearVelocity);
      rigid.linearAcceleration.set(0, 0);

      rigid.angularVelocity += rigid.angularAcceleration * fixedDeltaTime;
      rigid.angularAcceleration = 0;

      const halfAngle = 0.5 * rigid.angularVelocity * fixedDeltaTime;
      const deltaRot = new Quat(0, 0, Math.sin(halfAngle), Math.cos(halfAngle));
      rigid.transform.rotation.multiplyInPlace(deltaRot);
    }
  }

  onCollisionStay2D(event: CollisionEvent2D) {
    const a = this.getRigid(event.a);
    if (a) Sleep.wakeIfNeeded(a);

    const b = this.getRigid(event.b);
    if (b) Sleep.wakeIfNeeded(b);

  }

  private getRigid(collider: Collider2D): RigidBody2D | null {
    return this.engine.components.getComponent<RigidBody2D>(collider.gameEntity, ComponentType.RigidBody2D) || null;
  }
}
