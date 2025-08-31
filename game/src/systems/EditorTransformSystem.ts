import type { GameEntity } from "@engine/core/base/GameEntity";
import { System } from "@engine/core/base/System";
import { Vec3 } from "@engine/core/math/Vec3";
import { Physics2D } from "@engine/modules/components/physics/Physics2D";
import { Input } from "./InputSystem";

export class EditorTransformSystem extends System {

    private selectedGameEntity: GameEntity | null = null;
    private offset = { x: 0, y: 0 }; 

    update(): void {
        const camera = this.getScene().getActiveCamera();
        if (!camera) return;

        const mousePos = Input.mouse.getMousePosition();
        if (!mousePos) return;

        if (Input.mouse.getMouseButtonDown(0)) {
            const ray = camera.screenPointToRay(mousePos);
            const hit = Physics2D.rayCast2D(ray.origin, ray.direction);
            if (hit) {
                this.selectedGameEntity = hit.collider.gameEntity;
                // calcula offset para manter a posição relativa do clique
                this.offset.x = this.selectedGameEntity.transform.position.x - hit.point.x;
                this.offset.y = this.selectedGameEntity.transform.position.y - hit.point.y;
            }
        }

        if (Input.mouse.getMouseButtonUp(0)) {
            this.selectedGameEntity = null;
        }

        if (this.selectedGameEntity) {
            const ray = camera.screenPointToRay(mousePos);
            const distance = Vec3.distanceTo(
                this.selectedGameEntity.transform.position,
                camera.transform.position
            ); 
            const targetPos = {
                x: ray.origin.x + ray.direction.x * distance + this.offset.x,
                y: ray.origin.y + ray.direction.y * distance + this.offset.y
            };
            this.selectedGameEntity.transform.position.x = targetPos.x;
            this.selectedGameEntity.transform.position.y = targetPos.y;
        }
    }
}
