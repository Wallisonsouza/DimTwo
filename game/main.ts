import { GameEntity } from "@engine/core/base/GameEntity";
import { Display, EngineWindow } from "@engine/core/display/Display";
import { ImageFileLoader } from "@engine/core/loaders/ImageFileLoader";
import { EngineResourceManager } from "@engine/core/managers/EngineResourceManager";
import { EngineSystem, EngineSystemManager } from "@engine/core/managers/EngineSystemManager";
import { SceneManager } from "@engine/core/managers/SceneManager";
import { Scene } from "@engine/core/scene/scene";
import { Engine } from "@engine/Engine";
import { PerspectiveCamera } from "@engine/modules/3D/PerspesctiveCamera";
import { AdvancedShaderSystem } from "@engine/modules/resources/material/AdvancedShaderSystem";
import { GizmosShaderSystem } from "@engine/modules/resources/material/GizmosShaderSystem";
import { SimpleShaderSystem } from "@engine/modules/resources/material/SimpleShaderSystem";
import { AnimatorSystem } from "@engine/modules/shared/animator/AnimatorSystem";
import { ColliderSystem } from "@engine/modules/shared/collider/ColliderSystem";
import { PhysicsSystem } from "@engine/modules/shared/physics/PhysicsSystem";
import { RenderSystem } from "@engine/modules/shared/render/RenderSystem";
import { Texture } from "@engine/Rendering/Texture";
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

const app = document.querySelector("#app") as HTMLDivElement;





Display.setActive(0);





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

EngineSystemManager.register(EngineSystem.RenderSystem, () => new RenderSystem());
EngineSystemManager.register(EngineSystem.TerrainSystem, () => new TerrainSystem());
EngineSystemManager.register(EngineSystem.AnimatorSystem, () => new AnimatorSystem());
EngineSystemManager.register(EngineSystem.InputSystem, () => new InputSystem());
EngineSystemManager.register(EngineSystem.PhysicsSystem, () => new PhysicsSystem());
EngineSystemManager.register(EngineSystem.CharacterControlerSystem, () => new CharacterControlerSystem());
EngineSystemManager.register(EngineSystem.CharacterControlerAnimationSystem, () => new CharacterControllerAnimationSystem());
EngineSystemManager.register(EngineSystem.ColliderSystem, () => new ColliderSystem());
EngineSystemManager.register(EngineSystem.CameraSystem, () => new CameraSystem());


EngineSystemManager.register(EngineSystem.EditorGizmosSystem, () => new GizmosSystem());
EngineSystemManager.register(EngineSystem.EditorTransformSystem, () => new EditorTransformSystem());
EngineSystemManager.register(EngineSystem.EditorFreeCameraSystem, () => new EditorFreeCamera2DSystem());

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

















const gameWindow = new EngineWindow();
Display.addEngineWindow(gameWindow);
app.appendChild(gameWindow.container);

const game = new Engine(gameWindow);


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


game.enableSystem(EngineSystem.RenderSystem);
game.enableSystem(EngineSystem.AnimatorSystem);
game.enableSystem(EngineSystem.InputSystem);
game.enableSystem(EngineSystem.TerrainSystem);
game.enableSystem(EngineSystem.CharacterControlerAnimationSystem);
game.enableSystem(EngineSystem.CharacterControlerSystem);
game.enableSystem(EngineSystem.ColliderSystem);
game.enableSystem(EngineSystem.CameraSystem);

game.loadScene("simple_scene");
game.time.play();

//-------------------------__EDITOR-------------------------------


const editorWindow = new EngineWindow();
Display.addEngineWindow(editorWindow);
app.appendChild(editorWindow.container);

const editor = new Engine(editorWindow);

const editorCamera = new GameEntity({
  name: "editor_camera",
  tag: "EditorCamera",
});

editorCamera.transform.position.z = 10;
const cameraComponent = new PerspectiveCamera({
  entity: editorCamera

});


editor.forcedCamera = cameraComponent;

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
editor.compileTexture(treeTexture);
editor.compileTexture(busheTexture);
editor.compileTexture(grassTexture);
editor.compileMesh("fillQuad");
editor.compileMesh("wireQuad");

editor.enableSystem(EngineSystem.RenderSystem);
editor.enableSystem(EngineSystem.InputSystem);
editor.enableSystem(EngineSystem.EditorGizmosSystem);
editor.enableSystem(EngineSystem.EditorTransformSystem);
editor.enableSystem(EngineSystem.EditorFreeCameraSystem);

editor.loadScene("simple_scene");
editor.time.play();


editorWindow.resize();
gameWindow.resize();
