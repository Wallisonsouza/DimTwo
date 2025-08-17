/* import { SpatialHash } from "../../core/algorithms/spatialHash/SpatialHash";
import type { System } from "../../core/base/System";
import type { ECSComponent } from "../../core/ecs/ECSComponent";
import type { ECSSystem } from "../../core/ecs/ECSSystem";
import type { Vec2 } from "../../core/math/Vec2";
import { SceneManager } from "../../core/scene/SceneManager";
import type { BoxCollider2D } from "../components/physics/BoxCollider2D";
import type { CircleCollider2D } from "../components/physics/CircleCollider2D";
import { resolveOverlap } from "../components/physics/collider/CollisionResolver";
import { testOverlap } from "../components/physics/collider/CollisionTester";
import type { Collider } from "../components/physics/collider/types";
import { RigidBody2D } from "../components/physics/RigidBody2D";
import { Transform } from "../components/spatial/Transform";
import { ComponentType } from "../enums/ComponentType";

// Util
function makePairKey(id1: number, id2: number): string {
  return id1 < id2 ? `${id1}::${id2}` : `${id2}::${id1}`;
}

interface CollisionPair {
  a: Collider;
  b: Collider;
}

function getColliderMinMax(
  collider: Collider,
  position: Vec2,
  outMin: Vec2,
  outMax: Vec2,
) {
  const offset = collider.center ?? { x: 0, y: 0 };
  const centerX = position.x + offset.x;
  const centerY = position.y + offset.y;

  if (collider.type === ComponentType.BoxCollider2D) {
    const box = collider as BoxCollider2D;
    const halfW = box.size.x / 2;
    const halfH = box.size.y / 2;

    outMin.x = centerX - halfW;
    outMin.y = centerY - halfH;
    outMax.x = centerX + halfW;
    outMax.y = centerY + halfH;
  } else if (collider.type === ComponentType.CircleCollider2D) {
    const circle = collider as CircleCollider2D;
    const r = circle.radius;

    outMin.x = centerX - r;
    outMin.y = centerY - r;
    outMax.x = centerX + r;
    outMax.y = centerY + r;
  }
}

export interface CollisionState {
  previous: Map<string, CollisionPair>;
  current: Map<string, CollisionPair>;
  checked: Set<string>;
  collision: Set<string>;
}

export function ColliderSystem(): System {

  const tempMin = { x: 0, y: 0 };
  const tempMax = { x: 0, y: 0 };

  const spatialHash = new SpatialHash<Collider>(64);

  const collisionState: CollisionState = {
    previous: new Map<string, CollisionPair>(),
    current: new Map<string, CollisionPair>(),
    checked: new Set<string>(),
    collision: new Set<string>(),
  };

  return {
    fixedUpdate() {

      const scene =SceneManager.getCurrentScene();
      const systems = scene.ECSSystems;
      const components = scene.ECSComponents;


      collisionState.current.clear();
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
      }

      detectCollisions(
        components,
        spatialHash,
        collisionState,
        systems,
      );
    },
  };
}

function detectCollisions(
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