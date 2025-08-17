import { LayoutElement } from "./LayoutElement";
import { LayoutIcon, type LayoutIconOptions } from "./LayoutIcon";
import { LayoutText } from "./LayoutText";

export type LayoutButtonOptions = {
    text?: string;
    icon?: LayoutIconOptions;
    propagation?: boolean;
    value?: any;
    onClick?: (element: LayoutElement) => void;
}

export class LayoutButton extends LayoutElement {
    text?: LayoutText;
    icon?: LayoutIcon;
    value?: any;

    constructor(options: LayoutButtonOptions) {
        super();
        this.addClass("engine-option");

        if (options.text) {
            this.text = new LayoutText({ text: options.text });
            this.appendElements(this.text);
        }

        this.value = options.value;

        if (options.icon) {
            const icon = new LayoutIcon(options.icon);
            this.appendElements(icon);
        }

        if (options.onClick) {
            this.container.addEventListener("click", (e) => {
                if (options?.propagation == false) {
                    e.stopPropagation();
                }
                options.onClick?.(this)
            });
        }
    }

    public setText(text: string): void {
        this.text?.setText(text)
    }
}