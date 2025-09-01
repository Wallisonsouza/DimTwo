import { PerspectiveCamera } from "@engine/modules/3D/PerspesctiveCamera";
import type { Camera } from "@engine/modules/shared/camera/Camera";
import type { Prefab } from "@game/systems/Prefab";
import { ComponentType } from "../../modules/enums/ComponentType";
import { Component } from "../base/Component";
import { GameEntity } from "../base/GameEntity";
import { Display } from "../display/Display";
import { ComponentManager } from "../managers/ComponentManager";
import { EntityManager } from "../managers/EntityManager";
import { Vec3 } from "../math/Vec3";
import { Quat } from "../math/quat";

export class Scene {
    public name: string;
    public components: ComponentManager = new ComponentManager();
    public entities: EntityManager = new EntityManager();

    constructor(name: string) {
        this.name = name;
    }

    public addEntity(entity: GameEntity) {
        this.entities.add(entity);
    }

    public addComponent(entity: GameEntity, component: Component) {
        this.components.addComponent(entity, component);
    }

    public instantiate(prefab: Prefab, position: Vec3) {
        const entity = new GameEntity(prefab);

        if (prefab.transform) {
            entity.transform.position = prefab.transform.position ?? position;
            entity.transform.rotation = prefab.transform.rotation ?? new Quat(0, 0, 0, 1);
            entity.transform.scale = prefab.transform.scale ?? new Vec3(1, 1, 1);
        }
        const id = entity.id.getValue();
        entity.name = `${entity.name}_${id}`;

        if (!prefab.components) return;

        for (const component of prefab.components) {
            const clone = component.clone();
            this.addComponent(entity, clone);

            clone.transform.position = position;


        }

        return entity;
    }

    private activedCamera: Camera | null = null;

    public injectCamera(camera: Camera | null) {
        this.activedCamera = camera;
    }

public getActiveCamera(): Camera {

    if(this.activedCamera instanceof PerspectiveCamera) {
        this.activedCamera.aspect = Display.aspect;
    }
    
    if (this.activedCamera?.enabled) return this.activedCamera;

    const cam = this.components
        .getAllOfType<Camera>(ComponentType.Camera)
        .find(c => c.enabled);

    if (!cam) {
        throw new Error("No active camera found in the scene");
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

    public serialize() {
        return JSON.stringify({
            name: this.name,
            entities: serializeEntitiesMap(this.entities.getData()),
            components: serializeComponentMap(this.components.getData())
        }, undefined, 4);
    }
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
}