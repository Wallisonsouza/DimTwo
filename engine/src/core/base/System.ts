import type { Collider2D } from "@engine/modules/2D/Collider2D";
import type { Contact2D } from "@engine/modules/2D/SAT";
import type { Engine } from "../../Engine";

export interface CollisionEvent2D {
  a: Collider2D,
  b: Collider2D,
  contacts: Contact2D[];
}

export class System {

  public engine!: Engine;


  public getEngine(): Engine {
    if (!this.engine) {
      throw new Error(`System ${this.constructor.name} not connected to any engine`);
    }
    return this.engine;
  }

  public setEngine(engine: Engine) {
    this.engine = engine;
  }

  start?(): void;
  update?(): void;
  fixedUpdate?(): void;
  lateUpdate?(): void;
  render?(): void;
  onDrawGizmos?(): void;


  onCollisionEnter2D?(collisionEvent2D: CollisionEvent2D): void;
  onCollisionStay2D?(collisionEvent2D: CollisionEvent2D): void;
  onCollisionExit?(collisionEvent2D: CollisionEvent2D): void;


  onTriggerEnter?(triggerEvent: any): void;
  onTriggerStay?(triggerEvent: any): void;
  onTriggerExit?(triggerEvent: any): void;
}
