import { type ComponentOptions, Component } from "@engine/core/base/Component";
import { Vec2 } from "@engine/core/math/Vec2";
import { ComponentGroup } from "@engine/modules/enums/ComponentGroup";
import { ComponentType } from "@engine/modules/enums/ComponentType";
import type { Transform } from "../3D/Transform";

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
  drag: number;
  gravityScale: number;
  isStatic: boolean;
  useGravity: boolean;

  constructor(options: RigidBody2DOptions = {}) {
    super(ComponentType.RigidBody2D, ComponentGroup.RigidBody2D, options);
    this.mass = options.mass ?? 1;
    this.velocity = options.velocity ?? new Vec2();
    this.acceleration = options.acceleration ?? new Vec2();
    this.drag = options.drag ?? 0;
    this.gravityScale = options.gravityScale ?? 1;
    this.isStatic = options.isStatic ?? false;
    this.useGravity = options.useGravity ?? true;
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
      // aplica velocidade instantânea, sem acumular
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

  public static resolveRigidBody(
    aRigid: RigidBody2D | null,
    aTransform: Transform,
    bRigid: RigidBody2D | null,
    bTransform: Transform,
    resolution: Vec2
  ) {
    const aStaticOrNoGravity = !aRigid || aRigid.isStatic || !aRigid.useGravity;
    const bStaticOrNoGravity = !bRigid || bRigid.isStatic || !bRigid.useGravity;

    const aMass = aRigid?.mass ?? 1;
    const bMass = bRigid?.mass ?? 1;

    if (!aStaticOrNoGravity && !bStaticOrNoGravity) {
      const totalMass = aMass + bMass;
      const aFactor = bMass / totalMass;
      const bFactor = aMass / totalMass;

      this.applyResolution(aTransform, bTransform, resolution, aFactor, bFactor);
    }

    else if (!aStaticOrNoGravity) {
      this.applyResolution(aTransform, bTransform, resolution, 1, 0);
    }

    else if (!bStaticOrNoGravity) {
      this.applyResolution(aTransform, bTransform, resolution, 0, 1);
    }

    if (aRigid && !aRigid.isStatic) {
      if (resolution.x !== 0) aRigid.velocity.x = 0;
      if (resolution.y !== 0) aRigid.velocity.y = 0;
    }

    if (bRigid && !bRigid.isStatic) {
      if (resolution.x !== 0) bRigid.velocity.x = 0;
      if (resolution.y !== 0) bRigid.velocity.y = 0;
    }

  }

  private static applyResolution(
    aTransform: Transform,
    bTransform: Transform,
    resolution: Vec2,
    aFactor: number,
    bFactor: number
  ) {
    aTransform.position.x += resolution.x * aFactor;
    aTransform.position.y += resolution.y * aFactor;
    bTransform.position.x -= resolution.x * bFactor;
    bTransform.position.y -= resolution.y * bFactor;
  }
}