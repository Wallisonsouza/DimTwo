import { Vec2 } from "@engine/core/math/Vec2";
import { RigidBody2D } from "@engine/modules/2D/RigidBody2D";
import { ComponentType } from "@engine/modules/enums/ComponentType";
import { SpatialHash } from "../../core/algorithms/SpatialHash";
import { System } from "../../core/base/System";
import { ComponentGroup } from "../enums/ComponentGroup";
import type { Bounds2D } from "./Bounds2D";
import { BoxCollider2D } from "./BoxCollider2D";
import { Collider2D } from "./Collider2D";
import { CollisionPair2D } from "./CollisionPair2D";



function TOIBoxBounds(a: Bounds2D, aDelta: Vec2, b: Bounds2D, bDelta: Vec2): number | null {
  let tEnter = 0;
  let tExit = 1;

  const vRelX = aDelta.x - bDelta.x;
  if (vRelX === 0) {
    if (a.max.x < b.min.x || b.max.x < a.min.x) return null;
  } else {
    const t1x = (b.min.x - a.max.x) / vRelX;
    const t2x = (b.max.x - a.min.x) / vRelX;
    tEnter = Math.max(tEnter, Math.min(t1x, t2x));
    tExit = Math.min(tExit, Math.max(t1x, t2x));
    if (tEnter > tExit || tExit < 0 || tEnter > 1) return null;
  }

  const vRelY = aDelta.y - bDelta.y;
  if (vRelY === 0) {
    if (a.max.y < b.min.y || b.max.y < a.min.y) return null;
  } else {
    const t1y = (b.min.y - a.max.y) / vRelY;
    const t2y = (b.max.y - a.min.y) / vRelY;
    tEnter = Math.max(tEnter, Math.min(t1y, t2y));
    tExit = Math.min(tExit, Math.max(t1y, t2y));
    if (tEnter > tExit || tExit < 0 || tEnter > 1) return null;
  }

  return tEnter >= 0 && tEnter <= 1 ? tEnter : null;
}

export class Collider2DSystem extends System {
  spatialHash = new SpatialHash<Collider2D>(64);
  checked: Set<number> = new Set();

  private previousCollisions: Map<number, CollisionPair2D> = new Map();
  private currentCollisions: Map<number, CollisionPair2D> = new Map();

  fixedUpdate() {
    const components = this.engine.components;
    const colliders = components.getAllByGroup<Collider2D>(ComponentGroup.Collider);

    this.prepareSpatialHash(colliders);
    this.runBroadphase();


    for (const [key, pair] of this.previousCollisions) {
      if (!this.currentCollisions.has(key)) {
        pair.a.isColliding = false;
        pair.b.isColliding = false;
        this.engine.systems.callCollisionExitEvents({ a: pair.a, b: pair.b });
      }
    }

    this.previousCollisions = new Map(this.currentCollisions);
    this.currentCollisions.clear();
  }

  private prepareSpatialHash(colliders: Collider2D[]) {
    this.spatialHash.clear();
    this.checked.clear();

    for (const collider of colliders) {
      if (!collider.enabled) continue;
      const bounds = collider.getBounds();
      this.spatialHash.insert(bounds.min, bounds.max, collider);
    }
  }

  private getCollisionPairs(): CollisionPair2D[] {
    const pairs: CollisionPair2D[] = [];

    for (const bucket of this.spatialHash.getBuckets()) {
      for (let i = 0; i < bucket.length; i++) {
        const a = bucket[i];

        for (let j = i + 1; j < bucket.length; j++) {
          const b = bucket[j];

          const pair = new CollisionPair2D(a, b);

          if (this.checked.has(pair.key)) continue;
          this.checked.add(pair.key);

          pairs.push(pair);
        }
      }
    }

    return pairs;
  }


  private runBroadphase() {
    const contacts: CollisionPair2D[] = [];
    const pairs = this.getCollisionPairs();

    for (const pair of pairs) {
      const a = pair.a;
      const b = pair.b;

      if (a instanceof BoxCollider2D && b instanceof BoxCollider2D) {
        const aRigid = this.engine.components.getComponent<RigidBody2D>(a.gameEntity, ComponentType.RigidBody2D);
        const bRigid = this.engine.components.getComponent<RigidBody2D>(b.gameEntity, ComponentType.RigidBody2D);

        const aDelta = aRigid ? Vec2.scale(aRigid.velocity, this.engine.time.deltaTime) : new Vec2(0, 0);
        const bDelta = bRigid ? Vec2.scale(bRigid.velocity, this.engine.time.deltaTime) : new Vec2(0, 0);

        const aBounds = a.getBounds();
        const bBounds = b.getBounds();

        const t = TOIBoxBounds(aBounds, aDelta, bBounds, bDelta);
        if (t === null) continue;

        pair.setTOI(t);

        const aStart = a.transform.position.cloneToVec2();
        const bStart = b.transform.position.cloneToVec2();
        const aEnd = Vec2.add(aStart, aDelta);
        const bEnd = Vec2.add(bStart, bDelta);

        const aBoundsAtContact = aBounds.getBoundAt(Vec2.lerp(aStart, aEnd, t));
        const bBoundsAtContact = bBounds.getBoundAt(Vec2.lerp(bStart, bEnd, t));

        pair.setResolution(a.getResolution(aBoundsAtContact, bBoundsAtContact));

        contacts.push(pair);

        this.currentCollisions.set(pair.key, pair);

        if (!this.previousCollisions.has(pair.key)) {
          a.isColliding = true;
          b.isColliding = true;
          this.engine.systems.callCollisionEnterEvents({ a: a, b: b });
        } else {
          a.isColliding = true;
          b.isColliding = true;
          this.engine.systems.callCollisionStayEvents({ a: a, b: b });
        }
      }
    }

    for (const pair of contacts) {
      const aRigid = this.engine.components.getComponent<RigidBody2D>(pair.a.gameEntity, ComponentType.RigidBody2D);
      const bRigid = this.engine.components.getComponent<RigidBody2D>(pair.b.gameEntity, ComponentType.RigidBody2D);

      RigidBody2D.resolveRigidBody(aRigid, pair.a.transform, bRigid, pair.b.transform, pair.resolution!);
    }
  }
}
