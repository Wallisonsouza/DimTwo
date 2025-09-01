import { Vec3 } from "@engine/core/math/Vec3";
import { Quad } from "@engine/modules/resources/Quad";
import { Material } from "@engine/Rendering/Material";
import { TextFileLoader } from "./src/core/loaders/TextFileLoader";
import { EngineResourceManager } from "./src/core/managers/EngineResourceManager";

export async function loadEngine() {

    Quad.createFillQuadMesh("fillQuad", new Vec3(1, 1, 0));
    Quad.createWireQuadMesh("wireQuad", new Vec3(1, 1, 0));

    new Material({ name: "advancedMaterial", shaderName: "advanced", transparent: true });
    new Material({ name: "simpleMaterial", shaderName: "simple" });
    new Material({ name: "gizmosMaterial", shaderName: "gizmos" });

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

