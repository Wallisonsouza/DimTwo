
export class Mathf {

  public static readonly sin = Math.sin;
  public static readonly cos = Math.cos;
  public static readonly abs = Math.abs;
  public static readonly max = Math.max;

  public static PI_2 = Math.PI * 2;

  public static readonly _PI_180 = Math.PI / 180;
  public static readonly _180_PI = 180 / Math.PI;

  public static degToRad(deg: number): number {
    return deg * (Mathf._PI_180);
  }

  public static radToDeg(rad: number): number {
    return rad * (Mathf._180_PI);
  }

  public static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  public static isPowerOfTwo(value: number): boolean {
    return value > 0 && (value & (value - 1)) === 0;
  }

  public static isInRange(value: number, min: number, max: number, inclusive = false): boolean {
    const low = Math.min(min, max);
    const high = Math.max(min, max);
    return inclusive ? value >= low && value <= high : value > low && value < high;
  }

}