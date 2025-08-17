import { System } from "../../core/base/System";
import { EngineConfig } from "../../global/config/EngineConfig";
import type { RigidBody2D } from "../components/physics/RigidBody2D";
import type { Transform } from "../components/spatial/Transform";
import { ComponentGroup } from "../enums/ComponentGroup";
import { ComponentType } from "../enums/ComponentType";


export class PhysicsSystem extends System {
    fixedUpdate(fdt: number) {

        const scene = this.getScene();
        const components = scene.components;

        const rigidbodies = components.getAllByGroup<RigidBody2D>(
            ComponentGroup.RigidBody2D
        );

        for (const rigid of rigidbodies) {
            if (rigid.isStatic) continue;

            const transform = components.getComponent<Transform>(
                rigid.getEntityID(),
                ComponentType.Transform
            );

            if (!transform) continue;

            if (rigid.useGravity) {
                rigid.velocity.x += EngineConfig.PHYSICS.gravity.x * fdt;
                rigid.velocity.y += EngineConfig.PHYSICS.gravity.y * fdt;
            }

            const decay = Math.exp(-rigid.drag * fdt);
            rigid.velocity.x *= decay;
            rigid.velocity.y *= decay;

            transform.position.x -= rigid.velocity.x * fdt;
            transform.position.y += rigid.velocity.y * fdt;
        }
    }
}
