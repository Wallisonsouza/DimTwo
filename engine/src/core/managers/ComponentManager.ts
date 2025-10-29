
import { Collider2D } from "../../modules/2D/Collider2D";
import { Physics2D } from "../../modules/2D/Physics2D";
import type { ComponentGroup } from "../../modules/enums/ComponentGroup";
import type { ComponentType } from "../../modules/enums/ComponentType";
import type { Component } from "../base/Component";
import type { GameEntity } from "../base/GameEntity";

export class ComponentManager {
  // Cada ComponentType mapeia entityID → array de Components
  private readonly data: Map<ComponentType, Map<number, Component[]>> = new Map();
  private readonly group: Map<ComponentGroup, Set<Component>> = new Map();

  addComponent(gameEntity: GameEntity, component: Component): boolean {
    if (component instanceof Collider2D) {
      Physics2D.colliders.push(component);
    }

    const type = component.type;
    if (!this.data.has(type)) this.data.set(type, new Map());

    const id = gameEntity.id.getValue();
    const typeMap = this.data.get(type)!;

    // Cada ID armazena um array de componentes
    if (!typeMap.has(id)) typeMap.set(id, []);
    const componentsArray = typeMap.get(id)!;

    componentsArray.push(component);

    const group = component.group;
    if (group) {
      if (!this.group.has(group)) this.group.set(group, new Set());
      this.group.get(group)!.add(component);
    }

    component.gameEntity = gameEntity;
    return true;
  }

  removeComponent(entityID: number, type: ComponentType, component?: Component): boolean {
    const typeMap = this.data.get(type);
    if (!typeMap || !typeMap.has(entityID)) return false;

    if (component) {
      // Remove apenas o componente específico
      const componentsArray = typeMap.get(entityID)!;
      const index = componentsArray.indexOf(component);
      if (index >= 0) {
        componentsArray.splice(index, 1);
        if (componentsArray.length === 0) typeMap.delete(entityID);
      } else return false;
    } else {
      // Remove todos os componentes desse tipo para a entidade
      typeMap.delete(entityID);
    }

    const group = component?.group;
    if (group && this.group.has(group)) {
      this.group.get(group)!.delete(component!);
    }

    return true;
  }

  getComponent<T extends Component>(entity: GameEntity, type: ComponentType): T | null {
    const typeMap = this.data.get(type);
    const comps = typeMap?.get(entity.id.getValue());
    return comps && comps.length > 0 ? (comps[0] as T) : null;
  }

  getAllComponents<T extends Component>(entity: GameEntity, type: ComponentType): T[] {
    const typeMap = this.data.get(type);
    return (typeMap?.get(entity.id.getValue()) as T[]) ?? [];
  }

  getAllOfType<T extends Component>(type: ComponentType): T[] {
    const typeMap = this.data.get(type);
    if (!typeMap) return [];
    const all: T[] = [];
    for (const arr of typeMap.values()) {
      all.push(...(arr as T[]));
    }
    return all;
  }

  getAllByGroup<T extends Component>(group: ComponentGroup): T[] {
    return Array.from(this.group.get(group) ?? []) as T[];
  }

  getAll(): Component[] {
    const allComponents: Component[] = [];
    for (const typeMap of this.data.values()) {
      for (const arr of typeMap.values()) {
        allComponents.push(...arr);
      }
    }
    return allComponents;
  }

  getAllComponentsForEntity(entityID: number): Component[] {
    const components: Component[] = [];
    for (const typeMap of this.data.values()) {
      const arr = typeMap.get(entityID);
      if (arr) components.push(...arr);
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
