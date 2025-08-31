import type { GameEntity } from "@engine/core/base/GameEntity";
import { System } from "@engine/core/base/System";
import { Input } from "./InputSystem";

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

        const camera = this.getScene().getActiveCamera();
        const mousePos = Input.mouse.getMousePosition();
        
        const screenSpace = camera.worldPointToScreen(this.target.transform.position);
        console.log(screenSpace)
        
    }



}