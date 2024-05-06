import Viewport from "../../core/Viewport";
import Color from "../../util/Color";
import Button from "../Button";
import Text from "../Text";

export class TextButton extends Button {
    public readonly textWidget: Text = new Text();

    public override get renderable(): CanvasImageSource {
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

        this.textWidget.renderCentered(this, this._width / 2, this._height / 2);

        this.canvas.restore();

        return this.canvas.canvas;
    }
}