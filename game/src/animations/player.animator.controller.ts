import type { AnimatorController } from "@engine/modules/shared/animator/AnimatorController";
import { KnightAttack1, KnightDefend, KnightIdle, KnightJump, KnightRun, KnightWalk } from "./KnightAnimations";


export const PLAYER_ANIMATOR_CONTROLLER: AnimatorController = {

  name: "playerController",
  currentState: "idle",

  states: {
    idle: {
      clip: KnightIdle,
      loop: true
    },
    walk: {
      clip: KnightWalk,
      loop: true
    },
    jump: {
      clip: KnightJump,
      loop: false
    },
    run: {
      clip: KnightRun,
      loop: true
    },
    defend: {
      clip: KnightDefend,
      loop: false
    },

    attack1: {
      clip: KnightAttack1,
      loop: false
    }
  }

};