import type { Component } from "@engine/core/base/Component";
import { type GameEntityOptions } from "@engine/core/base/GameEntity";
import { Quat } from "@engine/core/math/quat";
import { Vec3 } from "@engine/core/math/Vec3";
import { BoxCollider2D } from "@engine/modules/2D/BoxCollider2D";
import { SpriteRender2D } from "@engine/modules/2D/SpriteRender2D";
import { type TransformOptions } from "@engine/modules/3D/Transform";
import { CollisionLayer } from "@engine/modules/shared/physics/CollisionLayer";
import { Physics } from "@engine/modules/shared/physics/Physics";
import { BUSHES } from "@game/sprites/Bushes";
import { GRASS_0_SPRITE } from "@game/sprites/Grass";
import { OAK_TRE_0 } from "@game/sprites/Trees";

export interface Prefab extends GameEntityOptions {
    components?: Component[];
    transform?: TransformOptions;
}

export interface ResourceReference {
    type: "texture" | "shader" | "mesh" | "material" | string;
    id: string;
}

export const OAK_TREE_PREFAB: Prefab = {
    name: "OakTree",
    tag: "Tree",

    transform: {
        position: new Vec3(10, -2, 0),
        scale: new Vec3(2, 3, 0),
        rotation: new Quat(0, 0, 0, 1)
    },

    components: [
        new SpriteRender2D({
            material: "advancedMaterial",
            layer: 2,
            sprite: OAK_TRE_0
        }),
        new BoxCollider2D({
            collisionLayer: CollisionLayer.Tree
        }),
    ],
};


export const GROUND_PREFAB: Prefab = {
    name: "Ground",
    tag: "Ground",

    transform: {
        scale: new Vec3(1, 1, 0)
    },

    components: [
        new SpriteRender2D({
            material: "simpleMaterial",
            layer: 2,
            sprite: OAK_TRE_0
        }),
    ],
};

export const BUSHE_0_PREFAB: Prefab = {
    name: "Bush0",
    tag: "Bush",

    transform: {
        scale: new Vec3(0.8, 0.8, 0)
    },

    components: [
        new SpriteRender2D({
            material: "advancedMaterial",
            sprite: BUSHES[0]
        }),
    ],
};

export const BUSHE_1_PREFAB: Prefab = {
    name: "Bush1",
    tag: "Bush",

    transform: {
        scale: new Vec3(0.8, 0.8, 0)
    },

    components: [
        new SpriteRender2D({
            material: "advancedMaterial",
            sprite: BUSHES[1]
        }),
    ],
};

export const BUSHE_2_PREFAB: Prefab = {
    name: "Bush2",
    tag: "Bush",

    transform: {
        scale: new Vec3(1.2, 0.8, 0)
    },

    components: [
        new SpriteRender2D({
            material: "advancedMaterial",
            sprite: BUSHES[2]
        }),
    ],
};

export const BUSHE_3_PREFAB: Prefab = {
    name: "Bush3",
    tag: "Bush",

    transform: {
        scale: new Vec3(1.6, 0.8, 0)
    },

    components: [
        new SpriteRender2D({
            material: "advancedMaterial",
            sprite: BUSHES[3]
        }),
    ],
};

export const BUSHE_4_PREFAB: Prefab = {
    name: "Bush4",
    tag: "Bush",

    transform: {
        scale: new Vec3(0.8, 0.8, 0)
    },

    components: [
        new SpriteRender2D({
            material: "advancedMaterial",
            sprite: BUSHES[4]
        }),
    ],
};

export const BUSHE_5_PREFAB: Prefab = {
    name: "Bush5",
    tag: "Bush",

    transform: {
        scale: new Vec3(0.8, 0.8, 0)
    },

    components: [
        new SpriteRender2D({
            material: "advancedMaterial",
            sprite: BUSHES[5]
        }),
    ],
};

export const BUSHE_6_PREFAB: Prefab = {
    name: "Bush6",
    tag: "Bush",

    transform: {
        scale: new Vec3(0.8, 0.8, 0)
    },

    components: [
        new SpriteRender2D({
            material: "advancedMaterial",
            sprite: BUSHES[6]
        }),
    ],
};

export const GRASS_0_PREFAB: Prefab = {
    name: "Grass0",
    tag: "Grass",

    transform: {
        scale: new Vec3(1.3, 1, 0)
    },

    components: [
        new SpriteRender2D({
            material: "advancedMaterial",
            sprite: GRASS_0_SPRITE
        }),
        new BoxCollider2D({
            collisionLayer: CollisionLayer.Grass
        }),
    ],
};


Physics.collisionMatrix.setCollision(CollisionLayer.Player, CollisionLayer.Enemy, true);