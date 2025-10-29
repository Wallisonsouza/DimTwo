import { type ComponentOptions, Component } from "../../core/base/Component";
import { Mat4 } from "../../core/math/Mat4";
import { Vec2 } from "../../core/math/Vec2";
import { ComponentGroup } from "../enums/ComponentGroup";
import { ComponentType } from "../enums/ComponentType";
import { PhysicsMath2D } from "./PhysicsMath2D";


export enum ForceMode {
  Impulse,
  Force
}

export enum BodyType {
  Dynamic,
  Static,
  Kinematic
}

export interface RigidBody2DOptions extends ComponentOptions {
  mass?: number;
  velocity?: Vec2;
  acceleration?: Vec2;
  drag?: number;
  gravityScale?: number;
  bodyType?: BodyType;
  useGravity?: boolean;
  freezePosition?: boolean;
  freezeRotation?: boolean;
  centerOfMass?: Vec2;
}


export enum Space {
  World,
  Local
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
  isSleeping: boolean = false;
  stillTime: number = 0;
  rotationAngle: number = 0;
  public forces: Vec2 = Vec2.create();


  freezePosition: boolean;
  freezeRotation: boolean;
  _centerOfMass: Vec2;

  public getCenterOfMass(space: Space = Space.World): Vec2 {
    if (space === Space.World) {
      const worldMatrix = this.transform.getWorldMatrix();
      return Mat4.multiplyVec2(worldMatrix, this._centerOfMass);
    } else {
      return this._centerOfMass.clone();
    }
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
    this._centerOfMass = options.centerOfMass || Vec2.create();

    this.freezePosition = options.freezePosition || false;
    this.freezeRotation = options.freezeRotation || false;
  }

  public getPointVelocity(point: Vec2, out: Vec2 = Vec2.create(), space: Space = Space.World): Vec2 {
    const centerOfMass = this.getCenterOfMass(space);
    const r = point.sub(centerOfMass);

    const angularVel = r.perpendicular().scale(this.angularVelocity);

    return out.copy(this.linearVelocity).add(angularVel);

  }

  public addForce(force: Vec2, mode: ForceMode = ForceMode.Force) {
    if (this.bodyType === BodyType.Static) return;

    const accel = PhysicsMath2D.forceToAcceleration(force, this.mass);

    switch (mode) {
      case ForceMode.Force:
        this.forces.addInPlace(force);
        break;

      case ForceMode.Impulse:

        this.linearVelocity.addInPlace(accel);
        break;

      default:
        break;
    }
  }

  public addTorque(torque: number, mode: ForceMode = ForceMode.Force) {
    if (this.bodyType === BodyType.Static) return;

    const I = this.getMomentOfInertia();

    switch (mode) {
      case ForceMode.Force:
        this.angularAcceleration += torque / I;
        break;

      case ForceMode.Impulse:
        this.angularVelocity += torque / I;
        break;

      default:
        break;
    }
  }

  getMomentOfInertia(): number {
    const w = this.transform.scale.x;
    const h = this.transform.scale.y;
    const m = this.mass;
    return (m * (w * w + h * h)) / 12;
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