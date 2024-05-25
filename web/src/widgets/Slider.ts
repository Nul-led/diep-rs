import Input from "../core/Input";
import Viewport, { ScreenAnchorX, ScreenAnchorY } from "../core/Viewport";
import { InteractableWidget } from "../core/Widget";
import { clamp } from "../util/Clamp";
import Color from "../util/Color";
import { Cursor } from "../util/Cursor";

export default class Slider extends InteractableWidget {
    protected redraw: boolean = true;
    protected isSliding: boolean = false;

    constructor(
        protected _x: number = 0,
        protected _y: number = 0,
        public anchorX: ScreenAnchorX = ScreenAnchorX.Min,
        public anchorY: ScreenAnchorY = ScreenAnchorY.Min,
        protected _width: number = 100.0,
        protected _height: number = 20.0,
        public step: number = 0.01,
        protected _value: number = 0.0,
        protected _barColor: Color = Color.BLACK,
        protected _valueColor: Color = Color.WHITE,
    ) {
        super();
    }

    public onHover(): void { }
    public onClick(): void { }

    public onPress(): void {
        this.isSliding = true;
    }

    protected getInteractablePath(): Path2D {
        const path = new Path2D();
        const x = this._x.anchoredScreenSpace(this.anchorX);
        const y = this._y.anchoredScreenSpace(this.anchorY);
        const w = this._width.screenSpace();
        const h = this._height.screenSpace();
        path.rect(x, y + h * 0.25, w, h);
        path.arc(x + Math.max(w * this._value, h / 2), y + h * 0.625, h * 0.625, 0, Math.PI * 2);
        return path;
    }

    public get renderable(): CanvasImageSource {
        this.interact();

        if (this.isSliding) {
            if (!Input.mouse.leftDown) this.isSliding = false;
            this.value = clamp((Input.mouse.x - this._x.anchoredScreenSpace(this.anchorX)) / this._width.screenSpace(), 0, 1);
            Input.mouse.cursor = "pointer";
        }

        if (!this.redraw && !Viewport.guiZoomChanged) return this.canvas.canvas;
        this.redraw = false;

        const width = this._width.screenSpace();
        const height = this._height.screenSpace();
        const maxHeight = height * 1.25;

        this.canvasSize = { width: width + maxHeight / 2, height: maxHeight };

        this.canvas.save();

        this.canvas.lineCap = "round";

        this.canvas.lineWidth = height;
        this.canvas.strokeStyle = this._barColor.toCSS();
        this.canvas.beginPath();
        this.canvas.moveTo(maxHeight / 2, maxHeight / 2);
        this.canvas.lineTo(width, maxHeight / 2);
        this.canvas.stroke();

        this.canvas.lineWidth = height;
        this.canvas.strokeStyle = this._valueColor.toCSS();
        this.canvas.beginPath();
        this.canvas.moveTo(maxHeight / 2, maxHeight / 2);
        this.canvas.lineTo(Math.max(width * this._value, maxHeight / 2), maxHeight / 2);
        this.canvas.stroke();

        this.canvas.beginPath();
        this.canvas.arc(Math.max(width * this._value, maxHeight / 2), maxHeight / 2, height / 2, 0, Math.PI * 2);
        this.canvas.lineWidth = maxHeight - height;
        this.canvas.strokeStyle = Color.BLACK.toCSS();
        this.canvas.stroke();
        this.canvas.fillStyle = this._valueColor.toCSS();
        this.canvas.fill();

        this.canvas.restore();

        return this.canvas.canvas;
    }

    /* getters & setters for non public attributes */

    public get x() { return this._x; }

    public set x(val: number) {
        if (this._x === val) return;
        this.redraw = true;
        this._x = val;
    }

    public get y() { return this._y; }

    public set y(val: number) {
        if (this._y === val) return;
        this.redraw = true;
        this._y = val;
    }

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

    public get value() { return this._value; }

    public set value(val: number) {
        if (this._value === val) return;
        this.redraw = true;
        this._value = val;
    }

    public get barColor() { return this._barColor; }

    public set barColor(val: Color) {
        if (this._barColor === val) return;
        this.redraw = true;
        this._barColor = val;
    }

    public get valueColor() { return this._valueColor; }

    public set valueColor(val: Color) {
        if (this._valueColor === val) return;
        this.redraw = true;
        this._valueColor = val;
    }
}