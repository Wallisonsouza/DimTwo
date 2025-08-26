import { EasyGetter } from "@game/systems/TerrainSystem";
import { SpatialHash } from "../../core/algorithms/spatialHash/SpatialHash";
import { System } from "../../core/base/System";
import { Collider2D } from "../components/physics/collider/Collider2D";
import { ComponentGroup } from "../enums/ComponentGroup";

// Util
function makePairKey(id1: number, id2: number): string {
  return id1 < id2 ? `${id1}::${id2}` : `${id2}::${id1}`;
}

interface CollisionPair {
  a: Collider2D;
  b: Collider2D;
}

export class ColliderSystem extends System {

  spatialHash = new SpatialHash<Collider2D>(64);
  previous: Map<string, CollisionPair> = new Map();
  current: Map<string, CollisionPair> = new Map();
  checked: Set<string> = new Set()
  collision: Set<string> = new Set();

  fixedUpdate() {

    const scene = this.getScene();
    const colliders = EasyGetter.getAllByGroup<Collider2D>(scene, ComponentGroup.Collider);

    for (let i = 0; i < colliders.length; i++) {
      const a = colliders[i];

      const aEntity = EasyGetter.getEntity(scene, a);
      if (!aEntity) continue;

      const aTransform = EasyGetter.getTransform(scene, aEntity);
      if (!aTransform) continue;

      if (!aEntity.static) a.updateBounds(aTransform.position);

      for (let j = i + 1; j < colliders.length; j++) {
        const b = colliders[j];

        const bEntity = EasyGetter.getEntity(scene, b);
        if (!bEntity) continue;

        const bTransform = EasyGetter.getTransform(scene, bEntity);
        if (!bTransform) continue;

        if (!bEntity.static) b.updateBounds(bTransform.position);


        if (a.intersects(b)) {
          console.log("Colisão detectada:", a, b);
        }
      }
    }



    /*  collisionState.current.clear();
     collisionState.checked.clear();
     collisionState.collision.clear();
     spatialHash.clear();
 
     const colliders = components.getComponentsByCategory<Collider>(
       ComponentType.Collider,
     );
 
     for (const collider of colliders) {
       if (!collider.enabled) continue;
 
       const transform = components.getComponent<Transform>(
         collider.getGameEntity(),
         ComponentType.Transform,
       );
       if (!transform) continue;
 
       getColliderMinMax(collider, transform.position, tempMin, tempMax);
       spatialHash.insert(tempMin, tempMax, collider);
     } */
  }
}

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