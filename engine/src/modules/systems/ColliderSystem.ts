import type { Scene } from "@engine/core/scene/scene";
import { Vec2 } from "@engine/modules/2D/Vec2";
import { EasyGetter } from "@game/systems/TerrainSystem";
import { SpatialHash } from "../../core/algorithms/SpatialHash";
import { System } from "../../core/base/System";
import { Collider2D } from "../2D/Collider2D";
import { ComponentGroup } from "../enums/ComponentGroup";
import { Physics } from "./Physics";

function makePairKeyInt(idA: number, idB: number): number {
  const min = idA < idB ? idA : idB;
  const max = idA ^ idB ^ min;
  return (min << 32) | max;
}


export class ColliderSystem extends System {
  spatialHash = new SpatialHash<Collider2D>(64);
  checked: Set<number> = new Set();
  private positionCache: Map<number, Vec2> = new Map();

  fixedUpdate() {
    const scene = this.getScene();
    const colliders = EasyGetter.getAllByGroup<Collider2D>(scene, ComponentGroup.Collider);

    this.prepareSpatialHash(colliders);
    this.runBroadphase(scene);
  }

  private prepareSpatialHash(colliders: Collider2D[]) {
    this.spatialHash.clear();
    this.checked.clear();

    for (const collider of colliders) {
      if (!collider.enabled) continue;
      this.spatialHash.insert(collider.bounds.min, collider.bounds.max, collider);
    }
  }

  private runBroadphase(scene: Scene) {
    for (const bucket of this.spatialHash.getBuckets()) {
      this.checkBucketPairs(bucket, scene);
    }
  }

  private checkBucketPairs(bucket: Collider2D[], scene: Scene) {


    for (let i = 0; i < bucket.length; i++) {
      const a = bucket[i];
      const aId = a.id.getValue();
      const aEntity = EasyGetter.getEntity(scene, a);
      if (!aEntity) continue;

      for (let j = i + 1; j < bucket.length; j++) {
        const b = bucket[j];

        if (!Physics.collisionMatrix.canCollide(a.collisionLayer, b.collisionLayer)) {
          console.log("nao pode colidir", a.collisionLayer, b.collisionLayer)
          continue;
        }

        const bId = b.id.getValue();
        const key = makePairKeyInt(aId, bId);
        if (this.checked.has(key)) continue;
        this.checked.add(key);

        const bEntity = EasyGetter.getEntity(scene, b);
        if (!bEntity) continue;

        if (a.intersects(b)) {
          a.isColliding = true;
          return;
        }

        a.isColliding = false;
      }
    }
  }
}






















/*   previous: Map<string, CollisionPair> = new Map();
    collision: Set<string> = new Set();
  current: Map<string, CollisionPair> = new Map(); */
/*  collisionState.current.clear();
   collisionState.checked.clear();
   collisionState.collision.clear();
   spatialHash.clear();
 

/* function detectCollisions(
  components: ECSComponent,
  spatialHash: SpatialHash<Collider>,
  collisionState: CollisionState,
  systems: ECSSystem,
) {
  const scene =SceneManager.getCurrentScene();

  for (const collidersInCell of spatialHash.getBuckets()) {
    const length = collidersInCell.length;

    for (let i = 0; i < length; i++) {
      const colliderA = collidersInCell[i];
      const aTransform = Transform.getTransform(colliderA.getEntityID());
      if (!aTransform) continue;

      for (let j = i + 1; j < length; j++) {
        const colliderB = collidersInCell[j];
        if (colliderA.getEntityID().id === colliderB.getEntityID().id) continue;

        if (

          !scene.collisionMatrix.canCollide(
            colliderA.collisionMask,
            colliderB.collisionMask,
          )
        ) continue;

        const bTransform = Transform.getTransform(colliderB.getEntityID());
        if (!bTransform) continue;

        const pairKey = makePairKey(colliderA.instanceID.getValue(), colliderB.instanceID.getValue());

        if (collisionState.checked.has(pairKey)) continue;
        collisionState.checked.add(pairKey);

        if (!testOverlap(aTransform.position, colliderA, bTransform.position, colliderB)) {
          continue;
        }

        collisionState.current.set(pairKey, { a: colliderA, b: colliderB });

        collisionState.collision.add(colliderA.instanceID.toString());
        collisionState.collision.add(colliderB.instanceID.toString());

        const wasColliding = collisionState.previous.has(pairKey);

        const aIsTrigger = colliderA.isTrigger;
        const bIsTrigger = colliderB.isTrigger;
        const isTriggerInteraction = aIsTrigger || bIsTrigger;

        if (isTriggerInteraction) {
          if (!wasColliding) {
            systems.callTriggerEnterEvents({
              a: colliderA,
              b: colliderB,
            });
          }
          systems.callTriggerStayEvents({
            a: colliderA,
            b: colliderB,
          });
          colliderA.isColliding = true;
          colliderB.isColliding = true;
          continue;
        }

        if (!wasColliding) {
          systems.callCollisionEnterEvents({
            a: colliderA,
            b: colliderB,
          });
        }

        systems.callCollisionStayEvents({
          a: colliderA,
          b: colliderB,
        });
        colliderA.isColliding = true;
        colliderB.isColliding = true;

        const resolution = resolveOverlap(
          aTransform.position,
          colliderA,
          bTransform.position,
          colliderB,
        );

        if (resolution) {

          const aRigid = components.getComponent<RigidBody2D>(
            colliderA.getEntityID(),
            ComponentType.RigidBody2D,
          );

          const bRigid = components.getComponent<RigidBody2D>(
            colliderB.getEntityID(),
            ComponentType.RigidBody2D,
          );

          if (!aRigid || !bRigid) return;

          RigidBody2D.resolveRigidBody(
            aRigid,
            aTransform,
            bRigid,
            bTransform,
            resolution,
          );
        }
      }
    }
  }

  for (const [pairKey, pair] of collisionState.previous.entries()) {
    if (!collisionState.current.has(pairKey)) {
      if (pair.a.isTrigger || pair.b.isTrigger) {
        systems.callTriggerExitEvents(pair);
        pair.a.isColliding = false;
        pair.b.isColliding = false;
      } else {
        pair.a.isColliding = false;
        pair.b.isColliding = false;
        systems.callCollisionExitEvents(pair);
      }
    }
  }

  collisionState.previous.clear();
  for (const [pairKey, pair] of collisionState.current.entries()) {
    collisionState.previous.set(pairKey, pair);
  }
}
 */