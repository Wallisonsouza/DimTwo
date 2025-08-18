import { TextFileLoader } from "./src/core/loaders/TextFileLoader";
import { EngineResourceManager } from "./src/core/managers/EngineResourceManager";

export async function loadEngine() {

    // simple
    EngineResourceManager.register(
        "simpleShaderVertex",
        new TextFileLoader("../engine/src/assets/shaders/simpleShader.vert")
    );

    EngineResourceManager.register(
        "simpleShaderFragment",
        new TextFileLoader("../engine/src/assets/shaders/simpleShader.frag")
    );

    // advanced
    EngineResourceManager.register(
        "advancedShaderVertex",
        new TextFileLoader("../engine/src/assets/shaders/advancedShader.vert")
    );

    EngineResourceManager.register(
        "advancedShaderFragment",
        new TextFileLoader("../engine/src/assets/shaders/advancedShader.frag")
    );

    // gizmos
    EngineResourceManager.register(
        "gizmosShaderFragment",
        new TextFileLoader("../engine/src/assets/shaders/gizmos.frag")
    );

    EngineResourceManager.register(
        "gizmosShaderVertex",
        new TextFileLoader("../engine/src/assets/shaders/gizmos.vert")
    );

    await EngineResourceManager.load();
}

