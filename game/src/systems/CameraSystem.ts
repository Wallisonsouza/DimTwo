import { System } from "@engine/core/base/System";
import { Vec3 } from "@engine/core/math/Vec3";
import type { Transform } from "@engine/modules/components/spatial/Transform";
import { ComponentType } from "@engine/modules/enums/ComponentType";

export class CameraSystem extends System {

    private cameraTransform: Transform | null = null;
    private targetTransform: Transform | null = null;

    start() {

        const cameraEntity = this.getScene().entities.getByTag("MainCamera");
        if (!cameraEntity) return;

        const playerEntity = this.getScene().entities.getByTag("Player");
        if (!playerEntity) return;

        this.cameraTransform = this.getScene().components.getComponent<Transform>(cameraEntity.id.getValue(), ComponentType.Transform);
        this.targetTransform = this.getScene().components.getComponent<Transform>(playerEntity.id.getValue(), ComponentType.Transform);
    }

    update(dt: number) {

        if (!this.targetTransform || !this.cameraTransform) return;
        const target = this.targetTransform.position.clone();
        target.z = this.cameraTransform.position.z;

        this.cameraTransform.position = Vec3.lerp(this.cameraTransform.position, this.cameraTransform.position, target, 1 * dt);

    }
}