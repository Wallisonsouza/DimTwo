import { Vec2 } from "@engine/core/math/Vec2";
import type { Engine } from "@engine/Engine";
import { ComponentType } from "../enums/ComponentType";
import { Bounds2D } from "./Bounds2D";
import { BoxCollider2D } from "./BoxCollider2D";
import type { Collider2D } from "./Collider2D";
import type { RigidBody2D } from "./RigidBody2D";

export interface CollisionResolution2D {
  penetration: Vec2;
  normal: Vec2;
  time: number;
}

export class CollisionResolver2D {

  public static getResolutionFactor(engine: Engine, a: Collider2D, b: Collider2D) {

    if (a instanceof BoxCollider2D && b instanceof BoxCollider2D) {
      return CollisionResolver2D.getBoxBoxCollision(engine, a, b);
    }

    return null;
  }

  public static getBoxBoxCollision(
    engine: Engine,
    a: BoxCollider2D,
    b: BoxCollider2D
  ): CollisionResolution2D | null {

    const aBounds = a.getBounds();
    const bBounds = b.getBounds();

    const aRigid = engine.components.getComponent<RigidBody2D>(a.gameEntity, ComponentType.RigidBody2D);
    const bRigid = engine.components.getComponent<RigidBody2D>(b.gameEntity, ComponentType.RigidBody2D);

    const aDelta = aRigid ? Vec2.scale(aRigid.linearVelocity, engine.time.deltaTime) : new Vec2(0, 0);
    const bDelta = bRigid ? Vec2.scale(bRigid.linearVelocity, engine.time.deltaTime) : new Vec2(0, 0);

    const t = Bounds2D.timeOfImpact(aBounds, aDelta, bBounds, bDelta);
    if (t === null) return null;

    const aStart = a.transform.position.cloneToVec2();
    const bStart = b.transform.position.cloneToVec2();
    const aEnd = Vec2.add(aStart, aDelta);
    const bEnd = Vec2.add(bStart, bDelta);

    const aBoundsAtContact = new Bounds2D(Vec2.lerp(aStart, aEnd, t), aBounds.size);
    const bBoundsAtContact = new Bounds2D(Vec2.lerp(bStart, bEnd, t), bBounds.size);

    const overlapX = Math.min(aBoundsAtContact.max.x, bBoundsAtContact.max.x) -
      Math.max(aBoundsAtContact.min.x, bBoundsAtContact.min.x);
    const overlapY = Math.min(aBoundsAtContact.max.y, bBoundsAtContact.max.y) -
      Math.max(aBoundsAtContact.min.y, bBoundsAtContact.min.y);

    if (overlapX <= 0 || overlapY <= 0) return null;

    let penetration: Vec2;
    let normal: Vec2;

    if (overlapX < overlapY) {
      penetration = new Vec2(aBoundsAtContact.min.x < bBoundsAtContact.min.x ? -overlapX : overlapX, 0);
      normal = new Vec2(Math.sign(penetration.x), 0);
    } else {
      penetration = new Vec2(0, aBoundsAtContact.min.y < bBoundsAtContact.min.y ? -overlapY : overlapY);
      normal = new Vec2(0, Math.sign(penetration.y));
    }

    return { penetration, normal, time: t };
  }
}
