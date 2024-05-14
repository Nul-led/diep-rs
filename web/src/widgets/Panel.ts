import Renderable from "../core/Renderable";
import Viewport from "../core/Viewport";
import Widget from "../core/Widget";
import Color from "../util/Color"

export default class Panel extends Widget {
    protected redraw: boolean = true;

    constructor(
        protected _width: number = 1,
        protected _height: number = 1,
        protected _fillColor: Color | null = Color.WHITE,
        protected _strokeColor: Color | null = Color.BLACK,
        protected _strokeWidth: number = 10,
        protected _lineJoin: CanvasLineJoin = "round",
    ) {
        super();
    }

    public get renderable(): CanvasImageSource {
        if (!this.redraw && !Viewport.guiZoomChanged) return this.canvas.canvas;
        this.redraw = false;

        const strokeWidth = this._strokeWidth.screenSpace();

        this.canvasSize = { width: this._width + strokeWidth * 4, height: this._height + strokeWidth * 4 };

        this.canvas.save();

        const fillColor = this._fillColor;

        this.canvas.translate(strokeWidth * 2, strokeWidth * 2);

        if (strokeWidth && this._strokeColor) {
            this.canvas.lineWidth = strokeWidth;
            this.canvas.lineJoin = this._lineJoin;
            this.canvas.strokeStyle = this._strokeColor.toCSS();
            this.canvas.strokeRect(0, 0, this._width, this._height);
        }

        if (fillColor) {
            this.canvas.fillStyle = fillColor.toCSS();
            this.canvas.fillRect(0, 0, this._width, this._height);
        }

        this.canvas.restore();

        return this.canvas.canvas;
    }

    public render(ctx: Renderable, x: number, y: number) {
        ctx.canvas.drawImage(this.renderable, Math.floor(x - this._strokeWidth.screenSpace() * 2), Math.floor(y - this._strokeWidth.screenSpace() * 2));
    }

    public renderCentered(ctx: Renderable, x: number, y: number) {
        ctx.canvas.drawImage(this.renderable, Math.floor(x - this.canvasWidth / 2), Math.floor(y - this.canvasHeight / 2));
    }

    public renderVerticallyCentered(ctx: Renderable, x: number, y: number) {
        ctx.canvas.drawImage(this.renderable, Math.floor(x - this._strokeWidth.screenSpace() * 2), Math.floor(y - this.canvasHeight / 2));
    }

    public renderHorizontallyCentered(ctx: Renderable, x: number, y: number) {
        ctx.canvas.drawImage(this.renderable, Math.floor(x - this.canvasWidth / 2), Math.floor(y - this._strokeWidth.screenSpace() * 2));
    }

    /* getters & setters for non public attributes */

    public get width() { return this._width; }

    public set width(val: number) {
        if (this._width === val) return;
        this.redraw = true;
        this._width = val;
    }

    public get height() { return this._height; }

    public set height(val: number) {
        if (this._height === val) return;
        this.redraw = true;
        this._height = val;
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

    public get strokeWidth() { return this._strokeWidth; }

    public set strokeWidth(val: number) {
        if (this._strokeWidth === val) return;
        this.redraw = true;
        this._strokeWidth = val;
    }

    public get lineJoin() { return this._lineJoin; }

    public set lineJoin(val: CanvasLineJoin) {
        if (this._lineJoin === val) return;
        this.redraw = true;
        this._lineJoin = val;
    }
}