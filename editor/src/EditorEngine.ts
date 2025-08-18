import { Engine } from "../../engine/src/Engine";
import { Camera } from "../../engine/src/modules/components/render/Camera";
import { Transform } from "../../engine/src/modules/components/spatial/Transform";
import { EditorLayout } from "../layout/EditorLayout";

export class Editor extends Engine {

    public camera: Camera;
    public cameraTransform: Transform;

    constructor() {
        super();
        this.display = new EditorLayout(this);
        this.camera = new Camera();
        this.cameraTransform = new Transform();
        this.cameraTransform.position.z = 5;
    }
}