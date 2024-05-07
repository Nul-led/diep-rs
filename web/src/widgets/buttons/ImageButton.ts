import Viewport from "../../core/Viewport";
import Color from "../../util/Color";
import Button from "../Button";
import Image from "../Image";

export default class ImageButton extends Button {
    public readonly imageWidget: Image = new Image();

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

        this.canvas.drawImage(this.imageWidget.renderable, Math.floor(this._width - this.imageWidget.canvasWidth / 2), Math.floor(this._height - this.imageWidget.canvasHeight / 2), this._width, this._height);

        if(this.isPressed || this._mockPress) {
            this.canvas.globalAlpha = 0.2;
            this.canvas.fillStyle = Color.BLACK.toCSS();
            this.canvas.fillRect(0, 0, this._width, this._height);
        } else if(this.isHovered || this._mockHover) {
            this.canvas.globalAlpha = 0.2;
            this.canvas.fillStyle = Color.WHITE.toCSS();
            this.canvas.fillRect(0, 0, this._width, this._height);
        }

        this.canvas.restore();

        return this.canvas.canvas;
    }

    /* getters & setters for non public attributes */

    public get fillColor() { throw "Unusable property"; }
    public set fillColor(_: Color | null) { throw "Unusable property"; }
}