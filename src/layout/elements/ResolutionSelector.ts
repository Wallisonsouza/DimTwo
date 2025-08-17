import { Display, Resolution } from "../../engine/core/display/Display";
import { LayoutDropdown } from "./LayoutDropdown";

export function CreateResolutionSelectorComponent(display: Display) {
    const dropdown = new LayoutDropdown({
        text: "Resolução",
        initialOptionIndex: 0,
        toogleOptions: true,
        dropdownOptions: [
            { text: "3840x2160 (4K)", value: Resolution.R3840x2160 },
            { text: "2560x1440 (QHD)", value: Resolution.R2560x1440 },
            { text: "1920x1080 (Full HD)", value: Resolution.R1920x1080 },
            { text: "1600x900", value: Resolution.R1600x900 },
            { text: "1366x768", value: Resolution.R1366x768 },
            { text: "1280x720 (HD)", value: Resolution.R1280x720 },
            { text: "1024x768", value: Resolution.R1024x768 },
            { text: "800x600", value: Resolution.R800x600 },
            { text: "640x480", value: Resolution.R640x480 }
        ],
        onOptionClick: (option) => {
            if (option.value) {
                display.setResolution(option.value);
            }
        }
    });

    return dropdown;
}