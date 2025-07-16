import { ComponentType } from "../../types/component-type";
import { SpatialHash } from "../../algorithms/SpatialHash";
import type { CircleColliderComponent } from "../../collider/types/CircleCollider";
import type { ColliderComponent } from "../../collider/types/Collider";
import { testOverlap } from "../../collider/overlap/testOverlap";
import { resolveOverlap } from "../../collider/resolution/resolveOverlap";
import type { Vec2 } from "../../Vec2/Vec2";
import { ECS } from "../../../engine/TwoD";
import type { ECSComponentState } from "../ecs/component";
import type { System } from "../ecs/system";
import type { BoxColliderComponent } from "./box/BoxCollider";
import type { TransformComponent } from "../transform";
import type { RigidBodyComponent } from "../rigid_body/rigid.body";
import type { GameEntity } from "../../types/EngineEntity";



// Util
function makePairKey(id1: number, id2: number): string {
  return id1 < id2 ? `${id1}::${id2}` : `${id2}::${id1}`;
}

interface CollisionPair {
  a: ColliderComponent;
  b: ColliderComponent;
}


function getColliderMinMax(
  collider: ColliderComponent,
  position: Vec2,
  outMin: Vec2,
  outMax: Vec2
) {
  const offset = collider.center ?? { x: 0, y: 0 };
  const centerX = position.x + offset.x;
  const centerY = position.y + offset.y;

  if (collider.type === ComponentType.BOX_COLLIDER) {
    const box = collider as BoxColliderComponent;
    const halfW = box.size.x / 2;
    const halfH = box.size.y / 2;

    outMin.x = centerX - halfW;
    outMin.y = centerY - halfH;
    outMax.x = centerX + halfW;
    outMax.y = centerY + halfH;
  }

  else if (collider.type === ComponentType.CIRCLE_COLLIDER) {
    const circle = collider as CircleColliderComponent;
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

export function ColliderSystem(componentState: ECSComponentState, state: ECS.System.ECSSystemState): System {

  const tempMin = { x: 0, y: 0 };
  const tempMax = { x: 0, y: 0 };

  const spatialHash = new SpatialHash<ColliderComponent>(64);

  const collisionState: CollisionState = {
    previous: new Map<string, CollisionPair>(),
    current: new Map<string, CollisionPair>(),
    checked: new Set<string>(),
    collision: new Set<string>(),
  };

  return {
    fixedUpdate() {

      collisionState.current.clear();
      collisionState.checked.clear();
      collisionState.collision.clear();
      spatialHash.clear();

      const colliders = ECS.Component.getComponentsByCategory<ColliderComponent>(componentState, ComponentType.COLLIDER);

      for (const collider of colliders) {

        if (!collider.enabled) continue;

        const transform = ECS.Component.getComponent<TransformComponent>(componentState, collider.gameEntity, ComponentType.TRANSFORM);
        if (!transform) continue;

        getColliderMinMax(collider, transform.position, tempMin, tempMax);
        spatialHash.insert(tempMin, tempMax, collider);
      }

      detectCollisions(
        componentState,
        spatialHash,
        collisionState,
        state,
      );
    }
  };
}

function detectCollisions(
  componentState: ECSComponentState,
  spatialHash: SpatialHash<ColliderComponent>,
  collisionState: CollisionState,
  systems: ECS.System.ECSSystemState,
) {
  for (const collidersInCell of spatialHash.getBuckets()) {
    const length = collidersInCell.length;

    for (let i = 0; i < length; i++) {
      const colliderA = collidersInCell[i];
      const aT = ECS.Component.getComponent<TransformComponent>(componentState, colliderA.gameEntity, ComponentType.TRANSFORM);
      if (!aT) continue;

      for (let j = i + 1; j < length; j++) {
        const colliderB = collidersInCell[j];
        if (colliderA.gameEntity.id === colliderB.gameEntity.id) continue;

       



        const bT = ECS.Component.getComponent<TransformComponent>(componentState, colliderB.gameEntity, ComponentType.TRANSFORM);
        if (!bT) continue;

        const pairKey = makePairKey(colliderA.instance, colliderB.instance);

        if (collisionState.checked.has(pairKey)) continue;
        collisionState.checked.add(pairKey);

        if (!testOverlap(aT.position, colliderA, bT.position, colliderB)) {
          continue;
        }

        collisionState.current.set(pairKey, { a: colliderA, b: colliderB });

        collisionState.collision.add(colliderA.instance.toString());
        collisionState.collision.add(colliderB.instance.toString());

        const wasColliding = collisionState.previous.has(pairKey);

        const aIsTrigger = colliderA.isTrigger;
        const bIsTrigger = colliderB.isTrigger;
        const isTriggerInteraction = aIsTrigger || bIsTrigger;

        if (isTriggerInteraction) {
          if (!wasColliding) ECS.System.callTriggerEnterEvents(systems, { a: colliderA, b: colliderB });
          ECS.System.callTriggerStayEvents(systems, { a: colliderA, b: colliderB });
          colliderA.isColliding = true;
          colliderB.isColliding = true;
          continue;
        }

        if (!wasColliding) ECS.System.callCollisionEnterEvents(systems, { a: colliderA, b: colliderB });

        ECS.System.callCollisionStayEvents(systems, { a: colliderA, b: colliderB });
        colliderA.isColliding = true;
        colliderB.isColliding = true;

        const resolution = resolveOverlap(
          aT.position,
          colliderA,
          bT.position,
          colliderB,
        );

        if (resolution) {
          resolve_rigid_body(componentState, colliderA.gameEntity, colliderB.gameEntity, resolution);
        }

      }
    }
  }

  for (const [pairKey, pair] of collisionState.previous.entries()) {
    if (!collisionState.current.has(pairKey)) {
      if (pair.a.isTrigger || pair.b.isTrigger) {
        ECS.System.callTriggerExitEvents(systems, pair);
        pair.a.isColliding = false;
        pair.b.isColliding = false;
      } else {

        pair.a.isColliding = false;
        pair.b.isColliding = false;
        ECS.System.callCollisionExitEvents(systems, pair);
      }
    }
  }

  collisionState.previous.clear();
  for (const [pairKey, pair] of collisionState.current.entries()) {
    collisionState.previous.set(pairKey, pair);
  }
}


export function resolve_rigid_body(
  componentState: ECSComponentState,
  aEntity: GameEntity,
  bEntity: GameEntity,
  resolution: Vec2
) {
  const aTransform = ECS.Component.getComponent<TransformComponent>(
    componentState,
    aEntity,
    ComponentType.TRANSFORM
  );

  const bTransform = ECS.Component.getComponent<TransformComponent>(
    componentState,
    bEntity,
    ComponentType.TRANSFORM
  );

  if (!aTransform || !bTransform) return;

  const aRigid = ECS.Component.getComponent<RigidBodyComponent>(
    componentState,
    aEntity,
    ComponentType.RigidBody
  );

  const bRigid = ECS.Component.getComponent<RigidBodyComponent>(
    componentState,
    bEntity,
    ComponentType.RigidBody
  );

  if (!aRigid && !bRigid) {
    resolve_without_rigidbody(aTransform, bTransform, resolution);
    return;
  }

  if (aRigid && bRigid) {
    resolve_with_rigidbody(aTransform, bTransform, aRigid, bRigid, resolution);
    return;
  }

  if (aRigid) {
    if (!aRigid.isStatic) {
      aTransform.position.x += resolution.x;
      aTransform.position.y += resolution.y;
    }
  } else if (bRigid) {
    if (!bRigid.isStatic) {
      bTransform.position.x -= resolution.x;
      bTransform.position.y -= resolution.y;
    }
  }
}

function resolve_without_rigidbody(
  aTransform: TransformComponent,
  bTransform: TransformComponent,
  resolution: Vec2
) {
  aTransform.position.x += resolution.x * 0.5;
  aTransform.position.y += resolution.y * 0.5;

  bTransform.position.x -= resolution.x * 0.5;
  bTransform.position.y -= resolution.y * 0.5;
}

function resolve_with_rigidbody(
  aTransform: TransformComponent,
  bTransform: TransformComponent,
  aRigid: RigidBodyComponent,
  bRigid: RigidBodyComponent,
  resolution: Vec2
) {
  if (aRigid.isStatic && bRigid.isStatic) return;

  const aStatic = aRigid.isStatic ?? true;
  const bStatic = bRigid.isStatic ?? true;

  if (!aStatic && !bStatic) {
    const totalMass = aRigid.mass + bRigid.mass;
    const aFactor = bRigid.mass / totalMass;
    const bFactor = aRigid.mass / totalMass;

    aTransform.position.x += resolution.x * aFactor;
    aTransform.position.y += resolution.y * aFactor;

    bTransform.position.x -= resolution.x * bFactor;
    bTransform.position.y -= resolution.y * bFactor;
  } else if (!aStatic) {
    aTransform.position.x += resolution.x;
    aTransform.position.y += resolution.y;
  } else if (!bStatic) {
    bTransform.position.x -= resolution.x;
    bTransform.position.y -= resolution.y;
  }
}
