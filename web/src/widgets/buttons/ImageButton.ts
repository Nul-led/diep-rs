import Viewport from "../../core/Viewport";
import Color from "../../util/Color";
import Button from "../Button";
import Image from "../Image";

export default class ImageButton extends Button {
    public constructor(
        public readonly imageWidget: Image = new Image(),
        protected _x: number = 0,
        protected _y: number = 0,
        protected _width: number = 1,
        protected _height: number = 1,
        protected _strokeColor: Color | null = Color.BLACK,
        protected _strokeWidth: number = 10,
        protected _mockHover: boolean = false,
        protected _mockPress: boolean = false,
    ) {
        super();
    }

    public get renderable(): CanvasImageSource {
        if (this.interact()) this.redraw = true;
        if (this.imageWidget.redraw) this.redraw = true;
        if (!this.redraw && !Viewport.guiZoomChanged) return this.canvas.canvas;
        this.redraw = false;

        const strokeWidth = this._strokeWidth.screenSpace();
        const width = this._width.screenSpace();
        const height = this._height.screenSpace();

        this.canvasSize = { width: width + strokeWidth, height: height + strokeWidth };

        this.canvas.save();

        if (strokeWidth && this._strokeColor) {
            this.canvas.lineWidth = strokeWidth;
            this.canvas.lineJoin = "round";
            this.canvas.strokeStyle = this._strokeColor.toCSS();
            this.canvas.strokeRect(strokeWidth / 2, strokeWidth / 2, width, height);
        }

        this.canvas.drawImage(this.imageWidget.renderable, strokeWidth / 2, strokeWidth / 2, width, height);

        if (this.isPressed || this._mockPress) {
            this.canvas.globalAlpha = 0.2;
            this.canvas.fillStyle = Color.BLACK.toCSS();
            this.canvas.fillRect(strokeWidth / 2, strokeWidth / 2, width, height);
        } else if (this.isHovered || this._mockHover) {
            this.canvas.globalAlpha = 0.2;
            this.canvas.fillStyle = Color.WHITE.toCSS();
            this.canvas.fillRect(strokeWidth / 2, strokeWidth / 2, width, height);
        }

        this.canvas.restore();

        return this.canvas.canvas;
    }
}