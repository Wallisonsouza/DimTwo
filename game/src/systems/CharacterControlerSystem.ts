
import { System, type CollisionEvent2D } from "@engine/core/base/System";
import { ComponentType } from "@engine/modules/enums/ComponentType";

import { KeyCode } from "@engine/core/input/KeyCode";
import { Vec2 } from "@engine/core/math/Vec2";
import { Vec3 } from "@engine/core/math/Vec3";
import { ForceMode, RigidBody2D } from "@engine/modules/2D/RigidBody2D";
import type { SpriteRender2D } from "@engine/modules/2D/SpriteRender2D";
import type { Animator } from "@engine/modules/shared/animator/Animator";
import { CharacterControler2D } from "./character.controller.types";

export class CharacterControlerSystem extends System {
  private running: boolean = false;

  update(dt: number) {
    const input = this.engine.input;

    const components = this.engine.components;
    const characterControlers = components.getAllOfType<CharacterControler2D>(
      ComponentType.CharacterController
    );

    for (const characterControler of characterControlers) {

      characterControler.direction.x = 0;
      characterControler.direction.y = 0;

      const rigid = this.engine.components.getComponent<RigidBody2D>(
        characterControler.gameEntity,
        ComponentType.RigidBody2D
      );

      const animator = this.engine.components.getComponent<Animator>(
        characterControler.gameEntity,
        ComponentType.Animator
      );

      const spriteRender = this.engine.components.getComponent<SpriteRender2D>(
        characterControler.gameEntity,
        ComponentType.SpriteRender
      );
      if (!rigid || !animator || !spriteRender) continue;

      if (animator.locked) return;

      this.running = input.getKey(KeyCode.ShiftLeft);

      if (input.getKey(KeyCode.KeyA)) {
        animator.setAnimatorState(this.running ? "run" : "walk");
        spriteRender.flipHorizontal = true;
        characterControler.direction.x -= 1;
        spriteRender.transform.scale.x = -1;
      }

      if (input.getKey(KeyCode.KeyD)) {
        animator.setAnimatorState(this.running ? "run" : "walk");
        spriteRender.flipHorizontal = false;
        characterControler.direction.x += 1;
        spriteRender.transform.scale.x = 1;
      }

      const speed = this.running ? 1.2 : 0.5;
      rigid.addForce(Vec2.scale(characterControler.direction, speed), ForceMode.Impulse);

      if (rigid.linearVelocity.x > speed) rigid.linearVelocity.x = speed;
      if (rigid.linearVelocity.x < -speed) rigid.linearVelocity.x = -speed;

      if (characterControler.direction.x === 0) {
        animator.setAnimatorState("idle");
      }

      if (input.getMouseButtonDown(0)) {
        animator.setAnimatorState("attack1", true);
      }
      if (input.getMouseButtonDown(2)) {
        animator.setAnimatorState("defend", true);
      }

      if (input.getKeyDown(KeyCode.Space) && characterControler.jumpCount < 2) {
        animator.setAnimatorState("jump", true);
        rigid.addForceAtPoint(new Vec2(0, 1).scaleInPlace(10), new Vec2(1, 0), ForceMode.Impulse)
        characterControler.jumpCount += 1;
      }
    }
  }

  onCollisionEnter2D(collisionEvent: CollisionEvent2D): void {
    const characterControlerA = this.engine.components.getComponent<CharacterControler2D>(
      collisionEvent.a.gameEntity,
      ComponentType.CharacterController
    );

    const characterControlerB = this.engine.components.getComponent<CharacterControler2D>(
      collisionEvent.b.gameEntity,
      ComponentType.CharacterController
    );

    if (characterControlerA) {
      characterControlerA.jumpCount = 0;
    }

    if (characterControlerB) {
      characterControlerB.jumpCount = 0;
    }


  }
}



const a = new Vec2(2, 2);
const b = new Vec3(2, 3, 4);


Vec3.add(Vec3.fromVec2(a), b)
