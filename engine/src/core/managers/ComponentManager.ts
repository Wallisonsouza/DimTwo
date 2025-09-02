import { Collider2D } from "@engine/modules/2D/Collider2D";
import { Physics2D } from "@engine/modules/2D/Physics2D";
import type { ComponentGroup } from "../../modules/enums/ComponentGroup";
import type { ComponentType } from "../../modules/enums/ComponentType";
import type { Component } from "../base/Component";
import type { GameEntity } from "../base/GameEntity";

export class ComponentManager {
  private readonly data: Map<ComponentType, Map<number, Component>> = new Map();
  private readonly group: Map<ComponentGroup, Set<Component>> = new Map();

  addComponent(gameEntity: GameEntity, component: Component): boolean {

    if (component instanceof Collider2D) {
      Physics2D.colliders.push(component);
    }

    const type = component.type;
    if (!this.data.has(type)) this.data.set(type, new Map());

    const id = gameEntity.id.getValue();

    const typeMap = this.data.get(type)!;
    if (typeMap.has(id)) {
      console.warn(`GameEntity ${id} already has a component of type ${type}`);
      console.log(`GameEntity: ${id}`);
      return false;
    }

    typeMap.set(id, component);

    const group = component.group;
    if (group) {
      if (!this.group.has(group)) this.group.set(group, new Set());
      this.group.get(group)!.add(component);
    }

    component.gameEntity = gameEntity;
    return true;
  }

  removeComponent(entityID: number, type: ComponentType): boolean {
    const typeMap = this.data.get(type);
    if (!typeMap || !typeMap.has(entityID)) return false;

    const component = typeMap.get(entityID)!;
    typeMap.delete(entityID);

    const group = component.group;
    if (group && this.group.has(group)) {
      this.group.get(group)!.delete(component);
    }

    return true;
  }

  getComponent<T extends Component>(entity: GameEntity, type: ComponentType): T | null {
    const typeMap = this.data.get(type);
    return (typeMap?.get(entity.id.getValue()) as T) ?? null;
  }

  getAllComponents<T extends Component>(entity: GameEntity, type: ComponentType): T[] {
    const comp = this.getComponent<T>(entity, type);
    return comp ? [comp] : [];
  }

  getAllOfType<T extends Component>(type: ComponentType): T[] {
    const typeMap = this.data.get(type);
    return typeMap ? Array.from(typeMap.values()) as T[] : [];
  }

  getAllByGroup<T extends Component>(group: ComponentGroup): T[] {
    return Array.from(this.group.get(group) ?? []) as T[];
  }

  getAll(): Component[] {
    const allComponents: Component[] = [];
    for (const typeMap of this.data.values()) {
      allComponents.push(...typeMap.values());
    }
    return allComponents;
  }

  getAllComponentsForEntity(entityID: number): Component[] {
    const components: Component[] = [];

    for (const typeMap of this.data.values()) {
      const component = typeMap.get(entityID);
      if (component) components.push(component);
    }

    return components;
  }

  public getData() {
    return this.data;
  }

  public clear() {
    this.data.clear();
    this.group.clear();
  }
}