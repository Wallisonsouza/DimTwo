import { System } from "../../core/base/System";
import type { SpriteRender } from "../2D/SpriteRender";
import { Animator } from "../components/animation/Animator";
import { ComponentType } from "../enums/ComponentType";

export class AnimatorSystem extends System {

  lateUpdate(dt: number) {
    const scene = this.getScene();
    const components = scene.components;

    const animators = components.getAllOfType<Animator>(ComponentType.Animator);

    for (const animator of animators) {
      if (!animator.enabled || !animator.controller) continue;

      const spriteRender = components.getComponent<SpriteRender>(animator.gameEntity.id.getValue(), ComponentType.SpriteRender);
      if (!spriteRender) continue;

      const result = animator.getAnimatorState();

      if (!result.ok) {
        console.warn("Animator state error:", result.error);
        continue;
      }

      const state = result.value;

      animator.advanceFrame(state, dt);
      animator.updateSprite(state, spriteRender);

    }
  }
}