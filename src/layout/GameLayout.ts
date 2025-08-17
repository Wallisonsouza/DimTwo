import type { Engine } from "../engine/Engine";
import { Display } from "../engine/core/display/Display";
import { LayoutHelper } from "./LayoutHelper";
import { CreateResolutionSelectorComponent } from "./elements/ResolutionSelector";

export class GameLayout extends Display {
    constructor(engine: Engine) {
        super();


       /*  const playBtn = LayoutHelper.createOption({
            icon: {
                svgSrc: "./src/layout/svg/play-fill.svg"
            },
            onClick() {
                engine.time.play();
                engine.loadScene("simple_scene", true);
            },
        });

        const pauseBtn = LayoutHelper.createOption({
            icon: {
                svgSrc: "./src/layout/svg/pause-fill.svg"
            },
            onClick() {
                engine.time.pause();
            },
        });

        const resumeBtn = LayoutHelper.createOption({
            icon: {
                svgSrc: "./src/layout/svg/resume-fill.svg"
            },
            onClick() {
                engine.time.resume();
            },
        });

        const stopBtn = LayoutHelper.createOption({
            icon: {
                svgSrc: "./src/layout/svg/stop-fill.svg"
            },
            onClick() {
                engine.time.stop();
                engine.unloadScene();
            },
        }); */

        const dropdown = CreateResolutionSelectorComponent(this);
        this.optionsBar.appendChild(dropdown.getRenderElement());

        this.optionsBar.appendChild(LayoutHelper.createFitContentDiv(true, false));
        this.optionsBar.appendChild(LayoutHelper.createFitContentDiv(true, false));
        this.optionsBar.classList.add("game");

    }
}
