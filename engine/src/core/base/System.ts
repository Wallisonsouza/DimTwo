import type { Collider2D } from "@engine/modules/2D/Collider2D";
import type { Engine } from "../../Engine";


export interface CollisionEvent {
  a: Collider2D,
  b: Collider2D
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
  update?(dt: number): void;
  fixedUpdate?(fdt: number): void;
  lateUpdate?(dt: number): void;
  render?(dt: number): void;
  onDrawGizmos?(): void;


  onCollisionEnter?(collisionEvent: CollisionEvent): void;
  onCollisionStay?(collisionEvent: CollisionEvent): void;
  onCollisionExit?(collisionEvent: CollisionEvent): void;


  /*   onTriggerEnter?(triggerEvent: TriggerEvent): void;
    onTriggerStay?(triggerEvent: TriggerEvent): void;
    onTriggerExit?(triggerEvent: TriggerEvent): void; */
}
