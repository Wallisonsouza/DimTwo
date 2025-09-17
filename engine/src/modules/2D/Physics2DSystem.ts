import { Vec2 } from "@engine/core/math/Vec2";
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
      if (!rigid.enabled || rigid.isSleeping) continue;
      if (rigid.bodyType === BodyType.Static) continue;

      rigid.linearAcceleration.set(0, 0);

      // Gravidade
      if (rigid.useGravity) {
        const gravityVector = Vec2.mul(Vec2.Down, EngineConfig.PHYSICS.gravity);
        const gravityOffset = Vec2.scale(gravityVector, rigid.gravityScale);
        rigid.linearAcceleration.addInPlace(gravityOffset);
      }


      const forcesAccel = PhysicsMath2D.forceToAcceleration(
        rigid.forces,
        rigid.mass
      );
      rigid.linearAcceleration.addInPlace(forcesAccel);
      rigid.forces.set(0, 0);

      rigid.applyDrag();


      const pos2D = rigid.transform.position.toVec2();
      PhysicsMath2D.integrateEulerSemiImplicit(
        rigid.linearVelocity,
        rigid.linearAcceleration,
        pos2D,
        fixedDeltaTime
      );

      rigid.transform.position.set(pos2D.x, pos2D.y, 0);
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
