import { System } from "../../engine/src/core/base/System";
import { Vec3 } from "../../engine/src/core/math/Vec3";
import { WebKeyboardInput } from "../../engine/src/modules/webInput/WebKeyboardInput";
import type { KeyCode } from "../../engine/src/modules/webInput/WebKeyCode";
import { Editor } from "./EditorEngine";

class Input {
    private static keyInput: WebKeyboardInput = new WebKeyboardInput();

    public static getKey(keyCode: KeyCode) {
        return this.keyInput.getKey(keyCode);
    }

    public static enable() {
        this.keyInput.enable();
    }

    public static clear() {
        this.keyInput.clear();
    }
}


export class FreeCameraSystem extends System {
    private moveSpeed = 5;

    start(): void {
        Input.enable();
    }

    update(dt: number): void {

        const engine = this.getEngine();

        if (engine instanceof Editor) {
           const transform = engine.cameraTransform;

            const moveDir = new Vec3(0, 0, 0);

            if (Input.getKey("KeyW")) moveDir.y += 1;
            if (Input.getKey("KeyS")) moveDir.y -= 1;
            if (Input.getKey("KeyA")) moveDir.x -= 1;
            if (Input.getKey("KeyD")) moveDir.x += 1;


            if (moveDir.x || moveDir.y) {
                Vec3.normalize(moveDir, moveDir);
                Vec3.scale(moveDir, moveDir, this.moveSpeed * dt);
                Vec3.add(transform.position, moveDir, transform.position);
            }
        }

    }

    lateUpdate(dt: number): void {
        Input.clear();
    }
}
