import { Vec2 } from "../../modules/2D/Vec2";
import { Vec3 } from "../math/Vec3";

export class SimplexNoise {

  private grad3: Vec3[] = [
    new Vec3(1, 1, 0),
    new Vec3(-1, 1, 0),
    new Vec3(1, -1, 0),
    new Vec3(-1, -1, 0),
    new Vec3(1, 0, 1),
    new Vec3(-1, 0, 1),
    new Vec3(1, 0, -1),
    new Vec3(-1, 0, -1),
    new Vec3(0, 1, 1),
    new Vec3(0, -1, 1),
    new Vec3(0, 1, -1),
    new Vec3(0, -1, -1),
  ];

  private grad2: Vec2[] = [
    new Vec2(1, 1),
    new Vec2(-1, 1),
    new Vec2(1, -1),
    new Vec2(-1, -1),
    new Vec2(1, 0),
    new Vec2(-1, 0),
    new Vec2(0, 1),
    new Vec2(0, -1),
  ];


  private perm: number[] = [];
  private random: () => number;

  private static readonly SQRT_3 = Math.sqrt(3);
  private static readonly F2 = 0.5 * (SimplexNoise.SQRT_3 - 1);
  private static readonly G2 = (3 - SimplexNoise.SQRT_3) / 6;
  private static readonly F3 = 1 / 3;
  private static readonly G3 = 1 / 6;

  constructor(seed: number = 0, randomFn?: () => number) {
    this.random = randomFn ?? this.seededRandom(seed);
    this.buildPermutationTable();
  }

  private seededRandom(seed: number): () => number {
    let state = seed;
    return () => {
      state = (state * 16807) % 2147483647;
      return (state - 1) / 2147483646;
    };
  }

  private buildPermutationTable() {
    const p = Array.from({ length: 256 }, (_, i) => i);
    for (let i = p.length - 1; i > 0; i--) {
      const j = Math.floor(this.random() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    this.perm = new Array(512);
    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
    }
  }

  // --- 2D ---

  private skewOffsets2D(x: number, y: number): [number, number] {
    if (x > y) {
      return [1, 0];
    } else {
      return [0, 1];
    }
  }

  private dot2(g: Vec2, x: number, y: number): number {
    return g.x * x + g.y * y;
  }

  private cornerContribution2D(grad: Vec2, x: number, y: number): number {
    const t = 0.5 - x * x - y * y;
    if (t < 0) return 0;
    const t2 = t * t;
    return t2 * t2 * this.dot2(grad, x, y);
  }

  public noise2D(xin: number, yin: number): number {
    const s = (xin + yin) * SimplexNoise.F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * SimplexNoise.G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;

    const [i1, j1] = this.skewOffsets2D(x0, y0);


    const x1 = x0 - i1 + SimplexNoise.G2;
    const y1 = y0 - j1 + SimplexNoise.G2;
    const x2 = x0 - 1 + 2 * SimplexNoise.G2;
    const y2 = y0 - 1 + 2 * SimplexNoise.G2;

    const ii = i & 255;
    const jj = j & 255;
    const gi0 = this.perm[ii + this.perm[jj]] % 8;
    const gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 8;
    const gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 8;

    const n0 = this.cornerContribution2D(this.grad2[gi0], x0, y0);
    const n1 = this.cornerContribution2D(this.grad2[gi1], x1, y1);
    const n2 = this.cornerContribution2D(this.grad2[gi2], x2, y2);

    return 70 * (n0 + n1 + n2);
  }

  public fractalNoise2D(x: number, y: number, octaves: number = 4, persistence: number = 0.5): number {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      total += this.noise2D(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= 2;
    }

    return total / maxValue;
  }

  // --- 3D ---

  private skewOffsets3D(x0: number, y0: number, z0: number): [number, number, number, number, number, number] {
    let i1, j1, k1;
    let i2, j2, k2;

    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1; j1 = 0; k1 = 0;
        i2 = 1; j2 = 1; k2 = 0;
      } else if (x0 >= z0) {
        i1 = 1; j1 = 0; k1 = 0;
        i2 = 1; j2 = 0; k2 = 1;
      } else {
        i1 = 0; j1 = 0; k1 = 1;
        i2 = 1; j2 = 0; k2 = 1;
      }
    } else {
      if (y0 < z0) {
        i1 = 0; j1 = 0; k1 = 1;
        i2 = 0; j2 = 1; k2 = 1;
      } else if (x0 < z0) {
        i1 = 0; j1 = 1; k1 = 0;
        i2 = 0; j2 = 1; k2 = 1;
      } else {
        i1 = 0; j1 = 1; k1 = 0;
        i2 = 1; j2 = 1; k2 = 0;
      }
    }

    return [i1, j1, k1, i2, j2, k2];
  }

  private dot3(g: Vec3, x: number, y: number, z: number): number {
    return g.x * x + g.y * y + g.z * z;
  }

  private cornerContribution3D(grad: Vec3, x: number, y: number, z: number): number {
    const t = 0.6 - x * x - y * y - z * z;
    if (t < 0) return 0;
    const t2 = t * t;
    return t2 * t2 * this.dot3(grad, x, y, z);
  }

  noise3D(xin: number, yin: number, zin: number): number {
    const s = (xin + yin + zin) * SimplexNoise.F3;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const k = Math.floor(zin + s);

    const t = (i + j + k) * SimplexNoise.G3;
    const X0 = i - t;
    const Y0 = j - t;
    const Z0 = k - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;
    const z0 = zin - Z0;

    const [i1, j1, k1, i2, j2, k2] = this.skewOffsets3D(x0, y0, z0);

    const x1 = x0 - i1 + SimplexNoise.G3;
    const y1 = y0 - j1 + SimplexNoise.G3;
    const z1 = z0 - k1 + SimplexNoise.G3;
    const x2 = x0 - i2 + 2 * SimplexNoise.G3;
    const y2 = y0 - j2 + 2 * SimplexNoise.G3;
    const z2 = z0 - k2 + 2 * SimplexNoise.G3;
    const x3 = x0 - 1 + 3 * SimplexNoise.G3;
    const y3 = y0 - 1 + 3 * SimplexNoise.G3;
    const z3 = z0 - 1 + 3 * SimplexNoise.G3;

    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;

    const gi0 = this.perm[ii + this.perm[jj + this.perm[kk]]] % 12;
    const gi1 = this.perm[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]] % 12;
    const gi2 = this.perm[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]] % 12;
    const gi3 = this.perm[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]] % 12;

    const n0 = this.cornerContribution3D(this.grad3[gi0], x0, y0, z0);
    const n1 = this.cornerContribution3D(this.grad3[gi1], x1, y1, z1);
    const n2 = this.cornerContribution3D(this.grad3[gi2], x2, y2, z2);
    const n3 = this.cornerContribution3D(this.grad3[gi3], x3, y3, z3);

    return 32 * (n0 + n1 + n2 + n3);
  }
}
