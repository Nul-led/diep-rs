export default class Color {
    public static BLACK: Color = Color.fromRGB(0, 0, 0);
    public static WHITE: Color = Color.fromRGB(255, 255, 255);

    public static fromRGB(r: number, g: number, b: number): Color {
        return new Color(r << 16 | g << 8 | b << 0);
    }

    public static blendColors(primary: Color, secondary: Color, factor: number) {
        const c = new Color(primary.toInt());
        c.blendWith(factor, secondary);
        return c;
    }

    public r: number = 0;
    public g: number = 0;
    public b: number = 0;

    public constructor(color: number) {
        this.r = (color >>> 16) & 255;
        this.g = (color >>> 8) & 255;
        this.b = (color >>> 0) & 255;
    }

    public toInt() {
        return this.r << 16 | this.g << 8 | this.b << 0;
    }

    public toCSS() {
        return `rgb(${this.r},${this.g},${this.b})`;
    }

    public blendWith(factor: number, color: Color) {
        this.r = Math.round(color.r * factor + this.r * (1 - factor));
        this.g = Math.round(color.g * factor + this.g * (1 - factor));
        this.b = Math.round(color.b * factor + this.b * (1 - factor));
    }
}