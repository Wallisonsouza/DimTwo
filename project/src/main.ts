import { Scene } from "@engine/core/scene/scene";
import { Time } from "@engine/core/time/Time";
import { GameEngine } from "@game/GameEngine";
import { SimpleScene } from "examples/SimpleScene";


const game = new GameEngine();
await game.loadGameResources();


const scene = new SimpleScene();
Scene.addScene(scene);
Scene.loadScene("SimpleScene");

const app = document.querySelector("#app") as HTMLDivElement;
app.appendChild(game.engineWindow.container);
game.engineWindow.resize();

document.body.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  event.stopImmediatePropagation();
}, { capture: true });


Time.play();