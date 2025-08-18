import type { Display } from "../../engine/core/display/Display";
import { Resolution } from "../../engine/core/enums/Resolution";
import { LayoutDropdown } from "./LayoutDropdown";

export interface ResolutionSize {
    width: number;
    height: number;
}

export const ResolutionValues: Record<Resolution, ResolutionSize> = {
    [Resolution.R3840x2160]: { width: 3840, height: 2160 },
    [Resolution.R2560x1440]: { width: 2560, height: 1440 },
    [Resolution.R1920x1080]: { width: 1920, height: 1080 },
    [Resolution.R1680x1050]: { width: 1680, height: 1050 },
    [Resolution.R1600x900]: { width: 1600, height: 900 },
    [Resolution.R1440x900]: { width: 1440, height: 900 },
    [Resolution.R1366x768]: { width: 1366, height: 768 },
    [Resolution.R1280x1024]: { width: 1280, height: 1024 },
    [Resolution.R1280x800]: { width: 1280, height: 800 },
    [Resolution.R1280x720]: { width: 1280, height: 720 },
    [Resolution.R1024x768]: { width: 1024, height: 768 },
    [Resolution.R800x600]: { width: 800, height: 600 },
    [Resolution.R640x480]: { width: 640, height: 480 },
};

export function CreateResolutionSelectorComponent(display: Display) {
    const dropdown = new LayoutDropdown({
        text: "Resolução",
        initialOptionIndex: 2,
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
                const res = ResolutionValues[option.value as Resolution];
                display.setResolution(res.width, res.height);
            }
        }
    });



    return dropdown;
}