import type { Prefab } from "@game/systems/Prefab";
import { Camera } from "../../modules/components/render/Camera";
import { ComponentType } from "../../modules/enums/ComponentType";
import { Component } from "../base/Component";
import { GameEntity } from "../base/GameEntity";
import { ComponentManager } from "../managers/ComponentManager";
import { EntityManager } from "../managers/EntityManager";
import { Vec3 } from "../math/Vec3";
import { Quat } from "../math/quat";

export class Scene {
    public name: string;
    public components: ComponentManager = new ComponentManager();
    public entities: EntityManager = new EntityManager();

    private camera: Camera | null = null;
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

    private injectedCamera: Camera | null = null;

    public injectCamera(camera: Camera | null) {
        this.injectedCamera = camera;
    }

    public getActiveCamera(): Camera {

        if (this.injectedCamera) return this.injectedCamera;

        if (this.camera && this.camera.enabled) return this.camera;

        const cameras = this.components.getAllOfType<Camera>(ComponentType.Camera);
        const activeCamera = cameras.find(c => c.enabled);

        if (!activeCamera) {
            throw new Error("No active camera found in the scene");
        }

        this.camera = activeCamera;
        return this.camera;
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

/*     serialize(): string {
        return JSON.stringify(
            {
                name: this.name,
                entities: this.entities.getAll().map(e => serializeValue(e)),
                components: serializeComponentMap(this.components.getData())
            },
            undefined,
            4
        );
    }


function serializeValue(value: any): any {
    if (value instanceof Map) {
        return serializeComponentMap(value);
    } else if (value instanceof Array) {
        return value.map(v => serializeValue(v));
    } else if (value?.x !== undefined && value?.y !== undefined) {
        // Vec2 ou Vec3
        const arr = [value.x, value.y];
        if (value.z !== undefined) arr.push(value.z);
        if (value.w !== undefined) arr.push(value.w);
        return arr;
    } else if (value?.data !== undefined && typeof value.data === 'object') {
        // Matriz (ex: Mat4)
        // Assumindo que `data` é um objeto com índices numéricos
        return Object.values(value.data);
    } else if (typeof value === 'object' && value !== null) {
        const obj: any = {};
        for (const k in value) {
            obj[k] = serializeValue(value[k]);
        }
        return obj;
    } else {
        return value;
    }
}

function serializeComponentMap(map: Map<string, Map<number, any>>): any {
    const result: any = {};
    for (const [componentType, componentMap] of map) {
        const componentsArray = Array.from(componentMap.values()).map(c => serializeValue(c));
        result[componentType] = componentsArray;
    }
    return result;
} */
