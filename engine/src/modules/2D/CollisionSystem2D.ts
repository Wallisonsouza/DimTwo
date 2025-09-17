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

    // Triggers ou colisões que terminaram
    for (const [key, pair] of this.previousCollisions) {
      if (!this.currentCollisions.has(key)) {
        if (pair.a.isTrigger || pair.b.isTrigger) {
          this.engine.systems.callTriggerExitEvents({ a: pair.a, b: pair.b });
          continue;
        }
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
      a.contacts = contacts;
      if (!collision) { continue }






      // Determina se algum dos objetos é um "trigger"
      // Triggers não afetam a física, apenas disparam eventos
      const isTrigger = a.isTrigger || b.isTrigger;

      // 1️⃣ Colisão nova (não existia no frame anterior)
      if (!this.previousCollisions.has(pair.key)) {

        if (isTrigger) {
          // 1a️⃣ Trigger novo: dispara evento "Enter" e segue para o próximo par
          this.engine.systems.callTriggerEnterEvents({ a, b });
          continue;
        }

        // 1b️⃣ Colisão física nova: dispara evento "CollisionEnter"
        this.engine.systems.callCollisionEnterEvents({ a, b, contacts });
      } else {
        // 2️⃣ Colisão existente (já estava ocorrendo no frame anterior)

        if (isTrigger) {
          // 2a️⃣ Trigger contínuo: dispara evento "Stay"
          this.engine.systems.callTriggerStayEvents({ a, b });
          continue;
        }

        // 2b️⃣ Colisão física contínua: dispara evento "CollisionStay"
        this.engine.systems.callCollisionStayEvents({ a, b, contacts });
      }

      // 3️⃣ Marca o par como atualmente colidindo neste frame
      this.currentCollisions.set(pair.key, pair);
    }
  }

}
