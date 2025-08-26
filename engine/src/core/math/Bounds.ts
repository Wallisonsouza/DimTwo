/* import { Mathf } from "./Mathf";
import type { Vec2 } from "./Vec2";

export class Bounds {
  left: number;
  right: number;
  top: number;
  bottom: number;

  constructor(
    left: number = 0,
    right: number = 0,
    top: number = 0,
    bottom: number = 0
  ) {
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
  }
}


export const EPSILON = 1e-4;
export function getBoundsCenterInto(bounds: Bounds, out: Vec2): void {
  out.x = (bounds.left + bounds.right) / 2;
  out.y = (bounds.top + bounds.bottom) / 2;
}

export function getBounds(pos: Vec2, size: Vec2): Bounds {
  const x = pos.x - size.x / 2;
  const y = pos.y - size.y / 2;

  return {
    left: x,
    right: x + size.x,
    top: y,
    bottom: y + size.y,
  };
}

export function getBoundsInto(
  pos: Vec2,
  size: Vec2,
  out: Bounds,
  normalize = false
): void {
  const x = pos.x - size.x / 2;
  const y = pos.y - size.y / 2;

  let left = x;
  let right = x + size.x;
  let top = y;
  let bottom = y + size.y;

  if (normalize) {
    if (left > right) [left, right] = [right, left];
    if (top > bottom) [top, bottom] = [bottom, top];
  }

  out.left = left;
  out.right = right;
  out.top = top;
  out.bottom = bottom;
}

export function distanceSq(a: Vec2, b: Vec2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

export function distance(a: Vec2, b: Vec2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}


export function getClosestPoint(bounds: Bounds, point: Vec2, out: Vec2): void {
  out.x = Mathf.clamp(point.x, bounds.left, bounds.right);
  out.y = Mathf.clamp(point.y, bounds.top, bounds.bottom);
}

export function getBoxOverlapInto(a: Bounds, b: Bounds, out: Vec2): void {
  out.x = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  out.y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
}

export function getSeparationDirection(aCenter: number, bCenter: number, overlap: number): number {
  return aCenter < bCenter ? -overlap : overlap;
} */