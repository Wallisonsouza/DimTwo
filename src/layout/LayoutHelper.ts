
type LayoutIcon = {
    imageSrc?: string;
    svgSrc?: string;

}



export class LayoutHelper {

    public static createButton(text: string = "", onClick: () => void): HTMLDivElement {
        const container = document.createElement("div");
        container.innerText = text;
        container.addEventListener("click", onClick);
        return container;
    }

    public static createSimpleButton(text: string, onClick: () => void): HTMLButtonElement {
        const container = document.createElement("button");
        container.innerText = text;
        container.addEventListener("click", onClick);
        return container;
    }

    public static loadSvg(path: string): HTMLDivElement {
        const container = document.createElement("div");
        fetch(path)
            .then(res => res.text())
            .then(svgContent => {
                container.innerHTML = svgContent;
                container.className = "svg-container";
            })
            .catch(err => console.error(`Erro carregando ${path}:`, err));

        return container;
    }

    public static createFitContentDiv(width: boolean = true, height: boolean = true): HTMLDivElement {
        const div = document.createElement("div");
        if (width) div.style.width = "100%";
        if (height) div.style.height = "100%";
        return div;
    }

    public static createIcon(options: LayoutIcon): HTMLDivElement {
        const container = document.createElement("div");
        container.classList.add("engine-icon");

        if (options.svgSrc) {
            fetch(options.svgSrc)
                .then(res => res.text())
                .then(svgContent => {
                    const svgWrapper = document.createElement("div");
                    svgWrapper.innerHTML = svgContent;
                    svgWrapper.classList.add("engine-icon__svg-container");
                    container.appendChild(svgWrapper);
                })
                .catch(err => console.error(`Erro carregando SVG ${options.svgSrc}:`, err));
        }

        if (options.imageSrc) {
            const img = document.createElement("img");
            img.src = options.imageSrc;
            img.classList.add("engine-icon__image");
            container.appendChild(img);
        }

        return container;
    }

    public static createContainer(...elements: HTMLDivElement[]) {
        const container = document.createElement("div");
        container.className = "engine-container";
        for (const el of elements) {
            container.appendChild(el);
        }

        return container;
    }
}
