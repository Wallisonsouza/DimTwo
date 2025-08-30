import type { Clonable } from "@engine/core/base/Clonable";
import { Component, type ComponentOptions } from "../../../core/base/Component";
import { Mat4 } from "../../../core/math/Mat4";
import { Quat } from "../../../core/math/quat";
import { Vec3 } from "../../../core/math/Vec3";
import { ComponentGroup } from "../../enums/ComponentGroup";
import { ComponentType } from "../../enums/ComponentType";

export interface TransformOptions extends ComponentOptions {
    position?: Vec3;
    rotation?: Quat;
    scale?: Vec3;
}

type TransformCallback = (transform: Transform) => void;

export class Transform extends Component implements Clonable<Transform> {
    private readonly _WORLD_MATRIX_CACHE: Mat4 = Mat4.create();
    public worldDirty = true;

    private _position: Vec3;
    private _rotation: Quat;
    private _scale: Vec3;

    private onChangeCallbacks: TransformCallback[] = [];

    constructor(options: TransformOptions = {}) {
        super(ComponentType.Transform, ComponentGroup.Transform, options);
        this._position = options.position ?? new Vec3(0, 0, 0);
        this._rotation = options.rotation ?? new Quat(0, 0, 0, 1);
        this._scale = options.scale ?? new Vec3(1, 1, 1);
    }

    get position(): Vec3 { return this._position; }
    set position(v: Vec3) {
        if (this._position.equals(v)) return;
        this._position.set(v);
        this.worldDirty = true;
        this.emitOnChange();
    }

    get rotation(): Quat { return this._rotation; }
    set rotation(q: Quat) {
        if (this._rotation.equals(q)) return;
        this._rotation.set(q);
        this.worldDirty = true;
        this.emitOnChange();
    }

    get scale(): Vec3 { return this._scale; }
    set scale(s: Vec3) {
        if (this._scale.equals(s)) return;
        this._scale.set(s);
        this.worldDirty = true;
        this.emitOnChange();
    }

    public getWorldMatrix(): Mat4 {
        if (!this.worldDirty) {
            return this._WORLD_MATRIX_CACHE;
        }

        Mat4.compose(
            this._WORLD_MATRIX_CACHE,
            this._position,
            this._rotation,
            this._scale
        );

        this.worldDirty = false;
        return this._WORLD_MATRIX_CACHE;
    }

    public onChange(callback: TransformCallback) {
        this.onChangeCallbacks.push(callback);
    }

    private emitOnChange() {
        if (!this.onChangeCallbacks.length) return;
        for (const cb of this.onChangeCallbacks) cb(this);
    }

    clone(): Transform {
        const t = new Transform({
            position: this._position.clone(),
            rotation: this._rotation.clone(),
            scale: this._scale.clone()
        });

        return t;
    }
}
