import { SpatialHash } from "../../core/algorithms/SpatialHash";
import { System } from "../../core/base/System";
import { ComponentGroup } from "../enums/ComponentGroup";
import type { Collider2D } from "./Collider2D";
import { CollisionPair2D } from "./CollisionPair2D";
import { CollisionResolver2D } from "./CollisionResolver2D";
import type { Contact2D } from "./SAT";

export class CollisionSystem2D extends System {
  private spatialHash = new SpatialHash<Collider2D>(64);
  private checked: Set<number> = new Set();

  private previousCollisions: Map<number, CollisionPair2D> = new Map();
  private currentCollisions: Map<number, CollisionPair2D> = new Map();

  fixedUpdate() {
    const colliders = this.engine.components.getAllByGroup<Collider2D>(ComponentGroup.Collider);
    this.prepareSpatialHash(colliders);
    this.runBroadphase();
  }

  private prepareSpatialHash(colliders: Collider2D[]) {
    this.spatialHash.clear();
    this.checked.clear();

    for (const collider of colliders) {
      if (!collider.enabled) continue;
      const bounds = collider.boundingBox;
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
    const pairs = this.getCollisionPairs();

    for (const pair of pairs) {
      const { a, b } = pair;

      const contacts: Contact2D[] = [];
      const collision = CollisionResolver2D.resolve(a, b, contacts);

      a.contacts = collision ? contacts : [];

      const isTrigger = a.isTrigger || b.isTrigger;
      const wasColliding = this.previousCollisions.has(pair.key);

      if (!wasColliding) {
        if (isTrigger) {
          this.engine.systems.callTriggerEnterEvents({ a, b });
        } else if (collision) {
          this.engine.systems.callCollisionEnterEvents({ a, b });
        }
      } else {
        if (isTrigger) {
          this.engine.systems.callTriggerStayEvents({ a, b });
        } else if (collision) {
          this.engine.systems.callCollisionStayEvents({ a, b, contacts });
        }
      }

      this.currentCollisions.set(pair.key, pair);
    }

    // Opcional: detectar colisões que terminaram (Exit)
    for (const key of this.previousCollisions.keys()) {
      if (!this.currentCollisions.has(key)) {
        const pair = this.previousCollisions.get(key)!;
        const { a, b } = pair;
        const isTrigger = a.isTrigger || b.isTrigger;
        if (isTrigger) {
          this.engine.systems.callTriggerExitEvents({ a, b });
        } else {
          this.engine.systems.callCollisionExitEvents({ a, b });
        }
      }
    }

    // Prepara para o próximo frame
    this.previousCollisions = new Map(this.currentCollisions);
    this.currentCollisions.clear();
  }

}
