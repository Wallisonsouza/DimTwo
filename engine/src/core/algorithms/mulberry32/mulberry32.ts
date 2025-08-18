export class Mulberry32 {
  private seed: number;

  private static readonly INCREMENT = 0x6D2B79F5;
  private static readonly UINT32_MAX = 0x100000000;

  constructor(seed: number) {
    this.seed = seed >>> 0;
  }

  public nextFloat(): number {
    this.seed = (this.seed + Mulberry32.INCREMENT) >>> 0;
    let t = this.seed;

    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    this.seed = t >>> 0;

    return ((t ^ (t >>> 14)) >>> 0) / Mulberry32.UINT32_MAX;
  }
}