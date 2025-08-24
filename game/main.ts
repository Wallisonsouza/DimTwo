import { GameEntity } from "@engine/core/base/GameEntity";
import { ImageFileLoader } from "@engine/core/loaders/ImageFileLoader";
import { EngineResourceManager } from "@engine/core/managers/EngineResourceManager";
import { EngineSystem, EngineSystemManager } from "@engine/core/managers/EngineSystemManager";
import { Vec3 } from "@engine/core/math/Vec3";
import { Scene } from "@engine/core/scene/scene";
import { SceneManager } from "@engine/core/scene/SceneManager";
import { Engine } from "@engine/Engine";
import { AdvancedShaderSystem } from "@engine/modules/resources/material/AdvancedShaderSystem";
import { Material } from "@engine/modules/resources/material/Material";
import { SimpleShaderSystem } from "@engine/modules/resources/material/SimpleShaderSystem";
import { Texture } from "@engine/modules/resources/texture/Texture";
import { AnimatorSystem, PhysicsSystem, RenderSystem } from "@engine/modules/systems";
import { Quad } from "@engine/resources/geometries/Square";
import { GameLayout } from "editor/layout/GameLayout";
import { loadEditor } from "editor/main";
import { Editor } from "editor/src/EditorEngine";
import { FreeCameraSystem } from "editor/src/FreeCamera";
import { GizmosSystem } from "editor/src/GizmosSystem";
import { GizmosShaderSystem } from "editor/src/tools/gizmos/GizmosShaderSystem";
import { loadEngine } from "engine/main";
import { configureCamera } from "./src/entities/cameraEntity";
import { configurePlayer } from "./src/entities/playerEntity";
import { configureSlime } from "./src/entities/slime.entity";
import { CameraSystem } from "./src/systems/CameraSystem";
import { CharacterControlerSystem } from "./src/systems/CharacterControlerSystem";
import { CharacterControllerAnimationSystem } from "./src/systems/CharacterControllerAnimationSystem";
import { InputSystem } from "./src/systems/InputSystem";
import { TerrainSystem } from "./src/systems/procedural-world/TerrainSystem";

await loadEngine();
await loadEditor();

export class GameEngine extends Engine {
    constructor() {
        super();
        this.display = new GameLayout(this);
    }
}

const squareMesh = Quad.createFillQuadMesh("fillQuad", new Vec3(1, 1, 0));
const gizmosQuad = Quad.createWireQuadMesh("wireQuad", new Vec3(1, 1, 0));

new Material({ name: "advancedMaterial", shaderName: "advanced", transparent: true });
new Material({ name: "simpleMaterial", shaderName: "simple" });
new Material({ name: "gizmosMaterial", shaderName: "gizmos" });



const editor = new Editor();
const game = new GameEngine();



const playerTexture = new Texture("player", "player");
const slimeTexture = new Texture("slime", "slime");

EngineResourceManager.register(
    "player",
    new ImageFileLoader("../game/src/assets/images/Player.png")
);

EngineResourceManager.register(
    "slime",
    new ImageFileLoader("../game/src/assets/images/Slime.png")
);

await EngineResourceManager.load();



// systems
new AdvancedShaderSystem("advancedShaderSystem");
new SimpleShaderSystem("simpleShaderSystem");
new GizmosShaderSystem("gizmosShaderSystem");

// game
game.compileShader("advanced",
    EngineResourceManager.get("advancedShaderVertex")!,
    EngineResourceManager.get("advancedShaderFragment")!,
    "advancedShaderSystem"

);
game.compileShader("simple",
    EngineResourceManager.get("simpleShaderVertex")!,
    EngineResourceManager.get("simpleShaderFragment")!,
    "simpleShaderSystem"
);

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



game.compileTexture(playerTexture);
game.compileTexture(slimeTexture);
game.compileMesh(squareMesh);


editor.compileTexture(playerTexture);
editor.compileTexture(slimeTexture);
editor.compileMesh(squareMesh);
editor.compileMesh(gizmosQuad);

EngineSystemManager.register(EngineSystem.RenderSystem, () => new RenderSystem());
EngineSystemManager.register(EngineSystem.TerrainSystem, () => new TerrainSystem());
EngineSystemManager.register(EngineSystem.AnimatorSystem, () => new AnimatorSystem());
EngineSystemManager.register(EngineSystem.InputSystem, () => new InputSystem());
EngineSystemManager.register(EngineSystem.PhysicsSystem, () => new PhysicsSystem());
EngineSystemManager.register(EngineSystem.CameraSystem, () => new CameraSystem());
EngineSystemManager.register(EngineSystem.CharacterControlerSystem, () => new CharacterControlerSystem());
EngineSystemManager.register(EngineSystem.CharacterControlerAnimationSystem, () => new CharacterControllerAnimationSystem());


game.enableSystem(EngineSystem.RenderSystem);
game.enableSystem(EngineSystem.AnimatorSystem);
game.enableSystem(EngineSystem.InputSystem);
game.enableSystem(EngineSystem.PhysicsSystem);
game.enableSystem(EngineSystem.CharacterControlerSystem);
game.enableSystem(EngineSystem.CharacterControlerAnimationSystem);
game.enableSystem(EngineSystem.CameraSystem);
game.enableSystem(EngineSystem.TerrainSystem);

EngineSystemManager.register(EngineSystem.EditorFreeCameraSystem, () => new FreeCameraSystem());
EngineSystemManager.register(EngineSystem.EditorGizmosSystem, () => new GizmosSystem());
editor.enableSystem(EngineSystem.RenderSystem);
editor.enableSystem(EngineSystem.EditorGizmosSystem);













//-------------------
const scene = new Scene("simple_scene");
SceneManager.addScene(scene);

const playerEntity = new GameEntity({ name: "player", tag: "Player" });
configurePlayer(scene, playerEntity);

scene.addEntity(playerEntity);

const slimeEntity = new GameEntity({ name: "slime", tag: "Enemy" });
configureSlime(scene, slimeEntity);
scene.addEntity(slimeEntity);

const cameraEntity = new GameEntity({ name: "camera", tag: "MainCamera" });
configureCamera(scene, cameraEntity);
scene.addEntity(cameraEntity);


const app = document.querySelector("#app") as HTMLDivElement;
editor.display.addToDocument(app);
game.display.addToDocument(app);
editor.display.setResolution(1920, 1080);
game.display.setResolution(1920, 1080);

editor.loadScene("simple_scene");
editor.time.play();

game.onLoadScene((scene) => {
    editor.unloadScene();
    editor.loadSceneByInstance(scene);
});

game.onStop(() => {
    editor.unloadScene();
    editor.loadScene("simple_scene");
})
