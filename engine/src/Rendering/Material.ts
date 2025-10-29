import { Id } from "@engine/core/base/Id";
import { Color } from "@engine/core/math/Color";
import type { Shader } from "./Shader";

export interface MaterialOptions {
  name?: string;
  shader?: Shader;
  transparent?: boolean;
  color?: Color;
}

export class Material {
  name: string;
  shader: Shader | null;
  transparent: boolean;
  color: Color;
  id: Id = new Id();

  onLoop?(): void;

  private static materials: Map<string, Material> = new Map();

  static get(name: string): Material | undefined {
    return this.materials.get(name);
  }

  static getAll(): Material[] {
    return Array.from(this.materials.values());
  }

  private static add(material: Material) {
    if (this.materials.has(material.name)) {
      console.warn(`Material "${material.name}" already exists. Overwriting.`);
    }
    this.materials.set(material.name, material);
  }

  constructor(options: MaterialOptions) {
    this.name = options.name ?? "New Material";
    this.shader = options.shader ?? null;
    this.transparent = options.transparent ?? false;
    this.color = options.color || Color.White;

    Material.add(this);
  }
}
