import type { System } from "../base/System";
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
  public callFixedUpdate(fdt: number): void {
    for (const system of this.data.values()) system.fixedUpdate?.(fdt);
  }
  public callUpdate(dt: number): void {
    for (const system of this.data.values()) system.update?.(dt);
  }
  public callLateUpdate(dt: number): void {
    for (const system of this.data.values()) system.lateUpdate?.(dt);
  }
  public callRender(dt: number): void {
    for (const system of this.data.values()) system.render?.(dt);
  }
  public callDrawGizmos(): void {
    for (const system of this.data.values()) system.onDrawGizmos?.();
  }


  public callCollisionEnterEvents(event: any): void {
    for (const system of this.data.values()) system.onCollisionEnter?.(event);
  }
  public callCollisionStayEvents(event: any): void {
    for (const system of this.data.values()) system.onCollisionStay?.(event);
  }
  public callCollisionExitEvents(event: any): void {
    for (const system of this.data.values()) system.onCollisionExit?.(event);
  }


  public callTriggerEnterEvents(event: TriggerEvent): void {
    for (const system of this.data.values()) system.onTriggerEnter?.(event);
  }
  public callTriggerStayEvents(event: TriggerEvent): void {
    for (const system of this.data.values()) system.onTriggerStay?.(event);
  }
  public callTriggerExitEvents(event: TriggerEvent): void {
    for (const system of this.data.values()) system.onTriggerExit?.(event);
  }

  public clear() {
    this.data.clear();
  }
}