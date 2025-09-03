import { EditorEngine } from "@editor/EditorEngine";
import { EditorFreeCamera2DSystem } from "@editor/EditorFreeCamera2DSystem";
import { EditorTransformSystem } from "@editor/EditorTransformSystem";
import { GizmosSystem } from "@editor/GizmosSystem";
import { EngineResourceManager } from "@engine/core/managers/EngineResourceManager";
import { EngineSystem, EngineSystemManager } from "@engine/core/managers/EngineSystemManager";
import type { EngineResource } from "@engine/core/managers/Resource";
import { SceneManager } from "@engine/core/managers/SceneManager";
import { AdvancedShaderSystem } from "@engine/modules/resources/material/AdvancedShaderSystem";
import { GizmosShaderSystem } from "@engine/modules/resources/material/GizmosShaderSystem";
import { SimpleShaderSystem } from "@engine/modules/resources/material/SimpleShaderSystem";
import { RenderSystem } from "@engine/modules/shared/render/RenderSystem";
import { loadEngine } from "engine/main";
import { SimpleScene } from "examples/SimpleScene";


await loadEngine();

async function loadResources() {
  await EngineResourceManager.load();

  new AdvancedShaderSystem("advancedShaderSystem");
  new SimpleShaderSystem("simpleShaderSystem");
  new GizmosShaderSystem("gizmosShaderSystem");

  EngineSystemManager.register(EngineSystem.RenderSystem, () => new RenderSystem());
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
