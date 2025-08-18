import type { Sprite } from "../sprite/types.ts";

export interface AnimationFrame {
  sprite: Sprite;
  duration?: number;
}

export interface AnimationClip {
  name: string;
  frames: AnimationFrame[];
  frameRate: number; 
}
