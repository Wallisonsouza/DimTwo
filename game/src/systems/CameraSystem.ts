import type { GameEntity } from "@engine/core/base/GameEntity";
import { System } from "@engine/core/base/System";

export class CameraSystem extends System {

    private target: GameEntity | null = null;
    private camera: GameEntity | null = null;

    start() {
        const scene = this.getScene();
        this.camera = scene.entities.getByTag("MainCamera");
        this.target = scene.entities.getByTag("Player");
    }

    update(dt: number) {
        if (!this.camera || !this.target) return;

       /*  const zCache = this.camera.transform.position.z;
        this.camera.transform.position = this.target.transform.position;
        this.camera.transform.position.z = zCache;
 */

        



    }

}

