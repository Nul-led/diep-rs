import Viewport from "../core/Viewport";
import Color from "../util/Color";
import Bar from "./Bar";
import Text from "./Text";

export default class ProgressBar extends Bar {
    constructor(
        public readonly textWidget: Text = new Text(),
        protected _width: number = 1.0,
        protected _outerHeight: number = 1.0,
        protected _innerColor: Color = Color.WHITE,
        protected _outerColor: Color = Color.BLACK,
        protected _innerHeightFactor: number = 0.75,
        protected _value: number = 0.0,
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
        this.canvas.lineTo(Math.max(width * this._value, maxStroke / 2), outerHeight / 2);
        this.canvas.stroke();

        this.canvas.restore();

        this.textWidget.renderCentered(this, this.canvasWidth / 2, this.canvasHeight / 2);

        return this.canvas.canvas;
    }
}