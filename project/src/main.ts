import { EditorEngine } from "@editor/EditorEngine";
import { ImageFileLoader } from "@engine/core/loaders/ImageFileLoader";
import { EngineResourceManager } from "@engine/core/managers/EngineResourceManager";
import type { EngineResource } from "@engine/core/managers/Resource";
import { SceneManager } from "@engine/core/managers/SceneManager";
import { AdvancedShaderSystem } from "@engine/modules/resources/material/AdvancedShaderSystem";
import { GizmosShaderSystem } from "@engine/modules/resources/material/GizmosShaderSystem";
import { SimpleShaderSystem } from "@engine/modules/resources/material/SimpleShaderSystem";
import { GameEngine } from "@game/GameEngine";
import { loadEngine } from "engine/main";
import { SimpleScene } from "examples/SimpleScene";



await loadEngine();

async function loadResources() {

  EngineResourceManager.register("player_image", new ImageFileLoader("../../game/src/assets/images/Player.png"))

  EngineResourceManager.register("KnightIdle", new ImageFileLoader("../../game/src/assets/Knight/Sprites/with_outline/IDLE.png"));
  EngineResourceManager.register("KnightWalk", new ImageFileLoader("../../game/src/assets/Knight/Sprites/with_outline/WALK.png"));
  EngineResourceManager.register("KnightRun", new ImageFileLoader("../../game/src/assets/Knight/Sprites/with_outline/RUN.png"));
  EngineResourceManager.register("KnightJump", new ImageFileLoader("../../game/src/assets/Knight/Sprites/with_outline/JUMP.png"));
  EngineResourceManager.register("KnightAttack1", new ImageFileLoader("../../game/src/assets/Knight/Sprites/with_outline/ATTACK 1.png"));
  EngineResourceManager.register("KnightDefend", new ImageFileLoader("../../game/src/assets/Knight/Sprites/with_outline/DEFEND.png"));
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
  { name: "primitives", type: "texture", path: "primitives" },
  { name: "grass", type: "texture", path: "grass_image" },
  { name: "fillQuad", type: "mesh", path: "fillQuad" },
  { name: "wireQuad", type: "mesh", path: "wireQuad" },

  { name: "wireCircle", type: "mesh", path: "wireCircle" },
  { name: "fillCircle", type: "mesh", path: "fillCircle" },

  { name: "wireLine", type: "mesh", path: "wireLine" },
  { name: "KnightIdle", type: "texture", path: "KnightIdle" },
  { name: "KnightWalk", type: "texture", path: "KnightWalk" },
  { name: "KnightRun", type: "texture", path: "KnightRun" },
  { name: "KnightJump", type: "texture", path: "KnightJump" },
  { name: "KnightAttack1", type: "texture", path: "KnightAttack1" },
  { name: "KnightDefend", type: "texture", path: "KnightDefend" },
];


const scene = new SimpleScene();
SceneManager.addScene(scene);

const editor = new EditorEngine();
EngineResourceManager.loadResources(editor, resources);
editor.loadScene("SimpleScene")
editor.time.play();


const game = new GameEngine();
EngineResourceManager.loadResources(game, resources);
game.loadScene("SimpleScene")
game.time.play();

const app = document.querySelector("#app") as HTMLDivElement;
app.appendChild(editor.engineWindow.container);
app.appendChild(game.engineWindow.container);
editor.engineWindow.resize();
game.engineWindow.resize();


document.body.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  event.stopImmediatePropagation();
}, { capture: true });