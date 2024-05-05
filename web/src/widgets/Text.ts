import Viewport from "../core/Viewport";
import Widget from "../core/Widget";
import Color from "../util/Color";

export default class Text extends Widget {
    protected redraw: boolean = true;

    public constructor(
        protected _text: string = "",
        protected _fontSize: number = 16,
        protected _fillColor: Color | null = Color.WHITE,
        protected _strokeColor: Color | null = Color.BLACK,
        protected _strokeWidthFactor: number = 0.2,
    ) {
        super();
    }

    public calculateMargin(): number {
        return this._strokeWidthFactor * this._fontSize.screenSpace() * 2;
    }

    public calculateWidth(): number {
        this.canvas.font = `${this._fontSize.screenSpace()}px Ubuntu`;
        return Math.max(1, this.canvas.measureText(this._text).width + this.calculateMargin() * 2);
    }

    public calculateHeight(): number {
        return Math.max(1, this._fontSize.screenSpace() * 1.4);
    }

    public get renderable(): CanvasImageSource {
        if (!this.redraw && !Viewport.guiZoomChanged) return this.canvas.canvas;
        this.redraw = false;

        const fontSize = this._fontSize.screenSpace();

        this.canvasSize = { width: this.calculateWidth(), height: this.calculateHeight() };

        this.canvas.font = `${fontSize}px Ubuntu`;
        this.canvas.textBaseline = "middle";
        this.canvas.textAlign = "left";

        const x = this.calculateMargin();
        const y = this.canvasHeight / 2;

        if (this._strokeWidthFactor && this._strokeColor) {
            this.canvas.fillStyle = this._strokeColor.toCSS();
            this.canvas.lineWidth = fontSize * this._strokeWidthFactor;
            this.canvas.strokeText(this._text, x, y);
        }

        if (this._fillColor) {
            this.canvas.fillStyle = this._fillColor.toCSS();
            this.canvas.fillText(this._text, x, y);
        }

        return this.canvas.canvas;
    }

    /* getters & setters for non public attributes */

    public get text() { return this._text; }

    public set text(val: string) {
        if (this._text === val) return;
        this.redraw = true;
        this._text = val;
    }

    public get fontSize() { return this._fontSize; }

    public set fontSize(val: number) {
        if (this._fontSize === val) return;
        this.redraw = true;
        this._fontSize = val;
    }

    public get fillColor() { return this._fillColor; }

    public set fillColor(val: Color | null) {
        if (this._fillColor === val) return;
        this.redraw = true;
        this._fillColor = val;
    }

    public get strokeColor() { return this._strokeColor; }

    public set strokeColor(val: Color | null) {
        if (this._strokeColor === val) return;
        this.redraw = true;
        this._strokeColor = val;
    }

    public get strokeWidthFactor() { return this._strokeWidthFactor; }

    public set strokeWidthFactor(val: number) {
        if (this._strokeWidthFactor === val) return;
        this.redraw = true;
        this._strokeWidthFactor = val;
    }
}