import { Vec2 } from "../../core/math/Vec2";
import type { RigidBody2D } from "./RigidBody2D";

export class Sleep {
  static sleepLinearThreshold: number = 0.01;
  static sleepAngularThreshold: number = 0.01;
  static timeToSleep = 1;

  static updateSleepState(rigid: RigidBody2D, deltaTime: number) {
    const linVel2 = Vec2.lenSq(rigid.linearVelocity);
    const angVel = Math.abs(rigid.angularVelocity);

    console.log(linVel2, angVel)
    if (linVel2 < this.sleepLinearThreshold ** 2 && angVel < this.sleepAngularThreshold) {
      rigid.stillTime += deltaTime;
      if (rigid.stillTime >= this.timeToSleep) {
        rigid.isSleeping = true;
        rigid.linearVelocity.set(0, 0);
        rigid.angularVelocity = 0;
        rigid.linearAcceleration.set(0, 0);
        rigid.angularAcceleration = 0;
      }
    } else {
      rigid.stillTime = 0;
      rigid.isSleeping = false;
    }
  }

  static wakeUpRigidBodyImediate(rigid: RigidBody2D) {
    rigid.isSleeping = false;
    rigid.stillTime = 0;
  }

  static wakeIfNeeded(rigid: RigidBody2D, epsilon: number = 1e-4) {
    const speedSq = Vec2.lenSq(rigid.linearVelocity);
    const movingLinear = speedSq > epsilon * epsilon;
    const movingAngular = Math.abs(rigid.angularVelocity) > epsilon;

    if (movingLinear || movingAngular) {
      Sleep.wakeUpRigidBodyImediate(rigid);
    }
  }

}
