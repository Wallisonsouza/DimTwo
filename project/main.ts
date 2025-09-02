import { EditorEngine } from "@editor/EditorEngine";
import { ImageFileLoader } from "@engine/core/loaders/ImageFileLoader";
import { EngineResourceManager } from "@engine/core/managers/EngineResourceManager";
import { EngineSystem, EngineSystemManager } from "@engine/core/managers/EngineSystemManager";
import type { EngineResource } from "@engine/core/managers/Resource";
import { AdvancedShaderSystem } from "@engine/modules/resources/material/AdvancedShaderSystem";
import { GizmosShaderSystem } from "@engine/modules/resources/material/GizmosShaderSystem";
import { SimpleShaderSystem } from "@engine/modules/resources/material/SimpleShaderSystem";
import { AnimatorSystem } from "@engine/modules/shared/animator/AnimatorSystem";
import { ColliderSystem } from "@engine/modules/shared/collider/ColliderSystem";
import { PhysicsSystem } from "@engine/modules/shared/physics/PhysicsSystem";
import { RenderSystem } from "@engine/modules/shared/render/RenderSystem";
import { SimpleScene } from "@game/SimpleScene";
import { CameraSystem } from "@game/systems/CameraSystem";
import { CharacterControlerSystem } from "@game/systems/CharacterControlerSystem";
import { CharacterControllerAnimationSystem } from "@game/systems/CharacterControllerAnimationSystem";
import { EditorFreeCamera2DSystem } from "@game/systems/EditorFreeCamera2DSystem";
import { EditorTransformSystem } from "@game/systems/EditorTransformSystem";
import { GizmosSystem } from "@game/systems/GizmosSystem";
import { TerrainSystem } from "@game/systems/TerrainSystem";
import { loadEngine } from "engine/main";
import { GameEngine } from "game/GameEngine";

await loadEngine();

async function loadResources() {
    EngineResourceManager.register(
        "player_image",
        new ImageFileLoader("../game/src/assets/images/Player.png")
    );

    EngineResourceManager.register(
        "slime_image",
        new ImageFileLoader("../game/src/assets/images/Slime.png")
    );

    EngineResourceManager.register(
        "tree_image",
        new ImageFileLoader("../game/src/assets/images/Tree.png")
    );

    EngineResourceManager.register(
        "bushe_image",
        new ImageFileLoader("../game/src/assets/images/Bushes.png")
    );

    EngineResourceManager.register(
        "grass_image",
        new ImageFileLoader("../game/src/assets/images/Grass.png")
    );

    await EngineResourceManager.load();

    new AdvancedShaderSystem("advancedShaderSystem");
    new SimpleShaderSystem("simpleShaderSystem");
    new GizmosShaderSystem("gizmosShaderSystem");

}

await loadResources();

const resources: EngineResource[] = [
    { name: "advanced", type: "shader", vert: "advancedShaderVertex", frag: "advancedShaderFragment", system: "advancedShaderSystem" },
    { name: "simple", type: "shader", vert: "simpleShaderVertex", frag: "simpleShaderFragment", system: "simpleShaderSystem" },
    { name: "gizmos", type: "shader", vert: "gizmosShaderVertex", frag: "gizmosShaderFragment", system: "gizmosShaderSystem" },
    { name: "player", type: "texture", path: "player_image" },
    { name: "slime", type: "texture", path: "slime_image" },
    { name: "tree", type: "texture", path: "tree_image" },
    { name: "bushe", type: "texture", path: "bushe_image" },
    { name: "grass", type: "texture", path: "grass_image" },
    { name: "fillQuad", type: "mesh", path: "fillQuad" },
    { name: "wireQuad", type: "mesh", path: "wireQuad" }
];


new SimpleScene();

EngineSystemManager.register(EngineSystem.EditorGizmosSystem, () => new GizmosSystem());
EngineSystemManager.register(EngineSystem.EditorTransformSystem, () => new EditorTransformSystem());
EngineSystemManager.register(EngineSystem.EditorFreeCameraSystem, () => new EditorFreeCamera2DSystem());
EngineSystemManager.register(EngineSystem.RenderSystem, () => new RenderSystem());
EngineSystemManager.register(EngineSystem.TerrainSystem, () => new TerrainSystem());
EngineSystemManager.register(EngineSystem.AnimatorSystem, () => new AnimatorSystem());
EngineSystemManager.register(EngineSystem.PhysicsSystem, () => new PhysicsSystem());
EngineSystemManager.register(EngineSystem.CharacterControlerSystem, () => new CharacterControlerSystem());
EngineSystemManager.register(EngineSystem.CharacterControlerAnimationSystem, () => new CharacterControllerAnimationSystem());
EngineSystemManager.register(EngineSystem.ColliderSystem, () => new ColliderSystem());
EngineSystemManager.register(EngineSystem.CameraSystem, () => new CameraSystem());

const editor = new EditorEngine();
EngineResourceManager.loadResources(editor, resources);
editor.loadScene("SimpleScene");
editor.time.play();

const game = new GameEngine();
EngineResourceManager.loadResources(game, resources);
game.loadScene("SimpleScene");
game.time.play();

const app = document.querySelector("#app") as HTMLDivElement;
app.appendChild(game.targetWindow.canvas);
app.appendChild(editor.targetWindow.canvas);

editor.targetWindow.resize();
game.targetWindow.resize();