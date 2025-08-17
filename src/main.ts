import { Editor } from "./editor/EditorEngine";
import { FreeCameraSystem } from "./editor/FreeCamera";
import { GameEntity } from "./engine/core/base/GameEntity";
import { ImageFileLoader } from "./engine/core/loaders/ImageFileLoader";
import { TextFileLoader } from "./engine/core/loaders/TextFileLoader";
import { EngineResourceManager } from "./engine/core/managers/EngineResourceManager";
import { EngineSystem, EngineSystemManager } from "./engine/core/managers/EngineSystemManager";
import { Vec3 } from "./engine/core/math/Vec3";
import { Scene } from "./engine/core/scene/scene";
import { SceneManager } from "./engine/core/scene/SceneManager";
import { Engine } from "./engine/Engine";
import { ResourcesManager } from "./engine/global/manager/manager";
import { AdvancedShaderSystem } from "./engine/modules/resources/material/AdvancedShaderSystem";
import { SimpleShaderSystem } from "./engine/modules/resources/material/SimpleShaderSystem";
import { Material } from "./engine/modules/resources/material/types";
import { Texture } from "./engine/modules/resources/texture/types";
import { AnimatorSystem, PhysicsSystem, RenderSystem } from "./engine/modules/systems";
import { createFillSquareMesh } from "./engine/resources/geometries/Square";
import { createCamera as configureCamera } from "./game/entities/camera.entity";
import { createPlayer as configurePlayer } from "./game/entities/player.entity";
import { createSlime as configureSlime } from "./game/entities/slime.entity";
import { CameraSystem } from "./game/systems/CameraSystem";
import { CharacterControlerSystem } from "./game/systems/CharacterControlerSystem";
import { CharacterControllerAnimationSystem } from "./game/systems/CharacterControllerAnimationSystem";
import { InputSystem } from "./game/systems/InputSystem";
import { TerrainSystem } from "./game/systems/procedural-world/TerrainSystem";
import { GameLayout } from "./layout/GameLayout";

export class Game extends Engine {
    constructor() {
        super();
        this.display = new GameLayout(this);
    }
}

const squareMesh = createFillSquareMesh("fillSquare", new Vec3(1, 1, 0));
ResourcesManager.MeshManager.add("fillSquare", squareMesh);


const advancedMaterial = new Material({
    name: "advanced_material",
    shaderName: "advanced",
});



ResourcesManager.MaterialManager.add(advancedMaterial.name, advancedMaterial);
const advancedShader = new AdvancedShaderSystem();
ResourcesManager.ShaderSystemManager.add(advancedMaterial.name, advancedShader);

const simpleMaterial = new Material({
    name: "simpleMaterial",
    shaderName: "simple",
});

ResourcesManager.MaterialManager.add(simpleMaterial.name, simpleMaterial);
const simpleShader = new SimpleShaderSystem();
ResourcesManager.ShaderSystemManager.add(simpleMaterial.name, simpleShader);



const editor = new Editor();
const game = new Game();

EngineResourceManager.register("simpleShaderVertex", new TextFileLoader("./src/engine/assets/shaders/simpleShader.vert"));
EngineResourceManager.register("simpleShaderFragment", new TextFileLoader("./src/engine/assets/shaders/simpleShader.frag"));

EngineResourceManager.register("advancedShaderVertex", new TextFileLoader("./src/engine/assets/shaders/advancedShader.vert"));
EngineResourceManager.register("advancedShaderFragment", new TextFileLoader("./src/engine/assets/shaders/advancedShader.frag"));

EngineResourceManager.register("player", new ImageFileLoader("./src/game/assets/images/Player.png"));
EngineResourceManager.register("slime", new ImageFileLoader("./src/game/assets/images/Slime.png"));

await EngineResourceManager.load();

const playerTexture = new Texture("player", "player");
const slimeTexture = new Texture("slime", "slime");

game.compileShader("advanced", EngineResourceManager.get("advancedShaderVertex")!, EngineResourceManager.get("advancedShaderFragment")!);
game.compileShader("simple", EngineResourceManager.get("simpleShaderVertex")!, EngineResourceManager.get("simpleShaderFragment")!);

editor.compileShader("advanced", EngineResourceManager.get("advancedShaderVertex")!, EngineResourceManager.get("advancedShaderFragment")!);
editor.compileShader("simple", EngineResourceManager.get("simpleShaderVertex")!, EngineResourceManager.get("simpleShaderFragment")!);


game.compileTexture(playerTexture);
game.compileTexture(slimeTexture);
game.compileMesh(squareMesh);


editor.compileTexture(playerTexture);
editor.compileTexture(slimeTexture);
editor.compileMesh(squareMesh);


EngineSystemManager.register(EngineSystem.RenderSystem, () => new RenderSystem());
EngineSystemManager.register(EngineSystem.TerrainSystem, () => new TerrainSystem());
EngineSystemManager.register(EngineSystem.AnimatorSystem, () => new AnimatorSystem());
EngineSystemManager.register(EngineSystem.InputSystem, () => new InputSystem());
EngineSystemManager.register(EngineSystem.PhysicsSystem, () => new PhysicsSystem());
EngineSystemManager.register(EngineSystem.CameraSystem, () => new CameraSystem());
EngineSystemManager.register(EngineSystem.CharacterControlerSystem, () => new CharacterControlerSystem());
EngineSystemManager.register(EngineSystem.CharacterControlerAnimationSystem, () => new CharacterControllerAnimationSystem());


EngineSystemManager.register(EngineSystem.EditorFreeCameraSystem, () => new FreeCameraSystem());

game.useSystem(EngineSystem.RenderSystem);
game.useSystem(EngineSystem.AnimatorSystem);
game.useSystem(EngineSystem.InputSystem);
game.useSystem(EngineSystem.PhysicsSystem);
game.useSystem(EngineSystem.CharacterControlerSystem);
game.useSystem(EngineSystem.CharacterControlerAnimationSystem);
game.useSystem(EngineSystem.CameraSystem);
game.useSystem(EngineSystem.TerrainSystem);

editor.useSystem(EngineSystem.RenderSystem);

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

game.onLoadScene((scene) => {
    editor.unloadScene();
    editor.loadSceneByInstance(scene);
});

game.onStop(() => {
    editor.unloadScene();
    editor.loadScene("simple_scene");
})
editor.loadScene("simple_scene");
editor.getScene()?.serialize();
editor.time.play();