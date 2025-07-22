import type { Component } from "../../../base/Component";
import type { AnimationClip } from "../../../resources/animation";

export interface AnimatorType extends Component {
  controller: AnimatorController | null;
  currentClip: AnimationClip | null;
  isPlaying: boolean;
  time: number;
  locked: boolean;
  currentFrameIndex: number;
  playbackSpeed: number;
}

export interface AnimatorState {
  clip: AnimationClip;
  loop: boolean;
}


export interface AnimatorController {
  name: string;
  currentState: string | null;
  states: Record<string, AnimatorState>;
  syncCollider?: boolean;
}

