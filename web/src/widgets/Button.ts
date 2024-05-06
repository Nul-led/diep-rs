import Renderable from "../core/Renderable";
import Viewport from "../core/Viewport";
import { InteractableWidget } from "../core/Widget";
import Color from "../util/Color";


export default class Button extends InteractableWidget {
    protected redraw: boolean = true;

    public constructor(
        protected _x: number = 0,
        protected _y: number = 0,
        protected _width: number = 1,
        protected _height: number = 1,
        protected _fillColor: Color | null = Color.WHITE,
        protected _strokeColor: Color | null = Color.BLACK,
        protected _strokeWidth: number = 10,
        protected _forceHover: boolean = false,
        protected _forcePress: boolean = false,
    ) {
        super();
    }

    onHover(): void { }
    onPress(): void { }
    onClick(): void { }

    protected getInteractablePath(): Path2D {
        const path = new Path2D();
        path.rect(this._x, this._y, this._width, this._height);
        return path;
    }

    public get renderable(): CanvasImageSource {
        this.redraw ||= this.interact(this.getInteractablePath());
        if (!this.redraw && !Viewport.guiZoomChanged) return this.canvas.canvas;
        this.redraw = false;

        const strokeWidth = this._strokeWidth.screenSpace();

        this.canvasSize = { width: this._width + strokeWidth * 4, height: this._height + strokeWidth * 4 };

        this.canvas.save();

        const fillColor = this._fillColor;

        if(fillColor) {
            if(this.isPressed) fillColor.blendWith(0.2, Color.BLACK);
            else if (this.isHovered) fillColor.blendWith(0.2, Color.WHITE);
        }

        this.canvas.translate(strokeWidth * 2, strokeWidth * 2);

        if(strokeWidth && this._strokeColor) {
            this.canvas.lineWidth = strokeWidth;
            this.canvas.lineJoin = "round";
            this.canvas.strokeStyle = this._strokeColor.toCSS();
            this.canvas.strokeRect(0, 0, this._width, this._height);
        }

        if(fillColor) {
            this.canvas.fillStyle = fillColor.toCSS();
            this.canvas.fillRect(0, 0, this._width, this._height);
        }

        this.canvas.globalAlpha = 0.2;
        this.canvas.fillStyle = Color.BLACK.toCSS();
        
        if(this.isPressed) {
            this.canvas.fillRect(0, 0, this._width, this._height * 7 / 12);
        } else {
            this.canvas.fillRect(0, this._height * 7 / 12, this._width, this._height * 7 / 12);
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

    public get forceHover() { return this._forceHover; }

    public set forceHover(val: boolean) {
        if (this._forceHover === val) return;
        this.redraw = true;
        this._forceHover = val;
    }

    public get forcePress() { return this._forcePress; }

    public set forcePress(val: boolean) {
        if (this._forcePress === val) return;
        this.redraw = true;
        this._forcePress = val;
    }
}



