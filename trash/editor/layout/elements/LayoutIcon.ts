import { LayoutElement } from "./LayoutElement";

export type LayoutIconOptions = {
    imageSrc?: string;
    svgSrc?: string;
}

export class LayoutIcon extends LayoutElement {

    constructor(options: LayoutIconOptions) {
        super();
        this.addClass("engine-icon");

        if (options.svgSrc) {
            this.loadSvg(options.svgSrc);
        }

        if (options.imageSrc) {
            this.loadImage(options.imageSrc);
        }
    }

    private loadSvg(svgSrc: string) {
        fetch(svgSrc)
            .then(res => res.text())
            .then(svgContent => {
                const svgWrapper = document.createElement("div");
                svgWrapper.innerHTML = svgContent;
                svgWrapper.classList.add("engine-icon__svg-container");
                this.container.appendChild(svgWrapper);
            })
            .catch(err => console.error(`Erro carregando SVG ${svgSrc}:`, err));
    }

    private loadImage(imageSrc: string) {
        const img = document.createElement("img");
        img.src = imageSrc;
        img.classList.add("engine-icon__image");
        this.container.appendChild(img);
    }
}
