import type { CollisionEvent2D, System } from "../base/System";
import { EngineSystem } from "./EngineSystemManager";

export class SystemManager {
  private readonly data: Map<EngineSystem, System> = new Map();

  public addSystem(systemType: EngineSystem, systemInstance: System): void {
    if (this.data.has(systemType)) {
      console.warn(`System ${EngineSystem[systemType]} já está registrado.`);
      return;
    }
    this.data.set(systemType, systemInstance);
  }

  public getSystem<T extends System>(systemType: EngineSystem): T | null {
    return (this.data.get(systemType) as T) ?? null;
  }

  public hasSystem(systemType: EngineSystem): boolean {
    return this.data.has(systemType);
  }


  public callStart(): void {
    for (const system of this.data.values()) system.start?.();
  }
  public callFixedUpdate(): void {
    for (const system of this.data.values()) system.fixedUpdate?.();
  }
  public callUpdate(): void {
    for (const system of this.data.values()) system.update?.();
  }
  public callLateUpdate(): void {
    for (const system of this.data.values()) system.lateUpdate?.();
  }
  public callRender(): void {
    for (const system of this.data.values()) system.render?.();
  }
  public callDrawGizmos(): void {
    for (const system of this.data.values()) system.onDrawGizmos?.();
  }


  public callCollisionEnterEvents(event: CollisionEvent2D): void {
    for (const system of this.data.values()) system.onCollisionEnter2D?.(event);
  }
  public callCollisionStayEvents(event: CollisionEvent2D): void {
    for (const system of this.data.values()) system.onCollisionStay2D?.(event);
  }
  public callCollisionExitEvents(event: any): void {
    for (const system of this.data.values()) system.onCollisionExit?.(event);
  }


  public callTriggerEnterEvents(event: any): void {
    for (const system of this.data.values()) system.onTriggerEnter?.(event);
  }
  public callTriggerStayEvents(event: any): void {
    for (const system of this.data.values()) system.onTriggerStay?.(event);
  }
  public callTriggerExitEvents(event: any): void {
    for (const system of this.data.values()) system.onTriggerExit?.(event);
  }

  public clear() {
    this.data.clear();
  }
}