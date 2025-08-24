import { LayoutButton, type LayoutButtonOptions } from "./LayoutButton";
import { LayoutElement } from "./LayoutElement";
import type { LayoutIconOptions } from "./LayoutIcon";

export type LayoutDropdownOptions = {
    text?: string;
    toogleOptions?: boolean;
    initialOptionIndex?: number;
    icon?: LayoutIconOptions;
    dropdownOptions?: LayoutButtonOptions[];
    onOptionClick?: (option: LayoutButton) => void;
}

export class LayoutDropdown extends LayoutElement {
    optionsContainer: LayoutElement;
    mainButton: LayoutButton;

    constructor(options: LayoutDropdownOptions) {
        super();
        this.addClass("engine-dropdown");

        this.mainButton = new LayoutButton({
            propagation: false,
            text: options.text,
            onClick: () => {
                this.optionsContainer.toggleClass("visible");
            }
        });

        // Se for dropdown do tipo "select", altera texto do botão principal
        if (options.toogleOptions === true) {
            if (options.initialOptionIndex !== undefined && options.dropdownOptions) {
                const initialOption = options.dropdownOptions[options.initialOptionIndex];
                if (initialOption.text) {
                    this.mainButton.text?.setText(initialOption.text);
                }
            }
        }

        this.mainButton.addClass("engine-dropdown__main");
        this.appendElements(this.mainButton);

        this.optionsContainer = new LayoutElement();
        this.optionsContainer.addClass("engine-dropdown__options");

        if (options.dropdownOptions) {
            for (const config of options.dropdownOptions) {
                config.propagation = false;

                const option = new LayoutButton(config);

                option.on("click", () => {

                    if (options.onOptionClick) {
                        options.onOptionClick(option);
                    }

                    if (options.toogleOptions === true && config.text) {
                        this.mainButton.text?.setText(config.text);
                    }

                    this.optionsContainer.toggleClass("visible");
                })

                option.addClass("engine-dropdown__option");
                this.optionsContainer.appendElements(option);
            }
        }

        this.appendElements(this.optionsContainer);

        // fecha o dropdown ao clicar fora
        document.addEventListener("click", () => {
            this.optionsContainer.removeClass("visible");
        });
    }
}
