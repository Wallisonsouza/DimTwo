
import { System, type CollisionEvent2D } from "@engine/core/base/System";
import { ComponentType } from "@engine/modules/enums/ComponentType";

import { KeyCode } from "@engine/core/input/KeyCode";
import { Vec2 } from "@engine/core/math/Vec2";
import { Physics2D } from "@engine/modules/2D/Physics2D";
import { ForceMode, RigidBody2D } from "@engine/modules/2D/RigidBody2D";
import type { SpriteRender2D } from "@engine/modules/2D/SpriteRender2D";
import type { Animator } from "@engine/modules/shared/animator/Animator";
import { CharacterControler2D } from "./character.controller.types";
import { Camera } from "@engine/modules/shared/camera/Camera";
import { Component } from "@engine/core/base/Component";

export class CharacterControlerSystem extends System {
  private running: boolean = false;



  //camera manager
  //camera

  update() {
    const input = this.engine.input;

    const camera = Camera.getActivedCamera();
    if (!camera) return;

    const mousePos = input.getMousePosition();
    if (!mousePos) return;

    const characterControlers = Component.getAllComponentsByType<CharacterControler2D>(ComponentType.CharacterController);


    for (const characterControler of characterControlers) {



      if (input.getMouseButtonDown(0)) {
        const hit = Physics2D.rayCast2D(
          characterControler.transform.position.xy,
          characterControler.transform.rightVector.xy,
          0.5
        );

        if (hit && hit.distance < 0.4) {

          setTimeout(() => {
            const entity = hit.collider.gameEntity;
            const rb = Component.getComponentByType<RigidBody2D>(entity, ComponentType.RigidBody2D);

            if (!rb) return;

            rb.addForce(Vec2.scale(characterControler.transform.rightVector.xy, 100),)
          }, 300);

        }
      }


      characterControler.direction.x = 0;
      characterControler.direction.y = 0;

      const rigid = Component.getComponentByType<RigidBody2D>(characterControler.gameEntity, ComponentType.RigidBody2D);

      const animator = Component.getComponentByType<Animator>(
        characterControler.gameEntity,
        ComponentType.Animator

      );


      const spriteRender = Component.getComponentByType<SpriteRender2D>(
        characterControler.gameEntity,
        ComponentType.SpriteRender
      );
      if (!rigid || !spriteRender) continue;



      this.running = input.getKey(KeyCode.ShiftLeft);

      if (input.getKey(KeyCode.KeyA)) {

        if (animator && !animator.locked) {
          animator.setAnimatorState(this.running ? "run" : "walk");
        }

        spriteRender.flipHorizontal = true;
        characterControler.direction.x -= 1;
        spriteRender.transform.scale.x = -1;
      }

      if (input.getKey(KeyCode.KeyD)) {
        if (animator && !animator.locked) {
          animator.setAnimatorState(this.running ? "run" : "walk");
        }

        spriteRender.flipHorizontal = false;
        characterControler.direction.x += 1;
        spriteRender.transform.scale.x = 1;
      }

      const speed = this.running ? 1 : 0.4;

      rigid.addForce(Vec2.scale(characterControler.direction, 4), ForceMode.Force);

      if (rigid.linearVelocity.x > speed) rigid.linearVelocity.x = speed;
      if (rigid.linearVelocity.x < -speed) rigid.linearVelocity.x = -speed;

      if (characterControler.direction.x === 0) {
        /* animator.setAnimatorState("idle"); */
      }

      if (input.getMouseButtonDown(0)) {
        /* animator.setAnimatorState("attack1", true); */
      }
      if (input.getMouseButtonDown(2)) {
        /* animator.setAnimatorState("defend", true); */
      }

      if (input.getKeyDown(KeyCode.Space) && characterControler.jumpCount < 2) {
        /*  animator.setAnimatorState("jump", true); */
        characterControler.jumpCount += 1;
        rigid.addForce(Vec2.scale(Vec2.Up, 200), ForceMode.Force);

      }
    }
  }

  onCollisionEnter2D(collisionEvent: CollisionEvent2D): void {
    const characterControlerA = Component.getComponentByType<CharacterControler2D>(
      collisionEvent.a.gameEntity,
      ComponentType.CharacterController
    );

    const characterControlerB = Component.getComponentByType<CharacterControler2D>(
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