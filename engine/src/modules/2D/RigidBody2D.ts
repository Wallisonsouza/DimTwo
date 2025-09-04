import { type ComponentOptions, Component } from "@engine/core/base/Component";
import { Vec2 } from "@engine/core/math/Vec2";
import { ComponentGroup } from "@engine/modules/enums/ComponentGroup";
import { ComponentType } from "@engine/modules/enums/ComponentType";

export interface RigidBody2DOptions extends ComponentOptions {
  mass?: number;
  velocity?: Vec2;
  acceleration?: Vec2;
  drag?: number;
  gravityScale?: number;
  isStatic?: boolean;
  useGravity?: boolean;
}

export enum ForceMode {
  Impulse,
  Force
}


export class RigidBody2D extends Component {
  mass: number;
  velocity: Vec2;
  acceleration: Vec2;
  gravityScale: number;
  isStatic: boolean;
  useGravity: boolean;
  drag: number;

  constructor(options: RigidBody2DOptions = {}) {
    super(ComponentType.RigidBody2D, ComponentGroup.RigidBody2D, options);
    this.mass = options.mass ?? 1;
    this.velocity = options.velocity ?? new Vec2();
    this.acceleration = options.acceleration ?? new Vec2();
    this.drag = options.drag ?? 0.01;
    this.gravityScale = options.gravityScale ?? 1;
    this.isStatic = options.isStatic ?? false;
    this.useGravity = options.useGravity ?? true;
  }



  area: number = 1;
  rho: number = 1.225;

  applyDrag() {

    const speed = this.velocity.magnitude;
    if (speed > 0) {
      const velocityDir = Vec2.normalize(this.velocity);
      const dragMagnitude = 0.5 * this.rho * this.area * this.drag * speed * speed;
      const dragForce = velocityDir.scale(-dragMagnitude);
      const accelDrag = dragForce.scale(1 / this.mass);
      this.acceleration.addInPlace(accelDrag);
    }
  }




  public movePosition(target: Vec2, deltaTime: number) {
    if (this.isStatic) return;

    const deltaX = target.x - this.transform.position.x;
    const deltaY = target.y - this.transform.position.y;

    this.velocity.x = deltaX / deltaTime;
    this.velocity.y = deltaY / deltaTime;
  }


  public addForce(force: Vec2, mode: ForceMode = ForceMode.Force) {
    if (this.isStatic) return;

    if (mode === ForceMode.Force) {
      const accelerationDelta = new Vec2(force.x / this.mass, force.y / this.mass);
      this.acceleration = this.acceleration.add(accelerationDelta);
    } else if (mode === ForceMode.Impulse) {
      this.velocity.x += force.x / this.mass;
      this.velocity.y += force.y / this.mass;
    }
  }


  clone(): RigidBody2D {
    return new RigidBody2D({
      mass: this.mass,
      velocity: this.velocity.clone(),
      acceleration: this.acceleration.clone(),
      drag: this.drag,
      gravityScale: this.gravityScale,
      isStatic: this.isStatic,
      useGravity: this.useGravity,
    });
  }
}