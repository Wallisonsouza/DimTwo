import type { AnimationClip } from "../../resources/animation";

export interface AnimatorState {
  clip: AnimationClip;
  loop: boolean;
}
