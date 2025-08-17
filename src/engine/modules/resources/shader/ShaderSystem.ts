import type { Scene } from "../../../core/scene/scene";
import type { Engine } from "../../../Engine";
import type { Shader } from "./Shader";

export class ShaderSystem {
    global?(engine: Engine, scene: Scene, shader: Shader): void;
    local?(engine: Engine, entityID: number, scene: Scene, shader: Shader ): void;
}
