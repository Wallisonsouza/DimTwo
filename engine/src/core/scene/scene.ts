import type { Camera } from "@engine/modules/shared/camera/Camera";
/* import type { Prefab } from "@game/systems/Prefab"; */
import { CameraNotFoundException } from "@engine/exception /CameraNotFoundException";
import { ComponentType } from "../../modules/enums/ComponentType";
import { Component } from "../base/Component";
import { GameEntity } from "../base/GameEntity";
import { ComponentManager } from "../managers/ComponentManager";
import { EntityManager } from "../managers/EntityManager";

export class Scene {
  public name: string;
  public components: ComponentManager = new ComponentManager();
  public entities: EntityManager = new EntityManager();
  private activedCamera: Camera | null = null;

  constructor(name: string) {
    this.name = name;
  }

  public addEntity(entity: GameEntity) {
    this.entities.add(entity);
  }

  public addComponent(entity: GameEntity, component: Component) {
    this.components.addComponent(entity, component);
  }

  public getCamera(): Camera {
    if (this.activedCamera?.enabled) return this.activedCamera;

    const cam = this.components
      .getAllOfType<Camera>(ComponentType.Camera)
      .find(c => c.enabled);

    if (!cam) {
      throw new CameraNotFoundException("No active camera found in the scene");
    }

    this.activedCamera = cam;
    return cam;
  }

  public clone(): Scene {
    const sceneClone = new Scene(this.name + "_clone");

    for (const entity of this.entities.getAll()) {
      const entityClone = entity.clone();
      sceneClone.addEntity(entityClone);

      for (const component of this.components.getAllComponentsForEntity(entity.id.getValue())) {
        const componentClone = component.clone();
        sceneClone.addComponent(entityClone, componentClone);
      }
    }

    return sceneClone;
  }

  public clear(): void {
    this.components.clear();
    this.entities.clear();
  }


}


/*  public serialize() {
  return JSON.stringify({
    name: this.name,
    entities: serializeEntitiesMap(this.entities.getData()),
    components: serializeComponentMap(this.components.getData())
  }, undefined, 4);
}
function serializeEntitiesMap(entities: Map<number, GameEntity>): any[] {
  const result: any[] = [];
  for (const entity of entities.values()) {
    result.push(entity);
  }
  return result;
}

function serializeComponentMap(map: Map<string, Map<number, any>>): any {
  const result: any = {};

  for (const [componentType, componentMap] of map) {
    const componentsArray: any[] = [];
    for (const component of componentMap.values()) {
      if (component instanceof Map) {
        componentsArray.push(serializeComponentMap(component));
      } else {
        componentsArray.push(component);
      }
    }
    result[componentType] = componentsArray;
  }

  return result;
} */