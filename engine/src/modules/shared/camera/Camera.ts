import { type ComponentOptions, Component } from "../../../core/base/Component";
import { Color } from "../../../core/math/Color";
import type { Mat4 } from "../../../core/math/Mat4";
import type { Vec3 } from "../../../core/math/Vec3";
import { Scene } from "../../../core/scene/scene";
import { CameraNotFoundException } from "../../../exception/CameraNotFoundException";
import { ComponentGroup } from "../../enums/ComponentGroup";
import { ComponentType } from "../../enums/ComponentType";
import type { Ray } from "../physics/Ray";


export interface CameraOptions extends ComponentOptions {
  clearColor?: Color;
}

export abstract class Camera extends Component {

  private static _cameraCache: Camera | null = null;
  public clearColor: Color;

  constructor(type: ComponentType, options: CameraOptions) {
    super(type, ComponentGroup.Camera, options);
    this.clearColor = options.clearColor || Color.black;
  }

  public abstract getViewMatrix(): Mat4;
  public abstract getProjectionMatrix(): Mat4;
  public abstract getViewProjectionMatrix(): Mat4;
  public abstract screenPointToRay(point: Vec3): Ray;
  public abstract worldPointToScreen(worldPoint: Vec3): Vec3;
  public abstract screenPointToWorld(worldPoint: Vec3): Vec3;


  public static getActivedCamera(): Camera {
    if (this._cameraCache !== null && this._cameraCache.enabled) {
      return this._cameraCache;
    }

    const scene = Scene.getLoadedScene();

    const cameras = scene.components.getAllOfType<Camera>(ComponentType.Camera);

    for (const camera of cameras) {
      if (camera.enabled) {
        this._cameraCache = camera;
        return this._cameraCache;
      }
    }

    throw new CameraNotFoundException(`[Scene.activeCamera] Nenhuma câmera ativa encontrada na cena.`);
  }

}
