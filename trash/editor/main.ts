/* import { EngineResourceManager } from "@engine/core/managers/EngineResourceManager";
import { EngineSystem, EngineSystemManager } from "@engine/core/managers/EngineSystemManager";
import { Editor } from "./src/EditorEngine";
import { FreeCameraSystem } from "./src/FreeCamera";
import { GizmosSystem } from "./src/GizmosSystem";

export async function loadEditor() {


    
    const editor = new Editor();

    // editor
    editor.compileShader("advanced",
        EngineResourceManager.get("advancedShaderVertex")!,
        EngineResourceManager.get("advancedShaderFragment")!,
        "advancedShaderSystem"
    );

    editor.compileShader("simple",
        EngineResourceManager.get("simpleShaderVertex")!,
        EngineResourceManager.get("simpleShaderFragment")!,
        "simpleShaderSystem"
    );

    editor.compileShader("gizmos",
        EngineResourceManager.get("gizmosShaderVertex")!,
        EngineResourceManager.get("gizmosShaderFragment")!,
        "gizmosShaderSystem"
    );


    editor.compileTexture(playerTexture);
    editor.compileTexture(slimeTexture);
    editor.compileMesh(squareMesh);
    editor.compileMesh(gizmosQuad);

    EngineSystemManager.register(EngineSystem.EditorFreeCameraSystem, () => new FreeCameraSystem());
    EngineSystemManager.register(EngineSystem.EditorGizmosSystem, () => new GizmosSystem());
    EngineSystemManager.register(EngineSystem.EditorTransformSystem, () => new EditorTransformSystem());

    editor.enableSystem(EngineSystem.RenderSystem);
    editor.enableSystem(EngineSystem.EditorGizmosSystem);
    editor.enableSystem(EngineSystem.EditorTransformSystem);

    editor.display.addToDocument(app);
    editor.display.setResolution(1920, 1080);
    editor.loadScene("simple_scene");
    editor.time.play();
} */