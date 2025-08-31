export class Color {
    r: number;
    g: number;
    b: number;
    a: number;

    public clone() {
        return new Color(this.r, this.g, this.b, this.a);
    }

    public static readonly red = new Color(255, 0, 0);
    public static readonly green = new Color(0, 255, 0);
    public static readonly blue = new Color(0, 0, 255);
    public static readonly yellow = new Color(255, 255, 0);
    public static readonly cyan = new Color(0, 255, 255);
    public static readonly magenta = new Color(255, 0, 255);
    public static readonly white = new Color(255, 255, 255);
    public static readonly black = new Color(0, 0, 0);
    public static readonly Gray = new Color(128, 128, 128);
    public static readonly light_gray = new Color(211, 211, 211);
    public static readonly dark_gray = new Color(105, 105, 105);
    public static readonly orange = new Color(255, 165, 0);
    public static readonly purple = new Color(128, 0, 128);
    public static readonly pink = new Color(255, 192, 203);
    public static readonly brown = new Color(165, 42, 42);
    public static readonly transparent = new Color(0, 0, 0, 0);

    constructor(r: number, g: number, b: number, a: number = 1) {
        this.r = r / 255;
        this.g = g / 255;
        this.b = b / 255;
        this.a = a;
    }

    public static rgba(r: number, g: number, b: number, a: number = 1): Color {
        return new Color(r, g, b, a);
    }

    public static random(alpha: boolean = false): Color {
        return new Color(
            Math.random() * 255,
            Math.random() * 255,
            Math.random() * 255,
            alpha ? Math.random() : 1.0
        );
    }
}