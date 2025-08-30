import { System } from "@engine/core/base/System";
import type { Transform } from "@engine/modules/components/spatial/Transform";
import { ComponentType } from "@engine/modules/enums/ComponentType";

export class CameraSystem extends System {

    private targetTransform: Transform | null = null;

    start() {

        const scene = this.getScene();

        const cameraEntity = scene.entities.getByTag("MainCamera");
        if (!cameraEntity) return;

        const playerEntity = scene.entities.getByTag("Player");
        if (!playerEntity) return;

        this.targetTransform = scene.components.getComponent<Transform>(playerEntity.id.getValue(), ComponentType.Transform);
    }

    update(dt: number) {
        const camera = this.getScene().getActiveCamera();
        const ct = camera.transform;

        if (!this.targetTransform || !ct) return;
        const target = this.targetTransform.position.clone();
        target.z = ct.position.z;

        ct.position = target;

    }
}