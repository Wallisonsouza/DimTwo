import { LayoutElement } from "./LayoutElement";

type LayoutTextOptions = {
    text?: string;
};

export class LayoutText extends LayoutElement {
    line: LayoutElement;
    text: LayoutElement;

    constructor(options: LayoutTextOptions) {
        super();
        this.addClass("engine-text");
        this.container.draggable = false;
        this.container.style.pointerEvents = "none"; 
        this.container.style.userSelect = "none"; 

        this.line = new LayoutElement();
        this.line.addClass("engine-text__line");

        this.text = new LayoutElement();
        this.text.addClass("engine-text__text");

        if (options.text) {
            this.text.getRenderElement().innerText = options.text;
        }

        this.line.appendElements(this.text);
        this.appendElements(this.line);
    }

    public setText(text: string) {
        this.text.getRenderElement().innerText = text;
    }
}
