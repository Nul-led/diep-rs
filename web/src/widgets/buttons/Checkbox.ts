import Viewport, { ScreenAnchorX, ScreenAnchorY } from "../../core/Viewport";
import Color from "../../util/Color";
import Button from "../Button";
import Animation from "../../util/Animation";

export default class Checkbox extends Button {
    public constructor(
        protected _isChecked: boolean = false,
        protected _checkColor: Color | null = Color.BLACK,
        public checkAnimation: Animation = new Animation(),
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

    public onClick(): void {
        this.isChecked = !this.isChecked;    
    }

    public get renderable(): CanvasImageSource {
        if(this.interact()) this.redraw = true;
        if(this.checkAnimation.step(this.isChecked)) this.redraw = true;
        if (!this.redraw && !Viewport.guiZoomChanged) return this.canvas.canvas;
        this.redraw = false;

        const strokeWidth = this._strokeWidth.screenSpace();
        const width = this._width.screenSpace();
        const height = this._height.screenSpace();

        this.canvasSize = { width: width + strokeWidth, height: height + strokeWidth };

        this.canvas.save();

        if(strokeWidth && this._strokeColor) {
            this.canvas.lineWidth = strokeWidth;
            this.canvas.lineJoin = "round";
            this.canvas.strokeStyle = this._strokeColor.toCSS();
            this.canvas.strokeRect(strokeWidth / 2, strokeWidth / 2, width, height);
        }

        if(this._fillColor) {
            this.canvas.fillStyle = this._fillColor.toCSS();
            this.canvas.fillRect(strokeWidth / 2, strokeWidth / 2, width, height);
        }

        if(this._checkColor) {
            this.canvas.fillStyle = this._checkColor.toCSS();
            const w = (width * 0.75) * this.checkAnimation.latest;
            const h = (height * 0.75) * this.checkAnimation.latest;
            const x = strokeWidth / 2 + (width - w) / 2;
            const y = strokeWidth / 2 + (height - h) / 2;
            this.canvas.fillRect(x, y, w, h);
        }
        
        this.canvas.restore();

        return this.canvas.canvas;
    }

    /* getters & setters for non public attributes */

    public get isChecked() { return this._isChecked; }

    public set isChecked(val: boolean) {
        if (this._isChecked === val) return;
        this.redraw = true;
        this._isChecked = val;
    }

    public get checkColor() { return this._checkColor; }

    public set checkColor(val: Color | null) {
        if (this._checkColor === val) return;
        this.redraw = true;
        this._checkColor = val;
    }
}