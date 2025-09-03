import type { AnimatorController } from "@engine/modules/shared/animator/AnimatorController";
import { PLAYER_ANIMATIONS } from "./player.animation";


export const PLAYER_ANIMATOR_CONTROLLER: AnimatorController = {

  name: "playerController",
  currentState: "idle",

  states: {
    idle: {
      clip: PLAYER_ANIMATIONS.PLAYER_IDLE_DOWN_CLIP,
      loop: true
    },
    walk_front: {
      clip: PLAYER_ANIMATIONS.PLAYER_WALK_DOWN_CLIP,
      loop: true
    },
    walk_back: {
      clip: PLAYER_ANIMATIONS.PLAYER_WALK_UP_CLIP,
      loop: true
    },
    walk_side: {
      clip: PLAYER_ANIMATIONS.PLAYER_WALK_SIDE_CLIP,
      loop: true
    },
    attack_down: {
      clip: PLAYER_ANIMATIONS.PLAYER_ATTACK_DOWN_CLIP,
      loop: false
    },
    attack_up: {
      clip: PLAYER_ANIMATIONS.PLAYER_ATTACK_UP_CLIP,
      loop: false
    },
    attack_side: {
      clip: PLAYER_ANIMATIONS.PLAYER_ATTACK_SIDE_CLIP,
      loop: false
    },
  }
};