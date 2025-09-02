import { GameEntity } from "@engine/core/base/GameEntity";
import { ImageFileLoader } from "@engine/core/loaders/ImageFileLoader";
import { EngineResourceManager } from "@engine/core/managers/EngineResourceManager";
import { EngineSystem, EngineSystemManager } from "@engine/core/managers/EngineSystemManager";
import type { EngineResource } from "@engine/core/managers/Resource";
import { SceneManager } from "@engine/core/managers/SceneManager";
import { Scene } from "@engine/core/scene/scene";
import { EngineWindow } from "@engine/core/window/EngineWindow";
import { Engine } from "@engine/Engine";
import { PerspectiveCamera } from "@engine/modules/3D/PerspesctiveCamera";
import { AdvancedShaderSystem } from "@engine/modules/resources/material/AdvancedShaderSystem";
import { GizmosShaderSystem } from "@engine/modules/resources/material/GizmosShaderSystem";
import { SimpleShaderSystem } from "@engine/modules/resources/material/SimpleShaderSystem";
import { AnimatorSystem } from "@engine/modules/shared/animator/AnimatorSystem";
import { ColliderSystem } from "@engine/modules/shared/collider/ColliderSystem";
import { PhysicsSystem } from "@engine/modules/shared/physics/PhysicsSystem";
import { RenderSystem } from "@engine/modules/shared/render/RenderSystem";
import { configureCamera } from "@game/entities/CameraEntity";
import { configurePlayer } from "@game/entities/PlayerEntity";
import { configureSlime } from "@game/entities/SlimeEntity";
import { CameraSystem } from "@game/systems/CameraSystem";
import { CharacterControlerSystem } from "@game/systems/CharacterControlerSystem";
import { CharacterControllerAnimationSystem } from "@game/systems/CharacterControllerAnimationSystem";
import { EditorFreeCamera2DSystem } from "@game/systems/EditorFreeCamera2DSystem";
import { EditorTransformSystem } from "@game/systems/EditorTransformSystem";
import { GizmosSystem } from "@game/systems/GizmosSystem";
import { TerrainSystem } from "@game/systems/TerrainSystem";
import { loadEngine } from "engine/main";

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

  EngineSystemManager.register(EngineSystem.RenderSystem, () => new RenderSystem());
  EngineSystemManager.register(EngineSystem.TerrainSystem, () => new TerrainSystem());
  EngineSystemManager.register(EngineSystem.AnimatorSystem, () => new AnimatorSystem());
  EngineSystemManager.register(EngineSystem.PhysicsSystem, () => new PhysicsSystem());
  EngineSystemManager.register(EngineSystem.CharacterControlerSystem, () => new CharacterControlerSystem());
  EngineSystemManager.register(EngineSystem.CharacterControlerAnimationSystem, () => new CharacterControllerAnimationSystem());
  EngineSystemManager.register(EngineSystem.ColliderSystem, () => new ColliderSystem());
  EngineSystemManager.register(EngineSystem.CameraSystem, () => new CameraSystem());


  EngineSystemManager.register(EngineSystem.EditorGizmosSystem, () => new GizmosSystem());
  EngineSystemManager.register(EngineSystem.EditorTransformSystem, () => new EditorTransformSystem());
  EngineSystemManager.register(EngineSystem.EditorFreeCameraSystem, () => new EditorFreeCamera2DSystem());
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

//-------------------------__EDITOR-------------------------------


const editorWindow = new EngineWindow();
app.appendChild(editorWindow.container);

const editor = new Engine(editorWindow);
EngineResourceManager.loadResources(editor, resources);

const editorCamera = new GameEntity({
  name: "editor_camera",
  tag: "EditorCamera",
});

editorCamera.transform.position.z = 10;
const cameraComponent = new PerspectiveCamera({
  entity: editorCamera

});


editor.forcedCamera = cameraComponent;

editor.enableSystem(EngineSystem.RenderSystem);
editor.enableSystem(EngineSystem.EditorGizmosSystem);
editor.enableSystem(EngineSystem.EditorTransformSystem);
editor.enableSystem(EngineSystem.EditorFreeCameraSystem);

editor.loadScene("simple_scene");
editor.time.play();

const gameWindow = new EngineWindow();
const game = new Engine(gameWindow);
EngineResourceManager.loadResources(game, resources);



game.enableSystem(EngineSystem.RenderSystem);
game.enableSystem(EngineSystem.AnimatorSystem);
game.enableSystem(EngineSystem.TerrainSystem);
game.enableSystem(EngineSystem.CharacterControlerAnimationSystem);
game.enableSystem(EngineSystem.CharacterControlerSystem);
game.enableSystem(EngineSystem.ColliderSystem);
game.enableSystem(EngineSystem.CameraSystem);

game.loadScene("simple_scene");
game.time.play();



app.appendChild(gameWindow.container);

editorWindow.resize();
gameWindow.resize();