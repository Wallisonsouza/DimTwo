import type { Sprite2D } from "../../2D/Sprite2D.ts";

export interface AnimationFrame {
  sprite: Sprite2D;
}

export interface AnimationFrame2D {
  duration?: number;
}



export interface AnimationClip {
  name: string;
  frames: AnimationFrame[];
  frameRate: number; 
}
