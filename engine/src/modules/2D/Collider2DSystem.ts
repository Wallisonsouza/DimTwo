import { Vec2 } from "@engine/core/math/Vec2";
import { BoxCollider2D } from "@engine/modules/2D/BoxCollider2D";
import { RigidBody2D } from "@engine/modules/2D/RigidBody2D";
import { ComponentType } from "@engine/modules/enums/ComponentType";
import { SpatialHash } from "../../core/algorithms/SpatialHash";
import { System } from "../../core/base/System";
import { ComponentGroup } from "../enums/ComponentGroup";
import { Collider2D } from "./Collider2D";

function makePairKeyInt(idA: number, idB: number): number {
  const a = idA < idB ? idA : idB;
  const b = idA < idB ? idB : idA;
  return ((a + b) * (a + b + 1)) / 2 + b;
}

export class Collider2DSystem extends System {
  spatialHash = new SpatialHash<Collider2D>(64);
  checked: Set<number> = new Set();

  // Guardar colisões do frame anterior e do frame atual
  private previousCollisions: Map<number, { a: Collider2D; b: Collider2D }> = new Map();
  private currentCollisions: Map<number, { a: Collider2D; b: Collider2D }> = new Map();

  fixedUpdate() {
    const components = this.engine.components;
    const colliders = components.getAllByGroup<Collider2D>(ComponentGroup.Collider);

    this.prepareSpatialHash(colliders);
    this.runBroadphase();

    // Detecta EXIT
    for (const [key, { a, b }] of this.previousCollisions) {
      if (!this.currentCollisions.has(key)) {
        a.isColliding = false;
        b.isColliding = false;
        this.engine.systems.callCollisionExitEvents({ a, b });
      }
    }

    // Atualiza histórico
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

  private runBroadphase() {
    const contacts: {
      a: Collider2D;
      b: Collider2D;
      resolution: Vec2;
    }[] = [];

    for (const bucket of this.spatialHash.getBuckets()) {
      for (let i = 0; i < bucket.length; i++) {
        const a = bucket[i];
        const aId = a.id.getValue();

        for (let j = i + 1; j < bucket.length; j++) {
          const b = bucket[j];
          const bId = b.id.getValue();

          const key = makePairKeyInt(aId, bId);
          if (this.checked.has(key)) continue;
          this.checked.add(key);

          if (!(a instanceof BoxCollider2D && b instanceof BoxCollider2D)) continue;

          const aRigid = this.engine.components.getComponent<RigidBody2D>(
            a.gameEntity,
            ComponentType.RigidBody2D
          );
          const bRigid = this.engine.components.getComponent<RigidBody2D>(
            b.gameEntity,
            ComponentType.RigidBody2D
          );

          const aStart = Vec2.fromVec3(a.transform.position.clone());
          const bStart = Vec2.fromVec3(b.transform.position.clone());

          const aDelta = aRigid
            ? Vec2.scale(aRigid.velocity, this.engine.time.deltaTime)
            : new Vec2(0, 0);
          const bDelta = bRigid
            ? Vec2.scale(bRigid.velocity, this.engine.time.deltaTime)
            : new Vec2(0, 0);

          const aEnd = Vec2.add(aStart, aDelta);
          const bEnd = Vec2.add(bStart, bDelta);

          /*   // Swept AABB check
            const aSwept = a.getSweptBounds(aStart, aEnd);
            const bSwept = b.getSweptBounds(bStart, bEnd);
            if (!aSwept.intersects(bSwept)) continue; */

          // Passos finos
          const relativeDelta = Vec2.sub(aDelta, bDelta);
          const distance = Math.sqrt(relativeDelta.x ** 2 + relativeDelta.y ** 2);

          const aBounds = a.getBounds();
          const bBounds = b.getBounds();
          const minSize = Math.min(
            aBounds.max.x - aBounds.min.x,
            aBounds.max.y - aBounds.min.y,
            bBounds.max.x - bBounds.min.x,
            bBounds.max.y - bBounds.min.y
          );

          const steps = Math.max(1, Math.ceil(distance / (minSize * 0.2)));

          let contactA: Vec2 | null = null;
          let contactB: Vec2 | null = null;

          for (let s = 1; s <= steps; s++) {
            const t = s / steps;
            const aPos = Vec2.lerp(aStart, aEnd, t);
            const bPos = Vec2.lerp(bStart, bEnd, t);

            if (a.getBoundsAt(aPos).intersects(b.getBoundsAt(bPos))) {
              contactA = aPos;
              contactB = bPos;
              break;
            }
          }

          if (contactA && contactB) {
            const aBoundsAtContact = a.getBoundsAt(contactA);
            const bBoundsAtContact = b.getBoundsAt(contactB);

            const resolution = a.getResolution(aBoundsAtContact, bBoundsAtContact);
            contacts.push({ a, b, resolution });

            // Marca colisão atual
            this.currentCollisions.set(key, { a, b });

            if (!this.previousCollisions.has(key)) {
              a.isColliding = true;
              b.isColliding = true;
              this.engine.systems.callCollisionEnterEvents({ a, b });
            } else {
              a.isColliding = true;
              b.isColliding = true;
              this.engine.systems.callCollisionStayEvents({ a, b });
            }
          }
        }
      }
    }


    /// me atentar aqui, posso mudar para physics

    // Resolve colisões
    for (const { a, b, resolution } of contacts) {
      const aRigid = this.engine.components.getComponent<RigidBody2D>(
        a.gameEntity,
        ComponentType.RigidBody2D
      );
      const bRigid = this.engine.components.getComponent<RigidBody2D>(
        b.gameEntity,
        ComponentType.RigidBody2D
      );

      RigidBody2D.resolveRigidBody(aRigid, a.transform, bRigid, b.transform, resolution);
    }
  }
}
