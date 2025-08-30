import { Component } from "../../../core/base/Component";
import { Mat4 } from "../../../core/math/Mat4";
import { Quat } from "../../../core/math/quat";
import { Vec3 } from "../../../core/math/Vec3";
import { ComponentGroup } from "../../enums/ComponentGroup";
import { ComponentType } from "../../enums/ComponentType";

export class Transform extends Component {
    constructor(options = {}) {
        super(ComponentType.Transform, ComponentGroup.Transform, options);
        this._WORLD_MATRIX_CACHE = Mat4.create();
        this.worldDirty = true;

        this._position = options.position || new Vec3(0, 0, 0);
        this._rotation = options.rotation || new Quat(0, 0, 0, 1);
        this._scale = options.scale || new Vec3(1, 1, 1);
        this.onChangeCallbacks = [];
    }

    get position() { return this._position; }
    set position(v) {
        if (this._position.equals(v)) return;
        this._position.set(v);
        this.worldDirty = true;
        this.emitOnChange();
    }

    get rotation() { return this._rotation; }
    set rotation(q) {
        if (this._rotation.equals(q)) return;
        this._rotation.set(q);
        this.worldDirty = true;
        this.emitOnChange();
    }

    get scale() { return this._scale; }
    set scale(s) {
        if (this._scale.equals(s)) return;
        this._scale.set(s);
        this.worldDirty = true;
        this.emitOnChange();
    }

    getWorldMatrix() {
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

    onChange(callback) {
        this.onChangeCallbacks.push(callback);
    }

    emitOnChange() {
        if (!this.onChangeCallbacks.length) return;
        for (const cb of this.onChangeCallbacks) cb(this);
    }

    clone() {
        const t = new Transform({
            position: this._position.clone(),
            rotation: this._rotation.clone(),
            scale: this._scale.clone()
        });

        return t;
    }
}