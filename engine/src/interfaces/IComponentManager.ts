import type { Component } from "../core/base/Component";
import type { GameEntity } from "../core/base/GameEntity";
import type { ComponentType } from "../modules/enums/ComponentType";

export interface IComponentManager {
    addComponent(entity: GameEntity, component: Component): boolean;
    removeComponent(entity: GameEntity, type: ComponentType): boolean;
    getComponent<T extends Component>(entity: GameEntity, type: ComponentType): T | null;
    getAllComponents<T extends Component>(entity: GameEntity, type: ComponentType): T[];
    getAllOfType<T extends Component>(type: ComponentType): T[];

}
