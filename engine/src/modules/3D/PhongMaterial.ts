import { Color } from "@engine/core/math/Color";
import { Material, type MaterialOptions } from "@engine/Rendering/Material";
import { PhongUniforms } from "../enums/Uniforms";

export interface PhongMaterialOptions extends MaterialOptions {
  ambient?: Color;
  diffuse?: Color;
  specular?: Color;
  shininess?: number;
  ambientFactor?: number;
  diffuseFactor?: number;
  specularFactor?: number;
}

export class PhongMaterial extends Material {
  ambientColor: Color;
  diffuseColor: Color;
  specularColor: Color;

  ambientFactor: number;
  diffuseFactor: number;
  specularFactor: number;

  shininess: number;

  constructor(options: PhongMaterialOptions = {}) {
    super(options);

    this.ambientColor = options.ambient ?? new Color(0.1, 0.1, 0.1);
    this.diffuseColor = options.diffuse ?? new Color(1.0, 1.0, 1.0);
    this.specularColor = options.specular ?? new Color(1.0, 1.0, 1.0);

    this.ambientFactor = options.ambientFactor ?? 1.0;
    this.diffuseFactor = options.diffuseFactor ?? 1.0;
    this.specularFactor = options.specularFactor ?? 1.0;

    this.shininess = options.shininess ?? 32.0;
  }


  onLoop(): void {
    if (!this.shader) return;

    this.shader.setColor(PhongUniforms.Ambient, this.ambientColor);
    this.shader.setColor(PhongUniforms.Diffuse, this.diffuseColor);
    this.shader.setColor(PhongUniforms.Specular, this.specularColor);

    this.shader.setFloat(PhongUniforms.AmbientFactor, this.ambientFactor);
    this.shader.setFloat(PhongUniforms.DiffuseFactor, this.diffuseFactor);
    this.shader.setFloat(PhongUniforms.SpecularFactor, this.specularFactor);
    this.shader.setFloat(PhongUniforms.Shininess, this.shininess);
  }
}

