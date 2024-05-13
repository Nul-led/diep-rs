import Viewport from "../core/Viewport";
import Widget from "../core/Widget";
import Color from "../util/Color";
import Text from "./Text";

export default class TextArea extends Text {
    public constructor(
        protected _text: string = "",
        protected _fontSize: number = 16,
        protected _fillColor: Color | null = Color.WHITE,
        protected _strokeColor: Color | null = Color.BLACK,
        protected _strokeWidthFactor: number = 0.2,
        protected _textAlign: "left" | "center" | "right" = "left",
    ) {
        super(_text, _fontSize, _fillColor, _strokeColor, _strokeWidthFactor);
    }

    public calculateMargin(): number {
        return this._strokeWidthFactor * this._fontSize.screenSpace() * 2;
    }

    public calculateWidth(): number {
        this.canvas.font = `${this._fontSize.screenSpace()}px Ubuntu`;
        const margin = this.calculateMargin() * 2;
        return Math.max(1, ...this._text.split("\n").map(e => this.canvas.measureText(e).width + margin));
    }

    public calculateHeight(): number {
        return Math.max(1, this._fontSize.screenSpace() * 1.4 * this._text.split("\n").length);
    }

    public get renderable(): CanvasImageSource {
        if (!this.redraw && !Viewport.guiZoomChanged) return this.canvas.canvas;
        this.redraw = false;

        const fontSize = this._fontSize.screenSpace();

        this.canvasSize = { width: this.calculateWidth(), height: this.calculateHeight() };

        this.canvas.font = `${fontSize}px Ubuntu`;
        this.canvas.textBaseline = "middle";
        this.canvas.textAlign = this._textAlign;

        // TODO

        const x = this.calculateMargin();
        const y = this.canvasHeight / 2;

        if (this._strokeWidthFactor && this._strokeColor) {
            this.canvas.fillStyle = this._strokeColor.toCSS();
            this.canvas.lineWidth = fontSize * this._strokeWidthFactor;
            this.canvas.strokeText(this._text, x, y);
        }

        if (this._fillColor) {
            this.canvas.fillStyle = this._fillColor.toCSS();
            this.canvas.fillText(this._text, x, y);
        }

        return this.canvas.canvas;
    }

    /* getters & setters for non public attributes */

    public get textAlign() { return this._textAlign; }

    public set textAlign(val: "left" | "center" | "right") {
        if (this._textAlign === val) return;
        this.redraw = true;
        this._textAlign = val;
    }
}