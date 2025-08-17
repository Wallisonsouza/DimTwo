import type { ComponentGroup, ComponentType } from "../../modules/enums/ComponentType";
import type { Component } from "../base/Component";

export class ComponentManager {
    private readonly data: Map<ComponentType, Map<number, Component>> = new Map();
    private readonly group: Map<ComponentGroup, Set<Component>> = new Map();

    addComponent(entityID: number, component: Component): boolean {

        const type = component.type;
        if (!this.data.has(type)) this.data.set(type, new Map());

        const typeMap = this.data.get(type)!;
        if (typeMap.has(entityID)) {
            console.warn(`GameEntity ${entityID} already has a component of type ${type}`);
            console.log(`GameEntity: ${entityID}`);
            return false;
        }

        typeMap.set(entityID, component);

        const group = component.group;
        if (group) {
            if (!this.group.has(group)) this.group.set(group, new Set());
            this.group.get(group)!.add(component);
        }

        component.setEntityID(entityID);
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

    getComponent<T extends Component>(entityID: number, type: ComponentType): T | null {
        const typeMap = this.data.get(type);
        return (typeMap?.get(entityID) as T) ?? null;
    }

    getAllComponents<T extends Component>(entityID: number, type: ComponentType): T[] {
        const comp = this.getComponent<T>(entityID, type);
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