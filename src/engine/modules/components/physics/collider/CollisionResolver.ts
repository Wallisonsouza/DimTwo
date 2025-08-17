/* 
import { getBounds, type Bounds } from "../../../../core/math/geometry/Bounds";
import { Vec2 } from "../../../../core/math/Vec2";
import { Vec3 } from "../../../../core/math/Vec3";
import { ComponentType } from "../../../enums/ComponentType";
import { Transform } from "../../spatial/Transform";
import { BoxCollider2D } from "../BoxCollider2D";
import { CircleCollider2D } from "../CircleCollider2D";


import { isOfType } from "./isOfType";
import type { Collider } from "./types";

export interface CollisionResolution {
  dx: number;
  dy: number;
}

const tempSizeA = new Vec3(0, 0, 0);
const tempSizeB = new Vec3(0, 0, 0);

const tempAddA = new Vec2(0, 0);
const tempAddB = new Vec2(0, 0);

function getEffectiveRadius(radius: number, scale: Vec3): number {
  return radius * Math.max(scale.x, scale.y);
}

export function resolveOverlap(aPos: Vec2, a: Collider, bPos: Vec2, b: Collider): Vec2 | null {
  const aTransform = Transform.getTransform(a.getEntityID());
  const bTransform = Transform.getTransform(b.getEntityID());
  if (!aTransform || !bTransform) return null;

  Vec2.add(aPos, a.center, tempAddA);
  Vec2.add(bPos, b.center, tempAddB);

  const isABox = isOfType<BoxCollider2D>(a, ComponentType.BoxCollider2D);
  const isBBox = isOfType<BoxCollider2D>(b, ComponentType.BoxCollider2D);
  const isACircle = isOfType<CircleCollider2D>(a, ComponentType.CircleCollider2D);
  const isBCircle = isOfType<CircleCollider2D>(b, ComponentType.CircleCollider2D);

  if (isABox && isBBox) {
    Vec3.mult(tempSizeA, aTransform.scale, a.size);
    Vec3.mult(tempSizeB, bTransform.scale, b.size);

    const aBounds: Bounds = getBounds(tempAddA, tempSizeA);
    const bBounds: Bounds = getBounds(tempAddB, tempSizeB);

    return BoxCollider2D.resolveBoxBoxOverlap(aBounds, bBounds);
  }

  if (isACircle && isBBox) {
    const effectiveRadius = getEffectiveRadius(a.radius, aTransform.scale);

    Vec3.mult(tempSizeB, bTransform.scale, b.size);
    const bBounds: Bounds = getBounds(tempAddB, tempSizeB);

    return CircleCollider2D.resolveCircleBoxOverlap(tempAddA, effectiveRadius, bBounds);
  }

  // Opcional: já deixar espaço preparado para Circle vs Circle ou Box vs Circle
  if (isACircle && isBCircle) {
    const aRadius = getEffectiveRadius(a.radius, aTransform.scale);
    const bRadius = getEffectiveRadius(b.radius, bTransform.scale);

    return CircleCollider2D.resolveCircleCircleOverlap(tempAddA, aRadius, tempAddB, bRadius);
  }

  if (isABox && isBCircle) {
    const effectiveRadius = getEffectiveRadius(b.radius, bTransform.scale);

    Vec3.mult(tempSizeA, aTransform.scale, a.size);
    const aBounds: Bounds = getBounds(tempAddA, tempSizeA);

    return BoxCollider2D.resolveBoxCircleOverlap(aBounds, tempAddB, effectiveRadius);
  }

  return null;
}
 */