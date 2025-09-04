import { SpatialHash } from "../../core/algorithms/SpatialHash";
import { System } from "../../core/base/System";
import { ComponentGroup } from "../enums/ComponentGroup";
import { ComponentType } from "../enums/ComponentType";
import { Collider2D } from "./Collider2D";
import { CollisionCorrector2D } from "./CollisionCorrector2D";
import { CollisionPair2D } from "./CollisionPair2D";
import { ResolveCollision2D as CollisionResolver2D } from "./CollisionResolver2D";
import type { RigidBody2D } from "./RigidBody2D";



export class Collision2DSystem extends System {
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
        const aRigid = this.engine.components.getComponent<RigidBody2D>(a.gameEntity, ComponentType.RigidBody2D);

        for (let j = i + 1; j < bucket.length; j++) {
          const b = bucket[j];
          const bRigid = this.engine.components.getComponent<RigidBody2D>(b.gameEntity, ComponentType.RigidBody2D);
          const pair = new CollisionPair2D(a, b, aRigid, bRigid);

          if (this.checked.has(pair.key)) continue;
          this.checked.add(pair.key);

          pairs.push(pair);
        }
      }
    }

    return pairs;
  }


  private runBroadphase() {
    const pairs = this.getCollisionPairs();

    for (const pair of pairs) {
      const a = pair.a;
      const b = pair.b;

      const resolution = CollisionResolver2D.getResolutionFactor(this.engine, a, b);
      if (resolution === null) continue;

      this.currentCollisions.set(pair.key, pair);

      CollisionCorrector2D.apply(pair, resolution);

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
}
