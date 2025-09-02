import { System } from "@engine/core/base/System";
import { KeyCode } from "@engine/core/input/KeyCode";
import type { SpriteRender2D } from "@engine/modules/2D/SpriteRender2D";
import { ComponentType } from "@engine/modules/enums/ComponentType";
import type { Animator } from "@engine/modules/shared/animator/Animator";
import { CharacterControler2D } from "./character.controller.types";


export class CharacterControllerAnimationSystem extends System {

  lateUpdate() {

    const input = this.engine.input;

    const scene = this.getScene();
    const components = scene.components;

    const characterControlers = components.getAllOfType<CharacterControler2D>(ComponentType.CharacterController);

    for (const characterControler of characterControlers) {

      const entity = characterControler.gameEntity;

      const spriteRender = components.getComponent<SpriteRender2D>(
        entity,
        ComponentType.SpriteRender
      );
      if (!spriteRender) continue;

      const animator = components.getComponent<Animator>(
        entity,
        ComponentType.Animator
      );
      if (!animator) continue;

      animator.playbackSpeed = input.getKey(KeyCode.ShiftLeft) ? 1.5 : 1.0;

      const dir = characterControler.direction;

      if (characterControler.direction.x < 0) spriteRender.flipHorizontal = true;
      else if (characterControler.direction.x > 0) spriteRender.flipHorizontal = false;

      if (dir.x !== 0 || dir.y !== 0) {
        if (dir.x !== 0) {
          animator.setAnimatorState("walk_side");
        } else if (dir.y < 0) {
          animator.setAnimatorState("walk_back");
        } else if (dir.y > 0) {
          animator.setAnimatorState("walk_front");

        }
      } else {
        animator.setAnimatorState("idle");
      }
    }
  }
}




