import { Time } from "@engine/core/time/Time";
import { System } from "../../../core/base/System";
import type { SpriteRender2D } from "../../2D/SpriteRender2D";
import { ComponentType } from "../../enums/ComponentType";
import { Animator } from "./Animator";
import type { AnimatorState } from "./AnimatorState";
import { Scene } from "@engine/core/scene/scene";

export class AnimatorSystem extends System {

  lateUpdate() {
    const scene = Scene.getLoadedScene();
    const components = scene.components;

    const animators = components.getAllOfType<Animator>(ComponentType.Animator);

    for (const animator of animators) {
      if (!animator.enabled || !animator.controller) continue;

      const spriteRender = components.getComponent<SpriteRender2D>(animator.gameEntity, ComponentType.SpriteRender);
      if (!spriteRender) continue;

      const result = animator.getAnimatorState();

      if (!result.ok) {
        console.warn("Animator state error:", result.error);
        continue;
      }

      const state = result.value;

      animator.advanceFrame(state, Time.deltaTime);
      updateSprite(animator, state, spriteRender);

    }
  }
}

function updateSprite(animator: Animator, state: AnimatorState, spriteRender: SpriteRender2D) {
  const animationClip = state.clip;
  if (!animationClip) return;

  const frameIndex = animator.currentFrameIndex;
  if (frameIndex < 0 || frameIndex >= animationClip.frames.length) return;

  const frame = animationClip.frames[frameIndex];
  spriteRender.sprite = frame.sprite;
}