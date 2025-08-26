import type { Clonable } from "@engine/core/base/Clonable";
import { Component } from "../../../core/base/Component";
import { Vec2 } from "../../../core/math/Vec2";
import { ComponentGroup } from "../../enums/ComponentGroup";
import { ComponentType } from "../../enums/ComponentType";
import type { Transform } from "../spatial/Transform";

export interface RigidBody2DOptions {
  mass?: number;
  velocity?: Vec2;
  acceleration?: Vec2;
  drag?: number;
  gravityScale?: number;
  isStatic?: boolean;
  useGravity?: boolean;
}

export class RigidBody2D extends Component implements Clonable<RigidBody2D> {
  mass: number;
  velocity: Vec2;
  acceleration: Vec2;
  drag: number;
  gravityScale: number;
  isStatic: boolean;
  useGravity: boolean;

  constructor(options: RigidBody2DOptions = {}) {
    super(ComponentType.RigidBody2D, ComponentGroup.RigidBody2D);
    this.mass = options.mass ?? 1;
    this.velocity = options.velocity ?? new Vec2();
    this.acceleration = options.acceleration ?? new Vec2();
    this.drag = options.drag ?? 0;
    this.gravityScale = options.gravityScale ?? 1;
    this.isStatic = options.isStatic ?? false;
    this.useGravity = options.useGravity ?? true;
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
    resolution: Vec2,
  ) {
    if (!aRigid && !bRigid) {
      this.resolveWithoutRigidBody(aTransform, bTransform, resolution);
      return;
    }

    if (aRigid && bRigid) {
      this.resolveWithRigidBody(aTransform, bTransform, aRigid, bRigid, resolution);
      return;
    }

  }

  public static applyResolution(transform: Transform, resolution: Vec2, factor: number) {
    transform.position.x += resolution.x * factor;
    transform.position.y += resolution.y * factor;
  }

  public static resolveWithRigidBody(
    aTransform: Transform,
    bTransform: Transform,
    aRigid: RigidBody2D,
    bRigid: RigidBody2D,
    mtv: Vec2
  ) {
    const aStatic = !!aRigid.isStatic;
    const bStatic = !!bRigid.isStatic;

    if (aStatic && bStatic) return;

    const aMass = aRigid.mass > 0 ? aRigid.mass : 1;
    const bMass = bRigid.mass > 0 ? bRigid.mass : 1;

    if (!aStatic && !bStatic) {
      const totalMass = aMass + bMass;
      const aMoveFactor = bMass / totalMass;
      const bMoveFactor = aMass / totalMass;

      this.applyResolution(aTransform, mtv, aMoveFactor);
      this.applyResolution(bTransform, mtv, -bMoveFactor);
      return;
    }

    if (!aStatic) {
      this.applyResolution(aTransform, mtv, 1);
      return;
    }

    if (!bStatic) {
      this.applyResolution(bTransform, mtv, -1);
      return;
    }
  }

  public static resolveWithoutRigidBody(
    aTransform: Transform,
    bTransform: Transform,
    resolution: Vec2,
  ) {
    this.applyResolution(aTransform, resolution, 0.5);
    this.applyResolution(bTransform, resolution, -0.5);
  }
}
