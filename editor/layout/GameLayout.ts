import type { Engine } from "../../engine/src/Engine";
import { Display } from "../../engine/src/core/display/Display";
import { LayoutButton } from "./elements/LayoutButton";
import { CreateResolutionSelectorComponent } from "./elements/ResolutionSelector";


import layout from './layout.config.json';




export class GameLayout extends Display {
    constructor(engine: Engine) {
        super();

        const playBtn = new LayoutButton({
            icon: {
                svgSrc: layout.icons.play.path
            },
            onClick() {
                engine.time.play();
                engine.loadScene("simple_scene", true);
            },
        });

        const pauseBtn = new LayoutButton({
            icon: {
                svgSrc: layout.icons.pause.path
            },
            onClick() {
                engine.time.pause();
            },
        });

        const resumeBtn = new LayoutButton({
            icon: {
                svgSrc: layout.icons.resume.path
            },
            onClick() {
                engine.time.resume();
            },
        });

        const stopBtn = new LayoutButton({
            icon: {
                svgSrc: layout.icons.stop.path
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
