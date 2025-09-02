import type { Engine } from "@engine/Engine";
import { Texture } from "@engine/Rendering/Texture";
import type { System } from "../base/System";
import type { EngineResourceManager } from "./EngineResourceManager";
import type { EngineResource } from "./Resource";

export enum EngineSystem {
    RenderSystem,
    EditorRenderSystem,
    CameraSystem,
    EditorFreeCameraSystem,
    AnimatorSystem,
    PhysicsSystem,
    ColliderSystem,
    CharacterControlerSystem,
    CharacterControlerAnimationSystem,
    EditorGizmosSystem,
    EditorTransformSystem,
    TerrainSystem
}

type SystemFactory = () => System;

export class EngineSystemManager {

    private static readonly builders: Map<EngineSystem, SystemFactory> = new Map();

    public static register(key: EngineSystem, factory: SystemFactory): void {
        if (this.builders.has(key)) {
            throw new Error(`Factory already registered for ${EngineSystem[key]}`);
        }
        this.builders.set(key, factory);
    }

    public static create(key: EngineSystem): System | null {
        const factory = this.builders.get(key);
        return factory ? factory() : null;
    }

    public static has(key: EngineSystem): boolean {
        return this.builders.has(key);
    }

    

}
