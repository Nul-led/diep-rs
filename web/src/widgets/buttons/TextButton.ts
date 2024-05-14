import Viewport from "../../core/Viewport";
import Color from "../../util/Color";
import Button from "../Button";
import Text from "../Text";

export class TextButton extends Button {
    public constructor(
        public readonly textWidget: Text = new Text(),
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
        super();
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

        this.textWidget.renderCentered(this, this.canvasWidth / 2, this.canvasHeight / 2);

        return this.canvas.canvas;
    }
}