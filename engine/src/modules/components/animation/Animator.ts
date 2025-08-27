import type { Clonable } from "@engine/core/base/Clonable";
import { Component, type ComponentOptions } from "../../../core/base/Component";
import { Result } from "../../../core/managers/result";
import { ComponentGroup } from "../../enums/ComponentGroup";
import { ComponentType } from "../../enums/ComponentType";
import type { AnimationClip } from "../../resources/animation";
import type { SpriteRender } from "../render/SpriteRender";
import type { AnimatorController } from "./AnimatorController";
import type { AnimatorState } from "./AnimatorState";

export interface AnimatorOptions extends ComponentOptions {
  controller?: AnimatorController | null;
  currentClip?: AnimationClip | null;
  isPlaying?: boolean;
  time?: number;
  locked?: boolean;
  currentFrameIndex?: number;
  playbackSpeed?: number;
}

export class Animator extends Component implements Clonable<Animator> {
  controller: AnimatorController | null;
  currentClip: AnimationClip | null;
  isPlaying: boolean;
  time: number;
  locked: boolean;
  currentFrameIndex: number;
  playbackSpeed: number;

  constructor(options: AnimatorOptions = {}) {
    super(ComponentType.Animator, ComponentGroup.Animator, options);
    this.controller = options.controller ?? null;
    this.currentClip = options.currentClip ?? null;
    this.isPlaying = options.isPlaying ?? false;
    this.time = options.time ?? 0;
    this.locked = options.locked ?? false;
    this.currentFrameIndex = options.currentFrameIndex ?? 0;
    this.playbackSpeed = options.playbackSpeed ?? 1;
  }

  clone(): Animator {
    return new Animator({
      controller: this.controller,
      currentClip: this.currentClip,
      isPlaying: this.isPlaying,
      time: this.time,
      locked: this.locked,
      currentFrameIndex: this.currentFrameIndex,
      playbackSpeed: this.playbackSpeed,
    });
  }

  public startClip(clip: AnimationClip, lock: boolean) {
    this.currentClip = clip;
    this.currentFrameIndex = 0;
    this.time = 0;
    this.isPlaying = true;
    this.locked = lock;
  }

  public setAnimation(animationClip: AnimationClip, lock = false) {
    if (this.currentClip === animationClip || this.locked) return;
    this.startClip(animationClip, lock);
  }

  public setAnimatorState(newStateName: string, lock: boolean = false) {
    const controller = this.controller;
    if (!controller || this.locked || controller.currentState === newStateName) return;

    const newState = controller.states[newStateName];
    if (!newState) {
      console.warn(`AnimatorController: estado "${newStateName}" não encontrado.`);
      return;
    }

    controller.currentState = newStateName;
    this.startClip( newState.clip, lock);
  }


  public advanceFrame(
    state: AnimatorState,
    delta: number
  ) {
    const clip = state.clip;
    if (!clip) return;

    const frameDuration = 1 / clip.frameRate;
    this.time += delta * this.playbackSpeed;

    while (this.time >= frameDuration) {
      this.time -= frameDuration;
      this.currentFrameIndex++;

      if (this.currentFrameIndex >= clip.frames.length) {
        if (state.loop) {
          this.currentFrameIndex = 0;
        } else {
          this.currentFrameIndex = clip.frames.length - 1;
          this.isPlaying = false;
          this.locked = false;
          break;
        }
      }
    }
  }

  public updateSprite(state: AnimatorState, spriteRender: SpriteRender) {
    const animationClip = state.clip;
    if (!animationClip) return;

    const frameIndex = this.currentFrameIndex;
    if (frameIndex < 0 || frameIndex >= animationClip.frames.length) return;

    const frame = animationClip.frames[frameIndex];
    spriteRender.sprite = frame.sprite;
  }

  public getAnimatorState(): Result<AnimatorState> {
    const controller = this.controller;
    if (!controller) return Result.err("No controller assigned to animator.");

    const stateName = controller.currentState;
    if (!stateName) return Result.err("No current state set in controller.");

    const state = controller.states[stateName];
    if (!state) return Result.err(`State "${stateName}" not found in controller.`);

    return Result.ok(state);
  }
}
