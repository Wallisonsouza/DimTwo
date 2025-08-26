import { GameEntity } from "@engine/core/base/GameEntity";
import { ImageFileLoader } from "@engine/core/loaders/ImageFileLoader";
import { EngineResourceManager } from "@engine/core/managers/EngineResourceManager";
import { EngineSystem, EngineSystemManager } from "@engine/core/managers/EngineSystemManager";
import { Scene } from "@engine/core/scene/scene";
import { SceneManager } from "@engine/core/scene/SceneManager";
import { Engine } from "@engine/Engine";
import { AdvancedShaderSystem } from "@engine/modules/resources/material/AdvancedShaderSystem";
import { SimpleShaderSystem } from "@engine/modules/resources/material/SimpleShaderSystem";
import { Texture } from "@engine/modules/resources/texture/Texture";
import { AnimatorSystem, ColliderSystem, PhysicsSystem, RenderSystem } from "@engine/modules/systems";
import { GizmosSystem } from "@game/systems/GizmosSystem";
import { loadEngine } from "engine/main";
import { configureCamera } from "./src/entities/CameraEntity";
import { configurePlayer } from "./src/entities/PlayerEntity";
import { configureSlime } from "./src/entities/SlimeEntity";
import { CameraSystem } from "./src/systems/CameraSystem";
import { CharacterControlerSystem } from "./src/systems/CharacterControlerSystem";
import { CharacterControllerAnimationSystem } from "./src/systems/CharacterControllerAnimationSystem";
import { InputSystem } from "./src/systems/InputSystem";
import { TerrainSystem } from "./src/systems/TerrainSystem";

await loadEngine();

const game = new Engine();

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


const playerTexture = new Texture("player", "player_image");
const slimeTexture = new Texture("slime", "slime_image");
const treeTexture = new Texture("tree", "tree_image");
const busheTexture = new Texture("bushe", "bushe_image");
const grassTexture = new Texture("grass", "grass_image");

new AdvancedShaderSystem("advancedShaderSystem");
new SimpleShaderSystem("simpleShaderSystem");

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

game.compileShader("gizmos",
    EngineResourceManager.get("gizmosShaderVertex")!,
    EngineResourceManager.get("gizmosShaderFragment")!,
    "simpleShaderSystem"
);

game.compileTexture(playerTexture);
game.compileTexture(slimeTexture);
game.compileTexture(treeTexture);
game.compileTexture(busheTexture);
game.compileTexture(grassTexture);
game.compileMesh("fillQuad");
game.compileMesh("wireQuad");

EngineSystemManager.register(EngineSystem.RenderSystem, () => new RenderSystem());
EngineSystemManager.register(EngineSystem.TerrainSystem, () => new TerrainSystem());
EngineSystemManager.register(EngineSystem.AnimatorSystem, () => new AnimatorSystem());
EngineSystemManager.register(EngineSystem.InputSystem, () => new InputSystem());
EngineSystemManager.register(EngineSystem.PhysicsSystem, () => new PhysicsSystem());
EngineSystemManager.register(EngineSystem.CameraSystem, () => new CameraSystem());
EngineSystemManager.register(EngineSystem.CharacterControlerSystem, () => new CharacterControlerSystem());
EngineSystemManager.register(EngineSystem.CharacterControlerAnimationSystem, () => new CharacterControllerAnimationSystem());
EngineSystemManager.register(EngineSystem.EditorGizmosSystem, () => new GizmosSystem());
EngineSystemManager.register(EngineSystem.ColliderSystem, () => new ColliderSystem());


game.enableSystem(EngineSystem.RenderSystem);
game.enableSystem(EngineSystem.AnimatorSystem);
game.enableSystem(EngineSystem.InputSystem);
game.enableSystem(EngineSystem.PhysicsSystem);
game.enableSystem(EngineSystem.CharacterControlerSystem);
game.enableSystem(EngineSystem.CharacterControlerAnimationSystem);
game.enableSystem(EngineSystem.CameraSystem);
game.enableSystem(EngineSystem.EditorGizmosSystem);
game.enableSystem(EngineSystem.ColliderSystem);
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
game.display.addToDocument(app);

game.display.setResolution(1920, 1080);
game.loadScene("simple_scene");
game.time.play();