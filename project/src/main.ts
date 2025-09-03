import { EditorEngine } from "@editor/EditorEngine";
import { EngineResourceManager } from "@engine/core/managers/EngineResourceManager";
import type { EngineResource } from "@engine/core/managers/Resource";
import { SceneManager } from "@engine/core/managers/SceneManager";
import { AdvancedShaderSystem } from "@engine/modules/resources/material/AdvancedShaderSystem";
import { GizmosShaderSystem } from "@engine/modules/resources/material/GizmosShaderSystem";
import { SimpleShaderSystem } from "@engine/modules/resources/material/SimpleShaderSystem";
import { loadEngine } from "engine/main";
import { SimpleScene } from "examples/SimpleScene";


await loadEngine();

async function loadResources() {
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
  { name: "wireQuad", type: "mesh", path: "wireQuad" }
];


const scene = new SimpleScene();
SceneManager.addScene(scene);

const editor = new EditorEngine();
EngineResourceManager.loadResources(editor, resources);
editor.loadScene("SimpleScene")
editor.time.play();

const app = document.querySelector("#app") as HTMLDivElement;
app.appendChild(editor.engineWindow.container);
editor.engineWindow.resize();
