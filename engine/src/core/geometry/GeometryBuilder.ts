import { Circle, type CircleOptions } from "./Circle";
import { Quad, type QuadOptions } from "./Quad";

export class GeometryBuilder {

  public static createCicle(name: string, options?: CircleOptions) {
    return Circle.createCircleMesh(name, options);
  }

  public static createQuad(name: string, options?: QuadOptions) {
    return Quad.createQuadMesh(name, options);
  }
}


