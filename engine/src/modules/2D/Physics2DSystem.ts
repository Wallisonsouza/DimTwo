import { Quat } from "@engine/core/math/quat";
import { Vec2 } from "@engine/core/math/Vec2";
import { Time } from "@engine/core/time/Time";
import { EngineConfig } from "@engine/global/EngineConfig";
import { System } from "../../core/base/System";
import { ComponentGroup } from "../enums/ComponentGroup";
import { PhysicsMath2D } from "./PhysicsMath2D";
import { RigidBody2D } from "./RigidBody2D";

export class PhysicsSystem extends System {

  gravityVectorCache: Vec2 = Vec2.create();

  fixedUpdate() {
    const rigidbodies = this.engine.components.getAllByGroup<RigidBody2D>(ComponentGroup.RigidBody2D);


    this.gravityVectorCache.copy(Vec2.Down).mulInPlace(EngineConfig.PHYSICS.gravity);


    for (const rigid of rigidbodies) {
      if (!rigid.enabled || rigid.isSleeping) continue;

      if (rigid.useGravity) {
        const gravityOffset = Vec2.scale(this.gravityVectorCache, rigid.gravityScale);
        rigid.linearAcceleration.addInPlace(gravityOffset);
      }

      // converte as forças em aceleração
      const forcesAccel = PhysicsMath2D.forceToAcceleration(rigid.forces, rigid.mass);
      rigid.linearAcceleration.addInPlace(forcesAccel);



      // ---- Linear ----
      const pos2D = rigid.transform.position.toVec2();
      const z = rigid.transform.position.z;

      if (!rigid.freezePosition) {
        PhysicsMath2D.integrateEulerSemiImplicit(
          rigid.linearVelocity,
          rigid.linearAcceleration,
          pos2D,
          Time.fixedDeltaTime
        );
        rigid.transform.position.setFromNumber(pos2D.x, pos2D.y, z);
      } else {
        rigid.linearVelocity.set(0, 0);
      }

      if (!rigid.freezeRotation) {
        rigid.angularVelocity += rigid.angularAcceleration * Time.fixedDeltaTime;
        const deltaRot = Quat.fromRad(0, 0, rigid.angularVelocity * Time.fixedDeltaTime);
        Quat.multiply(rigid.transform.rotation, deltaRot, rigid.transform.rotation);
      } else {
        rigid.angularVelocity = 0;
      }

      rigid.forces.set(0, 0);
      rigid.linearAcceleration.set(0, 0);
      rigid.angularAcceleration = 0;
    }
  }
}
