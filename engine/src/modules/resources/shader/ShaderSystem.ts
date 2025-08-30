import type { GameEntity } from "@engine/core/base/GameEntity";
import type { Scene } from "../../../core/scene/scene";
import type { Engine } from "../../../Engine";
import { ResourcesManager } from "../../../global/manager/manager";
import type { Shader } from "./Shader";

export class ShaderSystem {
    name: string;

    global?(engine: Engine, scene: Scene, shader: Shader): void;
    local?(engine: Engine, gameEntity: GameEntity, scene: Scene, shader: Shader): void;

    test?(): void;

    constructor(name: string) {
        this.name = name;
        ResourcesManager.ShaderSystemManager.add(this.name, this);
    }
}
