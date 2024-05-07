import Viewport from "../../core/Viewport";
import Color from "../../util/Color";
import Button from "../Button";

export default class Checkbox extends Button {
    public constructor(
        protected _isChecked: boolean = false,
        protected _checkColor: Color | null = Color.BLACK,
        protected _x: number = 0,
        protected _y: number = 0,
        protected _width: number = 1,
        protected _height: number = 1,
        protected _fillColor: Color | null = Color.WHITE,
        protected _strokeColor: Color | null = Color.BLACK,
        protected _strokeWidth: number = 10,
        protected _mockHover: boolean = false,
        protected _mockPress: boolean = false,
    ) {
        super(_x, _y, _width, _height, _fillColor, _strokeColor, _strokeWidth, _mockHover, _mockPress);
    }

    public get renderable(): CanvasImageSource {
        this.redraw ||= this.interact(this.getInteractablePath());
        if (!this.redraw && !Viewport.guiZoomChanged) return this.canvas.canvas;
        this.redraw = false;

        const strokeWidth = this._strokeWidth.screenSpace();

        this.canvasSize = { width: this._width + strokeWidth * 4, height: this._height + strokeWidth * 4 };

        this.canvas.save();

        this.canvas.translate(strokeWidth * 2, strokeWidth * 2);

        if(strokeWidth && this._strokeColor) {
            this.canvas.lineWidth = strokeWidth;
            this.canvas.lineJoin = "round";
            this.canvas.strokeStyle = this._strokeColor.toCSS();
            this.canvas.strokeRect(0, 0, this._width, this._height);
        }

        if(this._fillColor) {
            let fillColor = this._fillColor;
            if(this.isPressed || this._mockPress) fillColor.blendWith(0.2, Color.BLACK);
            else if(this.isHovered || this._mockHover) fillColor.blendWith(0.2, Color.WHITE); 
            this.canvas.fillStyle = fillColor.toCSS();
            this.canvas.fillRect(0, 0, this._width, this._height);
        }

        if(this.isChecked && this._checkColor) {
            this.canvas.fillStyle = this._checkColor.toCSS();
            this.canvas.fillRect(this._width * 0.075, this._height * 0.075, this._width * 0.85, this._height * 0.85);
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