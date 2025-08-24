import type { Component } from "@engine/core/base/Component";
import { type GameEntityOptions } from "@engine/core/base/GameEntity";
import { Vec3 } from "@engine/core/math/Vec3";
import { SpriteRender } from "@engine/modules/components/render/SpriteRender";
import { Transform } from "@engine/modules/components/spatial/Transform";
import { BUSHES } from "@game/sprites/Bushes";
import { OAK_TRE_0, OAK_TRE_1 } from "@game/sprites/Trees";

export interface Prefab extends GameEntityOptions {
    components?: Component[];
    resources?: ResourceReference[];
}

export interface ResourceReference {
    type: "texture" | "shader" | "mesh" | "material" | string;
    id: string;
}

export const OAK_TREE_PREFAB: Prefab = {
    name: "tree",
    tag: "Tree",
    components: [
        new Transform({ scale: new Vec3(2, 3, 0) }),
        new SpriteRender({ material: "advancedMaterial", layer: 2, sprite: OAK_TRE_0 }),
    ],
    resources: [
        { type: "texture", id: "treeTexture" },
        { type: "shader", id: "treeShader" },
        { type: "shader", id: "treeShader" }
    ],
};

export const PINE_TREE_PREFAB: Prefab = {
    name: "tree",
    tag: "Tree",
    components: [
        new Transform({ scale: new Vec3(2, 3, 0) }),
        new SpriteRender({ material: "advancedMaterial", layer: 2, sprite: OAK_TRE_1 }),
    ],
    resources: [
        { type: "texture", id: "treeTexture" },
        { type: "shader", id: "treeShader" },
        { type: "shader", id: "treeShader" }
    ],
};


export const GROUND_PREFAB: Prefab = {
    name: "tree",
    tag: "Tree",
    components: [
        new Transform({ scale: new Vec3(1, 1, 0) }),
        new SpriteRender({ material: "simpleMaterial", layer: 2, sprite: OAK_TRE_0 }),
    ],
    resources: [
        { type: "texture", id: "treeTexture" },
        { type: "shader", id: "treeShader" },
        { type: "shader", id: "treeShader" }
    ],
};


export const BUSHE_0_PREFAB: Prefab = {
    name: "tree",
    tag: "Tree",
    components: [
        new Transform({ scale: new Vec3(0.8, 0.8, 0) }),
        new SpriteRender({ material: "advancedMaterial", layer: 2, sprite: BUSHES[0] }),
    ],
    resources: [
        { type: "texture", id: "treeTexture" },
        { type: "shader", id: "treeShader" },
        { type: "shader", id: "treeShader" }
    ],
};

export const BUSHE_1_PREFAB: Prefab = {
    name: "tree",
    tag: "Tree",
    components: [
        new Transform({ scale: new Vec3(0.8, 0.8, 0) }),
        new SpriteRender({ material: "advancedMaterial", layer: 2, sprite: BUSHES[1] }),
    ],
    resources: [
        { type: "texture", id: "treeTexture" },
        { type: "shader", id: "treeShader" },
        { type: "shader", id: "treeShader" }
    ],
};


export const BUSHE_2_PREFAB: Prefab = {
    name: "tree",
    tag: "Tree",
    components: [
        new Transform({ scale: new Vec3(0.8, 0.8, 0) }),
        new SpriteRender({ material: "advancedMaterial", layer: 2, sprite: BUSHES[2] }),
    ],
    resources: [
        { type: "texture", id: "treeTexture" },
        { type: "shader", id: "treeShader" },
        { type: "shader", id: "treeShader" }
    ],
};


export const BUSHE_3_PREFAB: Prefab = {
    name: "tree",
    tag: "Tree",
    components: [
        new Transform({ scale: new Vec3(0.8, 0.8, 0) }),
        new SpriteRender({ material: "advancedMaterial", layer: 2, sprite: BUSHES[3] }),
    ],
    resources: [
        { type: "texture", id: "treeTexture" },
        { type: "shader", id: "treeShader" },
        { type: "shader", id: "treeShader" }
    ],
};

