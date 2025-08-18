
export class Mathf {

    public static readonly sin = Math.sin;
    public static readonly cos = Math.cos;

    public static degToRad(deg: number): number {
        return deg * (Math.PI / 180);
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