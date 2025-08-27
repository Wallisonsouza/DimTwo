import type { Clonable } from "@engine/core/base/Clonable";
import { Component, type ComponentOptions } from "../../../core/base/Component";
import { Mat4 } from "../../../core/math/Mat4";
import { Quat } from "../../../core/math/quat";
import { Vec3 } from "../../../core/math/Vec3";
import { ComponentGroup } from "../../enums/ComponentGroup";
import { ComponentType } from "../../enums/ComponentType";

export interface TransformOptions extends ComponentOptions{
    position?: Vec3;
    rotation?: Quat;
    scale?: Vec3;
}

export class Transform extends Component implements Clonable<Transform> {
    position: Vec3;
    rotation: Quat;
    scale: Vec3;
    previousPosition: Vec3 = new Vec3();
    renderPosition: Vec3= new Vec3();
    modelMatrix: Mat4;

    constructor(options: TransformOptions = {}) {
        super(ComponentType.Transform, ComponentGroup.Transform, options);
        this.position = options.position ?? new Vec3(0, 0, 0);
        this.rotation = options.rotation ?? new Quat(0, 0, 0, 1);
        this.scale = options.scale ?? new Vec3(1, 1, 1);
        this.modelMatrix = Mat4.create();
    }

    clone(): Transform {
        return new Transform({
            position: this.position.clone(),
            rotation: this.rotation.clone(),
            scale: this.scale.clone()
        });
    }
}


