import Renderable from "../core/Renderable";
import Viewport, { ScreenAnchorX, ScreenAnchorY } from "../core/Viewport";
import { InteractableWidget } from "../core/Widget";
import Color from "../util/Color";


export default class Button extends InteractableWidget {
    protected redraw: boolean = true;

    public constructor(
        protected _x: number = 0,
        protected _y: number = 0,
        public anchorX: ScreenAnchorX = ScreenAnchorX.Min,
        public anchorY: ScreenAnchorY = ScreenAnchorY.Min,
        protected _width: number = 1,
        protected _height: number = 1,
        protected _fillColor: Color | null = Color.WHITE,
        protected _strokeColor: Color | null = Color.BLACK,
        protected _strokeWidth: number = 10,
        protected _mockHover: boolean = false,
        protected _mockPress: boolean = false,
    ) {
        super();
    }

    public onHover(): void { }
    public onPress(): void { }
    public onClick(): void { }

    protected getInteractablePath(): Path2D {
        const path = new Path2D();
        path.rect(this._x.anchoredScreenSpace(this.anchorX), this._y.anchoredScreenSpace(this.anchorY), this._width.screenSpace(), this._height.screenSpace());
        return path;
    }

    public get renderable(): CanvasImageSource {
        if (this.interact()) this.redraw = true;
        if (!this.redraw && !Viewport.guiZoomChanged) return this.canvas.canvas;
        this.redraw = false;

        const strokeWidth = this._strokeWidth.screenSpace();
        const width = this._width.screenSpace();
        const height = this._height.screenSpace();

        this.canvasSize = { width: width + strokeWidth, height: height + strokeWidth };

        this.canvas.save();

        const fillColor = this._fillColor?.clone();

        if (fillColor) {
            if (this.isPressed || this._mockPress) fillColor.blendWith(0.2, Color.BLACK);
            else if (this.isHovered || this._mockHover) fillColor.blendWith(0.2, Color.WHITE);
        }

        if (strokeWidth && this._strokeColor) {
            this.canvas.lineWidth = strokeWidth;
            this.canvas.lineJoin = "round";
            this.canvas.strokeStyle = this._strokeColor.toCSS();
            this.canvas.strokeRect(strokeWidth / 2, strokeWidth / 2, width, height);
        }

        if (fillColor) {
            this.canvas.fillStyle = fillColor.toCSS();
            this.canvas.fillRect(strokeWidth / 2, strokeWidth / 2, width, height);
        }

        this.canvas.globalAlpha = 0.2;
        this.canvas.fillStyle = Color.BLACK.toCSS();

        if (this.isPressed || this._mockPress) {
            this.canvas.fillRect(strokeWidth / 2, strokeWidth / 2, width, height * 7 / 12);
        } else {
            this.canvas.fillRect(strokeWidth / 2, strokeWidth / 2 + height * 7 / 12, width, height - height * 7 / 12);
        }

        this.canvas.restore();

        return this.canvas.canvas;
    }

    public render(ctx: Renderable, x: number, y: number) {
        ctx.canvas.drawImage(this.renderable, Math.floor(x - this._strokeWidth.screenSpace() / 2), Math.floor(y - this._strokeWidth.screenSpace() / 2));
    }

    public renderVerticallyCentered(ctx: Renderable, x: number, y: number) {
        ctx.canvas.drawImage(this.renderable, Math.floor(x - this._strokeWidth.screenSpace() / 2), Math.floor(y - this.canvasHeight / 2));
    }

    public renderHorizontallyCentered(ctx: Renderable, x: number, y: number) {
        ctx.canvas.drawImage(this.renderable, Math.floor(x - this.canvasWidth / 2), Math.floor(y - this._strokeWidth.screenSpace() / 2));
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

    public get forceHover() { return this._mockHover; }

    public set forceHover(val: boolean) {
        if (this._mockHover === val) return;
        this.redraw = true;
        this._mockHover = val;
    }

    public get forcePress() { return this._mockPress; }

    public set forcePress(val: boolean) {
        if (this._mockPress === val) return;
        this.redraw = true;
        this._mockPress = val;
    }
}



