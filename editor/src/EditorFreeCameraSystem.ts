import { System } from "@engine/core/base/System";
import { KeyCode } from "@engine/core/input/KeyCode";
import { Vec3 } from "@engine/core/math/Vec3";
import type { Camera } from "@engine/modules/shared/camera/Camera";

export class EditorFreeCameraSystem extends System {
  private moveSpeed = 5;
  private scrollSpeed = 2;
  private runMultiplier = 2;
  private camera: Camera | null = null;

  private moveDir = new Vec3();

  update(dt: number): void {

    const input = this.engine.input;

    this.camera = this.engine.getActivedCamera();
    if (!this.camera) return;

    const transform = this.camera.transform;
    this.moveDir.set(0, 0, 0);

    if (input.getKey(KeyCode.KeyW)) this.moveDir.y += 1;
    if (input.getKey(KeyCode.KeyS)) this.moveDir.y -= 1;
    if (input.getKey(KeyCode.KeyA)) this.moveDir.x -= 1;
    if (input.getKey(KeyCode.KeyD)) this.moveDir.x += 1;

    this.camera.transform.position.z +=
      input.getScrollDelta().y * dt * this.scrollSpeed;

    if (this.moveDir.x || this.moveDir.y) {
      Vec3.normalize(this.moveDir, this.moveDir);

      let speed = this.moveSpeed;
      if (input.getKey(KeyCode.ShiftLeft)) {
        speed *= this.runMultiplier;
      }

      Vec3.scale(this.moveDir, speed * dt, this.moveDir);
      Vec3.add(transform.position, this.moveDir, transform.position);
    }

  }
}
