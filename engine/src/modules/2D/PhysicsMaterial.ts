export class PhysicsMaterial {
  restitution: number;
  staticFriction: number;
  dynamicFriction: number;
  density: number;

  constructor(options: Partial<PhysicsMaterial> = {}) {
    this.restitution = options.restitution ?? 0;
    this.staticFriction = options.staticFriction ?? 0;
    this.dynamicFriction = options.dynamicFriction ?? 0;
    this.density = options.density ?? 0;
  }
}