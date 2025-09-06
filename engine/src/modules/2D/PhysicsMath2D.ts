import { Vec2 } from "@engine/core/math/Vec2";

export enum FrictionCombine {
  Average,
  Minimum,
  Maximum
}
export class PhysicsMath2D {
  public static readonly EPSILON = 1e-6;

  public static forceToAcceleration(force: Vec2, mass: number): Vec2 {
    if (mass === 0) throw new Error("Massa não pode ser zero");
    return force.scale(1 / mass);
  }

  // Cd -> coeficient;
  // p -> density;
  // V -> velocity;
  // A -> area;

  //D = Cd (ρ * (V * V) * A) / 2
  public static drag(velocity: Vec2, rho: number, area: number, dragCoef: number): Vec2 {
    const speed = velocity.magnitude;
    if (speed < PhysicsMath2D.EPSILON) return new Vec2(0, 0);

    const velocityDir = Vec2.normalize(velocity);
    const dragMagnitude = 0.5 * rho * area * dragCoef * speed * speed;
    return velocityDir.scale(-dragMagnitude);
  }

  public static kineticFriction(
    velocity: Vec2,
    mass: number,
    mu: number,
    g: number = 9.81
  ): Vec2 {
    const speed = velocity.magnitude;
    if (speed < PhysicsMath2D.EPSILON) return new Vec2(0, 0);

    const velocityDir = Vec2.normalize(velocity);
    const frictionForce = mu * mass * g;
    return velocityDir.scale(-frictionForce / mass);
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

    const n = Vec2.normalize(normal);

    const vn = Vec2.dot(velocity, n);
    const normalVel = n.scale(vn);
    const tangentVel = velocity.sub(normalVel);
    const tangentSpeed = tangentVel.magnitude;

    if (tangentSpeed < PhysicsMath2D.EPSILON) return new Vec2(0, 0);

    const tangentDir = Vec2.normalize(tangentVel);

    // Limite máximo de fricção cinética baseado na força normal
    const maxFriction = normalForce * muKinetic;

    // Força necessária para parar o objeto neste frame
    const requiredFriction = (mass * tangentSpeed) / deltaTime;

    // Determina fricção a aplicar
    let frictionForce: number;
    if (requiredFriction <= normalForce * muStatic) {
      // fricção estática suficiente para parar o objeto
      frictionForce = requiredFriction;
    } else {
      // aplicar fricção cinética limitada pelo coeficiente
      frictionForce = Math.min(requiredFriction, maxFriction);
    }

    // Converte para aceleração
    return tangentDir.scale(-frictionForce / mass);
  }

  public static normalForceFromPenetration(
    penetrationMagnitude: number,
    massA: number,
    massB: number,
    deltaTime: number
  ): [number, number] {
    const penetrationImpulse = penetrationMagnitude / deltaTime;
    const totalMass = massA + massB;
    const aForce = massA / totalMass * penetrationImpulse;
    const bForce = massB / totalMass * penetrationImpulse;
    return [aForce, bForce];
  }

  public static springAcceleration(
    penetration: number,
    normal: Vec2,
    velocity: Vec2,
    mass: number,
    k: number,
    damping: number
  ): Vec2 {

    const springForce = normal.scale(k * penetration);
    const dampingForce = velocity.scale(-damping);
    const totalForce = springForce.add(dampingForce);
    return PhysicsMath2D.forceToAcceleration(totalForce, mass);
  }

  public static getCombinedFriction(
    frictionA: number,
    frictionB: number,
    mode: FrictionCombine = FrictionCombine.Average
  ): number {
    switch (mode) {
      case FrictionCombine.Average:
        return (frictionA + frictionB) / 2;
      case FrictionCombine.Minimum:
        return Math.min(frictionA, frictionB);
      case FrictionCombine.Maximum:
        return Math.max(frictionA, frictionB);
      default:
        return (frictionA + frictionB) / 2;
    }
  }

  public static calculateMRUAPosition(
    velocity: Vec2,
    acceleration: Vec2,
    deltaTime: number
  ): Vec2 {
    return new Vec2(
      velocity.x * deltaTime + 0.5 * acceleration.x * deltaTime * deltaTime,
      velocity.y * deltaTime + 0.5 * acceleration.y * deltaTime * deltaTime,
    );
  }
}
