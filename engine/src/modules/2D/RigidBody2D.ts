import { type ComponentOptions, Component } from "@engine/core/base/Component";
import { Mat4 } from "@engine/core/math/Mat4";
import { Vec2 } from "@engine/core/math/Vec2";
import { Vec3 } from "@engine/core/math/Vec3";
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
  Dynamic,
  Static,
  Kinematic
}

export class RigidBody2D extends Component {
  mass: number;

  linearVelocity: Vec2;
  linearAcceleration: Vec2;
  angularVelocity: number = 0;
  angularAcceleration: number = 0;

  gravityScale: number;
  bodyType: BodyType;
  useGravity: boolean;
  drag: number;
  angularDrag: number = 1;
  area: number = 1;
  rho: number = 1.225;
  public inertia: number = 1;

  _centerOfMass: Vec2;

  public getCenterOfMass() {
    return Mat4.multiplyVec3(
      this.transform.getWorldMatrix(),
      Vec3.fromVec2(
        Vec2.scale(this._centerOfMass,
          0.5
        )
      )
    );
  }


  constructor(options: RigidBody2DOptions = {}) {
    super(ComponentType.RigidBody2D, ComponentGroup.RigidBody2D, options);
    this.mass = options.mass ?? 1;
    this.linearVelocity = options.velocity ?? new Vec2(0, 0);
    this.linearAcceleration = options.acceleration ?? new Vec2(0, 0);
    this.drag = options.drag ?? 0.01;
    this.gravityScale = options.gravityScale ?? 1;
    this.bodyType = options.bodyType ?? BodyType.Dynamic;
    this.useGravity = options.useGravity ?? true;
    this._centerOfMass = new Vec2(0.0, 0);
  }


  applyDrag() {
    if (this.bodyType === BodyType.Static) return;
    const speed = this.linearVelocity.magnitude;
    if (speed < 0) return;

    const dragForce = PhysicsMath2D.drag(this.linearVelocity, this.rho, this.area, this.drag);
    const acceleration = PhysicsMath2D.forceToAcceleration(dragForce, this.mass);
    this.linearAcceleration.addInPlace(acceleration);


    const angularDragForce = PhysicsMath2D.drag(new Vec2(this.angularVelocity, this.angularVelocity), this.rho, this.area, this.angularDrag);
    const angularAcceleration = PhysicsMath2D.forceToAcceleration(angularDragForce, this.mass);
    this.angularAcceleration += angularAcceleration.x;
  }

  public addForce(force: Vec2, mode: ForceMode = ForceMode.Force) {
    if (this.bodyType === BodyType.Static) return;

    const accel = PhysicsMath2D.forceToAcceleration(force, this.mass);

    switch (mode) {
      case ForceMode.Force:
        this.linearAcceleration.addInPlace(accel);
        break;

      case ForceMode.Impulse:
        this.linearVelocity.addInPlace(accel);
        break;

      default:
        break;
    }
  }

  public addForceAtPoint(force: Vec2, point: Vec2, mode: ForceMode = ForceMode.Force) {
    if (this.bodyType === BodyType.Static) return;

    this.addForce(force, mode);

    const r = Vec2.sub(point, Vec2.fromVec3(this.getCenterOfMass()));
    const torque = r.x * force.y - r.y * force.x;

    this.addTorque(torque, mode);
  }

  public addTorque(torque: number, mode: ForceMode = ForceMode.Force) {
    if (this.bodyType === BodyType.Static) return;

    const accel = torque / this.mass;

    switch (mode) {
      case ForceMode.Force:
        this.angularAcceleration += accel;
        break;

      case ForceMode.Impulse:
        this.angularVelocity += accel;
        break;

      default:
        break;
    }
  }

  public getVelocityAtPoint(point: Vec2): Vec2 {
    const r = Vec2.sub(point, Vec2.fromVec3(this.getCenterOfMass()));

    console.log(this.linearVelocity.toString())
    const angularVel = new Vec2(-this.angularVelocity * r.y, this.angularVelocity * r.x);
    return Vec2.add(this.linearVelocity, angularVel);
  }

  public getOffsetToCenterOfMass(point: Vec2) {
    return Vec2.sub(Vec2.fromVec3(this.getCenterOfMass()), point);
  }

  public getMomentOfInertiaAbout(contactPoint: Vec2) {

    const r = Vec2.sub(Vec2.fromVec3(this.getCenterOfMass()), contactPoint);
    const d2 = r.x * r.x + r.y * r.y;

    const w = this.transform.scale.x;
    const h = this.transform.scale.y;

    const I_CM = (1 / 12) * this.mass * (w * w + h * h);

    return I_CM + this.mass * d2;
  }


  clone(): RigidBody2D {
    return new RigidBody2D({
      mass: this.mass,
      velocity: this.linearVelocity.clone(),
      acceleration: this.linearAcceleration.clone(),
      drag: this.drag,
      gravityScale: this.gravityScale,
      bodyType: this.bodyType,
      useGravity: this.useGravity
    });
  }
}