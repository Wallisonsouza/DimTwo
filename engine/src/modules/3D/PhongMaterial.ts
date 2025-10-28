import { Color } from "@engine/core/math/Color";
import type { Scene } from "@engine/core/scene/scene";
import type { Engine } from "@engine/Engine";
import { Material, type MaterialOptions } from "@engine/Rendering/Material";
import type { Shader } from "@engine/Rendering/Shader";
import { ShaderSystem } from "@engine/Rendering/ShaderSystem";
import type { Camera } from "../shared/camera/Camera";
import type { Transform } from "./Transform";
import { PhongUniforms, Uniform } from "../enums/Uniforms";

export interface PhongMaterialOptions extends MaterialOptions {
  ambient?: Color;
  diffuse?: Color;
  specular?: Color;
  shininess?: number;
}

export class PhongMaterial extends Material {
  ambient: Color;
  diffuse: Color;
  specular: Color;
  shininess: number;

  constructor(options: PhongMaterialOptions = {}) {

    super(options);

    this.ambient = options.ambient ?? new Color(0.1, 0.1, 0.1);
    this.diffuse = options.diffuse ?? new Color(1.0, 1.0, 1.0);
    this.specular = options.specular ?? new Color(1.0, 1.0, 1.0);
    this.shininess = options.shininess ?? 32.0;
  }

}

export class PhongMaterialShaderLink extends ShaderSystem {

  public global(engine: Engine, camera: Camera, scene: Scene, shader: Shader): void {

  }

}
