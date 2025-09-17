export enum Index {
  X = 0,
  Y = 1,
  Z = 2,
  W = 3
}

export abstract class Vector {
  public data: Float32Array;

  constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
    this.data = new Float32Array([x, y, z, w]);
  }

  public get x() { return this.data[Index.X]; }
  public get y() { return this.data[Index.Y]; }
  public get z() { return this.data[Index.Z]; }

  public set x(v: number) { this.data[Index.X] = v; }
  public set y(v: number) { this.data[Index.Y] = v; }
  public set z(v: number) { this.data[Index.Z] = v; }

}


export class BaseVector {

  public data: Float32Array;
  public length: number = 0;

  constructor(v: number[]) {
    this.data = new Float32Array(v);
    this.length = v.length;
  }

  public static add(a: BaseVector, b: BaseVector, out: BaseVector): BaseVector {
    if (out.length >= 1) out.data[Index.X] = (a.data[Index.X] || 0) + (b.data[Index.X] || 0);
    if (out.length >= 2) out.data[Index.Y] = (a.data[Index.Y] || 0) + (b.data[Index.Y] || 0);
    if (out.length >= 3) out.data[Index.Z] = (a.data[Index.Z] || 0) + (b.data[Index.Z] || 0);
    if (out.length >= 4) out.data[Index.W] = (a.data[Index.W] || 0) + (b.data[Index.W] || 0);

    return out;
  }


}
