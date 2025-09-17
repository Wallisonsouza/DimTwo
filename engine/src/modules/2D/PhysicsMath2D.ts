import { Vec2 } from "@engine/core/math/Vec2";
import type { Vec3 } from "@engine/core/math/Vec3";

export enum FrictionCombine {
  Average,
  Minimum,
  Maximum
}

export class PhysicsMath2D {
  public static readonly EPSILON = 1e-6;

  public static weightForce(mass: number, gravityAcceleration: Vec2): Vec2 {
    return Vec2.scale(gravityAcceleration, mass);
  }


  public static forceToAcceleration(force: Vec2, mass: number): Vec2 {
    if (mass === 0) throw new Error("Massa não pode ser zero");
    return Vec2.scale(force, 1 / mass, new Vec2());
  }

  public static drag(velocity: Vec2, rho: number, area: number, dragCoef: number): Vec2 {
    const speed = Vec2.length(velocity);
    if (speed < PhysicsMath2D.EPSILON) return new Vec2(0, 0);

    const velocityDir = Vec2.normalize(velocity, new Vec2());
    const dragMagnitude = 0.5 * rho * area * dragCoef * speed * speed;
    return Vec2.scale(velocityDir, -dragMagnitude, new Vec2());
  }

  public static rectangleInertia(size: Vec3, mass: number) {
    const w = size.x;
    const h = size.y;
    return (mass * (w * w + h * h)) / 12;
  }

  public static kineticFriction(
    velocity: Vec2,
    mass: number,
    mu: number,
    g: number = 9.81
  ): Vec2 {
    const speed = Vec2.length(velocity);
    if (speed < PhysicsMath2D.EPSILON) return new Vec2(0, 0);

    const velocityDir = Vec2.normalize(velocity, new Vec2());
    const frictionForce = mu * mass * g;
    return Vec2.scale(velocityDir, -frictionForce / mass, new Vec2());
  }

  public static contactFriction(
    velocity: Vec2,
    normal: Vec2,
    mass: number,
    normalForce: number,
    muStatic: number,
    muKinetic: number,
    deltaTime: number
  ): Vec2 {
    if (mass === 0) return new Vec2(0, 0);

    const n = Vec2.normalize(normal, new Vec2());
    const vn = Vec2.dot(velocity, n);
    const normalVel = Vec2.scale(n, vn, new Vec2());
    const tangentVel = Vec2.sub(velocity, normalVel, new Vec2());
    const tangentSpeed = Vec2.length(tangentVel);

    if (tangentSpeed < PhysicsMath2D.EPSILON) return new Vec2(0, 0);

    const tangentDir = Vec2.normalize(tangentVel, new Vec2());

    const maxFriction = normalForce * muKinetic;
    const requiredFriction = (mass * tangentSpeed) / deltaTime;

    const frictionForce = requiredFriction <= normalForce * muStatic
      ? requiredFriction
      : Math.min(requiredFriction, maxFriction);

    return Vec2.scale(tangentDir, -frictionForce / mass, new Vec2());
  }

  public static normalForceFromPenetration(
    penetrationMagnitude: number,
    massA: number,
    massB: number,
    deltaTime: number
  ): [number, number] {
    const penetrationImpulse = penetrationMagnitude / deltaTime;
    const totalMass = massA + massB;
    return [
      (massA / totalMass) * penetrationImpulse,
      (massB / totalMass) * penetrationImpulse
    ];
  }

  public static applyNormalImpulseTwoBodies(
    vA: Vec2, mA: number,
    vB: Vec2, mB: number,
    normal: Vec2,
    restitution: number
  ): { vA: Vec2; vB: Vec2 } {
    const relVel = Vec2.sub(vB, vA);
    const velAlongNormal = Vec2.dot(relVel, normal);

    if (velAlongNormal > 0) return { vA: vA.clone(), vB: vB.clone() };

    const j = -(1 + restitution) * velAlongNormal / (1 / mA + 1 / mB);

    const impulse = Vec2.scale(normal, j);

    return {
      vA: Vec2.sub(vA, Vec2.scale(impulse, 1 / mA)),
      vB: Vec2.add(vB, Vec2.scale(impulse, 1 / mB)),
    };
  }

  public static getCombinedFriction(
    frictionA: number,
    frictionB: number,
    mode: FrictionCombine = FrictionCombine.Average
  ): number {
    switch (mode) {
      case FrictionCombine.Average: return (frictionA + frictionB) / 2;
      case FrictionCombine.Minimum: return Math.min(frictionA, frictionB);
      case FrictionCombine.Maximum: return Math.max(frictionA, frictionB);
      default: return (frictionA + frictionB) / 2;
    }
  }

  public static calculateMRUAPosition(
    velocity: Vec2,
    acceleration: Vec2,
    deltaTime: number
  ): Vec2 {
    return new Vec2(
      velocity.data[0] * deltaTime + 0.5 * acceleration.data[0] * deltaTime * deltaTime,
      velocity.data[1] * deltaTime + 0.5 * acceleration.data[1] * deltaTime * deltaTime
    );
  }
}
