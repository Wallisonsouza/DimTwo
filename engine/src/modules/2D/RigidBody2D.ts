import { type ComponentOptions, Component } from "@engine/core/base/Component";
import { Vec2 } from "@engine/core/math/Vec2";
import { ComponentGroup } from "@engine/modules/enums/ComponentGroup";
import { ComponentType } from "@engine/modules/enums/ComponentType";
import { PhysicsMath2D } from "./PhysicsMath2D";

export interface RigidBody2DOptions extends ComponentOptions {
  mass?: number;
  velocity?: Vec2;
  acceleration?: Vec2;
  drag?: number;
  gravityScale?: number;
  bodyType?: BodyType;
  useGravity?: boolean;
}

export enum ForceMode {
  Impulse,
  Force
}

export enum BodyType {
  Static,
  Dynamic
}

export class RigidBody2D extends Component {
  mass: number;
  velocity: Vec2;
  acceleration: Vec2;
  gravityScale: number;
  bodyType: BodyType;
  useGravity: boolean;
  drag: number;
  area: number = 1;
  rho: number = 1.225;

  constructor(options: RigidBody2DOptions = {}) {
    super(ComponentType.RigidBody2D, ComponentGroup.RigidBody2D, options);
    this.mass = options.mass ?? 1;
    this.velocity = options.velocity ?? new Vec2(0, 0);
    this.acceleration = options.acceleration ?? new Vec2(0, 0);
    this.drag = options.drag ?? 0.01;
    this.gravityScale = options.gravityScale ?? 1;
    this.bodyType = options.bodyType ?? BodyType.Dynamic;
    this.useGravity = options.useGravity ?? true;
  }


  applyDrag() {
    if (this.bodyType === BodyType.Static) return;
    const speed = this.velocity.magnitude;
    if (speed < 0) return;

    const dragForce = PhysicsMath2D.drag(this.velocity, this.rho, this.area, this.drag);
    const aceleration = PhysicsMath2D.forceToAcceleration(dragForce, this.mass);
    this.acceleration.addInPlace(aceleration);
  }

  public addForce(force: Vec2, mode: ForceMode = ForceMode.Force) {
    if (this.bodyType === BodyType.Static) return;

    if (mode === ForceMode.Force) {
      const accel = PhysicsMath2D.forceToAcceleration(force, this.mass);
      console.log(accel)
      this.acceleration.addInPlace(accel);
    } else if (mode === ForceMode.Impulse) {
      const deltaV = PhysicsMath2D.forceToAcceleration(force, this.mass);
      this.velocity.addInPlace(deltaV);
    }
  }

  clone(): RigidBody2D {
    return new RigidBody2D({
      mass: this.mass,
      velocity: this.velocity.clone(),
      acceleration: this.acceleration.clone(),
      drag: this.drag,
      gravityScale: this.gravityScale,
      bodyType: this.bodyType,
      useGravity: this.useGravity
    });
  }
}