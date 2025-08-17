import { Display } from "../engine/core/display/Display";
import type { Engine } from "../engine/Engine";
import { CreateSceneOptionsArea } from "./elements/GeneralOptionsSelector";
import { LayoutButton } from "./elements/LayoutButton";
import { CreateResolutionSelectorComponent } from "./elements/ResolutionSelector";

export class EditorLayout extends Display {
    constructor(engine: Engine) {
        super();
        const file = CreateSceneOptionsArea(engine);
        this.optionsBar.appendChild(file.getRenderElement());
        
        const loadBtn = new LayoutButton({
            text: "Load",
            onClick: () => {
                console.log("Load clicked");
            }
        });
        this.optionsBar.appendChild(loadBtn.getRenderElement());

        const saveBtn = new LayoutButton({
            text: "Save",
            onClick: () => {
                console.log("Save clicked");
            }
        });



        this.optionsBar.appendChild(saveBtn.getRenderElement());

        const dropdown = CreateResolutionSelectorComponent(this);
        this.optionsBar.appendChild(dropdown.getRenderElement());



        this.optionsBar.classList.add("editor")
    }
}