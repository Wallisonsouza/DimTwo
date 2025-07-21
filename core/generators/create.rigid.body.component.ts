import type { RigidBodyComponent, RigidBodyOptions } from "../components/rigid-body-2d/RigidBody2D";
import { ComponentType } from "../types/component-type";
import type { GameEntity } from "../types/EngineEntity";
import { createIncrementalId } from "./create.incremental.id";

export function createRigidBodyComponent(
    gameEntity: GameEntity,
    options: RigidBodyOptions = {}
): RigidBodyComponent {
    return {
        instanceID: createIncrementalId(),
        type: ComponentType.RigidBody,
        category: ComponentType.RigidBody,
        gameEntity,
        mass: 1,
        velocity: { x: 0, y: 0 },
        acceleration: { x: 0, y: 0 },
        drag: 0.01,
        gravityScale: 100,
        isStatic: false,
        useGravity: true,
        enabled: true,
        ...options,
    };
}
