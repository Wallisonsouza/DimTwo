import { GameEntity } from "@engine/core/base/GameEntity";
import { Display } from "@engine/core/display/Display";
import { ImageFileLoader } from "@engine/core/loaders/ImageFileLoader";
import { EngineResourceManager } from "@engine/core/managers/EngineResourceManager";
import { EngineSystem, EngineSystemManager } from "@engine/core/managers/EngineSystemManager";
import { SceneManager } from "@engine/core/managers/SceneManager";
import { Scene } from "@engine/core/scene/scene";
import { Engine } from "@engine/Engine";
import { AdvancedShaderSystem } from "@engine/modules/resources/material/AdvancedShaderSystem";
import { GizmosShaderSystem } from "@engine/modules/resources/material/GizmosShaderSystem";
import { SimpleShaderSystem } from "@engine/modules/resources/material/SimpleShaderSystem";
import { Texture } from "@engine/modules/resources/texture/Texture";
import { AnimatorSystem, ColliderSystem, PhysicsSystem, RenderSystem } from "@engine/modules/systems";
import { configureCamera } from "@game/entities/CameraEntity";
import { configurePlayer } from "@game/entities/PlayerEntity";
import { configureSlime } from "@game/entities/SlimeEntity";
import { CameraSystem } from "@game/systems/CameraSystem";
import { CharacterControlerSystem } from "@game/systems/CharacterControlerSystem";
import { CharacterControllerAnimationSystem } from "@game/systems/CharacterControllerAnimationSystem";
import { EditorFreeCamera2DSystem } from "@game/systems/EditorFreeCamera2DSystem";
import { EditorTransformSystem } from "@game/systems/EditorTransformSystem";
import { GizmosSystem } from "@game/systems/GizmosSystem";
import { InputSystem } from "@game/systems/InputSystem";
import { TerrainSystem } from "@game/systems/TerrainSystem";
import { loadEngine } from "engine/main";

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
new GizmosShaderSystem("gizmosShaderSystem");

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
    "gizmosShaderSystem"
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

EngineSystemManager.register(EngineSystem.EditorTransformSystem, () => new EditorTransformSystem());
EngineSystemManager.register(EngineSystem.EditorFreeCameraSystem, () => new EditorFreeCamera2DSystem());


game.enableSystem(EngineSystem.RenderSystem);
game.enableSystem(EngineSystem.AnimatorSystem);
game.enableSystem(EngineSystem.InputSystem);
game.enableSystem(EngineSystem.TerrainSystem); 
game.enableSystem(EngineSystem.CharacterControlerAnimationSystem);
game.enableSystem(EngineSystem.ColliderSystem);

game.enableSystem(EngineSystem.EditorGizmosSystem);
game.enableSystem(EngineSystem.EditorTransformSystem);
game.enableSystem(EngineSystem.EditorFreeCameraSystem);
//-------------------
const scene = new Scene("simple_scene");
SceneManager.addScene(scene);

const playerEntity = new GameEntity({ name: "player", tag: "Player" });
scene.addEntity(playerEntity);
configurePlayer(scene, playerEntity);

const slimeEntity = new GameEntity({ name: "slime", tag: "Enemy" });
scene.addEntity(slimeEntity);
configureSlime(scene, slimeEntity);

const cameraEntity = new GameEntity({ name: "camera", tag: "MainCamera" });
scene.addEntity(cameraEntity);
configureCamera(scene, cameraEntity);

const app = document.querySelector("#app") as HTMLDivElement;
game.display.addToDocument(app);


game.loadScene("simple_scene");
game.time.play();



function createHierarchy(scene: Scene, parent: HTMLDivElement) {
    const container = document.createElement("div");
    container.className = "hierarchy";
    for (const entity of scene.entities.getAll()) {
        const entityElement = document.createElement("div");
        entityElement.className = "entityElement";
        entityElement.innerText = entity.name;

        container.appendChild(entityElement);
    }

    parent.appendChild(container);
}

createHierarchy(scene, document.querySelector("#app")!);

game.display.updateDimensions();
Display.setFocused(game.display)
