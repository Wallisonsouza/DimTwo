import { createAnimationClip, type AnimationClip } from "../../../engine/src/modules/resources/animation";

const PLAYER_IDLE_DOWN_CLIP: AnimationClip = createAnimationClip(
  "idle",
  "player",
  6,
  0,
  1,
  32,
  32,
  12,
);

const PLAYER_WALK_UP_CLIP: AnimationClip = createAnimationClip(
  "walk_back",
  "player",
  6,
  0,
  96,
  32,
  32,
  8,
);

const PLAYER_WALK_SIDE_CLIP: AnimationClip = createAnimationClip(
  "walk_side",
  "player",
  6,
  0,
  128,
  32,
  32,
  8,
);

const PLAYER_WALK_DOWN_CLIP: AnimationClip = createAnimationClip(
  "walk_front",
  "player",
  6,
  0,
  160,
  32,
  32,
  8,
);

const PLAYER_ATTACK_DOWN_CLIP: AnimationClip = createAnimationClip(
  "attack_down",
  "player",
  4,
  0,
  192,
  32,
  32,
  16,
);

const PLAYER_ATTACK_UP_CLIP: AnimationClip = createAnimationClip(
  "attack_up",
  "player",
  4,
  0,
  256,
  32,
  32,
  16,
);

const PLAYER_ATTACK_SIDE_CLIP: AnimationClip = createAnimationClip(
  "attack_side",
  "player",
  4,
  0,
  224,
  32,
  32,
  16,
);

export const PLAYER_ANIMATIONS = {
  PLAYER_IDLE_DOWN_CLIP,
  PLAYER_WALK_UP_CLIP,
  PLAYER_WALK_SIDE_CLIP,
  PLAYER_WALK_DOWN_CLIP,
  PLAYER_ATTACK_DOWN_CLIP,
  PLAYER_ATTACK_UP_CLIP,
  PLAYER_ATTACK_SIDE_CLIP,
};
