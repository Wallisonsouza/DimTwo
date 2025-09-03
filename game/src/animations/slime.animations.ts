import { createAnimationClip, type AnimationClip } from "../../../engine/src/modules/resources/animation";

const SLIME_IDLE_CLIP: AnimationClip = createAnimationClip(
    "idle",
    "slime",
    4,
    0,
    0,
    32,
    32,
    12,
  );

const SLIME_MOVE_CLIP: AnimationClip = createAnimationClip(
    "move",
    "slime",
    6,
    0,
    32,
    32,
    32,
    12,
  );

const SLIME_DEAD_CLIP: AnimationClip = createAnimationClip(
    "dead",
    "slime",
    5,
    0,
    64,
    32,
    32,
    12,
  );

export const SLIME_ANIMATIONS = {
  SLIME_IDLE_CLIP,
  SLIME_MOVE_CLIP,
  SLIME_DEAD_CLIP,
};