import type { AnimatorController } from "../../../engine/src/modules/shared/animator/AnimatorController";
import { SLIME_ANIMATIONS } from "./slime.animations";

export const SLIME_ANIMATOR_CONTROLLER: AnimatorController = {

  name: "slimeController",
  currentState: "idle",

  states: {
    idle: {
      clip: SLIME_ANIMATIONS.SLIME_IDLE_CLIP,
      loop: true,
    },
    move: {
      clip: SLIME_ANIMATIONS.SLIME_MOVE_CLIP,
      loop: true,
    },
    dead: {
      clip: SLIME_ANIMATIONS.SLIME_DEAD_CLIP,
      loop: false,
    },
  },
};
