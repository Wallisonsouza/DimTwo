import type { Engine } from "../engine/Engine";
import { Display } from "../engine/core/display/Display";
import { LayoutButton } from "./elements/LayoutButton";
import { CreateResolutionSelectorComponent } from "./elements/ResolutionSelector";

export class GameLayout extends Display {
    constructor(engine: Engine) {
        super();

        const playBtn = new LayoutButton({
            icon: {
                svgSrc: "./src/layout/svg/play-fill.svg"
            },
            onClick() {
                engine.time.play();
                engine.loadScene("simple_scene", true);
            },
        });

        const pauseBtn = new LayoutButton({
            icon: {
                svgSrc: "./src/layout/svg/pause-fill.svg"
            },
            onClick() {
                engine.time.pause();
            },
        });

        const resumeBtn = new LayoutButton({
            icon: {
                svgSrc: "./src/layout/svg/resume-fill.svg"
            },
            onClick() {
                engine.time.resume();
            },
        });

        const stopBtn = new LayoutButton({
            icon: {
                svgSrc: "./src/layout/svg/stop-fill.svg"
            },
            onClick() {
                engine.time.stop();
                engine.unloadScene();
            },
        });

        const dropdown = CreateResolutionSelectorComponent(this);

        this.optionsBar.appendChild(dropdown.getRenderElement());
        this.optionsBar.appendChild(playBtn.getRenderElement());
        this.optionsBar.appendChild(pauseBtn.getRenderElement());
        this.optionsBar.appendChild(resumeBtn.getRenderElement());
        this.optionsBar.appendChild(stopBtn.getRenderElement());

       /*  this.optionsBar.appendChild(LayoutHelper.createFitContentDiv(true, false));
        this.optionsBar.appendChild(LayoutHelper.createFitContentDiv(true, false)); */
        this.optionsBar.classList.add("game");

    }
}
