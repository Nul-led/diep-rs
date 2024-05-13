import Viewport from "../core/Viewport";
import Widget from "../core/Widget";
import Color from "../util/Color";


export default class Bar extends Widget {
    protected redraw: boolean = true;

    constructor(
        protected _width: number = 1.0,
        protected _value: number = 0.0,
        protected _innerColor: Color = Color.WHITE,
        protected _innerHeightFactor: number = 0.75,
        protected _outerColor: Color = Color.BLACK,
        protected _outerHeight: number = 24.0,
    ) {
        super();
    }

    public get renderable(): CanvasImageSource {
        if (!this.redraw && !Viewport.guiZoomChanged) return this.canvas.canvas;
        this.redraw = false;
        
        const width = this._width.screenSpace();
        const outerHeight = this._outerHeight.screenSpace();
        const maxStroke = Math.max(this.innerHeightFactor * outerHeight, outerHeight) + 1; // + 1 px to account for subpixel offsets
        
        this.canvasSize = { width: width + maxStroke / 2, height: maxStroke };

        this.canvas.save();

        this.canvas.lineCap = "round";

        this.canvas.lineWidth = outerHeight;
        this.canvas.strokeStyle = this._outerColor.toCSS();
        this.canvas.beginPath();
        this.canvas.moveTo(outerHeight / 2, outerHeight / 2);
        this.canvas.lineTo(width, outerHeight / 2);
        this.canvas.stroke();

        this.canvas.lineWidth = this._innerHeightFactor * outerHeight;
        this.canvas.strokeStyle = this._innerColor.toCSS();
        this.canvas.beginPath();
        this.canvas.moveTo(outerHeight / 2, outerHeight / 2);
        this.canvas.lineTo(width * this._value, outerHeight / 2);
        this.canvas.stroke();

        this.canvas.restore();

        return this.canvas.canvas;
    }

    /* getters & setters for non public attributes */

    public get width() { return this._width; }

    public set width(val: number) {
        if (this._width === val) return;
        this.redraw = true;
        this._width = val;
    }

    public get value() { return this._value; }

    public set value(val: number) {
        if (this._value === val) return;
        this.redraw = true;
        this._value = val;
    }

    public get innerColor() { return this._innerColor; }

    public set innerColor(val: Color) {
        if (this._innerColor === val) return;
        this.redraw = true;
        this._innerColor = val;
    }

    public get innerHeightFactor() { return this._innerHeightFactor; }

    public set innerHeightFactor(val: number) {
        if (this._innerHeightFactor === val) return;
        this.redraw = true;
        this._innerHeightFactor = val;
    }

    public get outerColor() { return this._outerColor; }

    public set outerColor(val: Color) {
        if (this._outerColor === val) return;
        this.redraw = true;
        this._outerColor = val;
    }

    public get outerHeight() { return this._outerHeight; }

    public set outerHeight(val: number) {
        if (this._outerHeight === val) return;
        this.redraw = true;
        this._outerHeight = val;
    }
}