import { Sprite2D } from "../../2D/Sprite2D";
import { Vec2 } from "../../2D/Vec2";
import type { AnimationClip, AnimationFrame } from "./animation.types";

export function createAnimationClip(
  name: string,
  texture: string,
  frameCount: number,
  startX: number,
  startY: number,
  frameWidth: number,
  frameHeight: number,
  frameRate: number = 12,
  frameSpacing: number = 0,
): AnimationClip {
  const frames = [];

  for (let i = 0; i < frameCount; i++) {
    const frame: AnimationFrame = {
      sprite: new Sprite2D({
        meshID: "quad_mesh",
        textureID: texture,
        position: new Vec2(startX + i * (frameWidth + frameSpacing), startY),
        size: new Vec2(frameWidth, frameHeight),
        origin: new Vec2(0, 0),

      }),
    };

    frames.push(frame);
  }

  return {
    name,
    frames,
    frameRate,
  };
}
