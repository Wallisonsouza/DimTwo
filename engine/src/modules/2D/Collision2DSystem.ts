import { SpatialHash } from "../../core/algorithms/SpatialHash";
import { System } from "../../core/base/System";
import { ComponentGroup } from "../enums/ComponentGroup";
import { ComponentType } from "../enums/ComponentType";
import type { Collider2D } from "./Collider2D";
import { CollisionCorrector2D } from "./CollisionCorrector2D";
import { CollisionPair2D } from "./CollisionPair2D";
import { CollisionResolver2D } from "./CollisionResolver2D";
import type { RigidBody2D } from "./RigidBody2D";

export class Collision2DSystem extends System {
  private spatialHash = new SpatialHash<Collider2D>(64);
  private checked: Set<number> = new Set();

  private previousCollisions: Map<number, CollisionPair2D> = new Map();
  private currentCollisions: Map<number, CollisionPair2D> = new Map();

  fixedUpdate() {
    const colliders = this.engine.components.getAllByGroup<Collider2D>(ComponentGroup.Collider);
    this.prepareSpatialHash(colliders);
    this.runBroadphase(this.engine.time.fixedDeltaTime);

    // Triggers ou colisões que terminaram
    for (const [key, pair] of this.previousCollisions) {
      if (!this.currentCollisions.has(key)) {
        if (pair.a.isTrigger || pair.b.isTrigger) {
          this.engine.systems.callTriggerExitEvents({ a: pair.a, b: pair.b });
          continue;
        }

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

  private runBroadphase(deltaTime: number) {
    const pairs = this.getCollisionPairs();

    for (const pair of pairs) {
      const a = pair.a;
      const b = pair.b;

      const isTrigger = a.isTrigger || b.isTrigger;

      if (!this.previousCollisions.has(pair.key)) {
        if (isTrigger) {
          this.engine.systems.callTriggerEnterEvents({ a, b });
          continue;
        }

        a.isColliding = true;
        b.isColliding = true;
        this.engine.systems.callCollisionEnterEvents({ a, b });
      } else {
        if (isTrigger) {
          this.engine.systems.callTriggerStayEvents({ a, b });
          continue;
        }

        a.isColliding = true;
        b.isColliding = true;
        this.engine.systems.callCollisionStayEvents({ a, b });
      }

      this.currentCollisions.set(pair.key, pair);



      const resolution = CollisionResolver2D.getResolutionFactor(this.engine, a, b);
      if (!resolution) continue;

      CollisionCorrector2D.apply(pair, resolution, deltaTime);
    }
  }
}
