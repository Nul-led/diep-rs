import { Component } from "../core/Component";
import Renderable from "../core/Renderable";
import { ScreenAnchorX, ScreenAnchorY } from "../core/Viewport";
import Color from "../util/Color";

export default class Minimap extends Component {
    public readonly buffer: Renderable = new Renderable();

    public constructor(
        public x: number = -20,
        public y: number = -20,
        public anchorX: ScreenAnchorX = ScreenAnchorX.Max,
        public anchorY: ScreenAnchorY = ScreenAnchorY.Max,
        public sizeX: number = 175,
        public sizeY: number = 175,
        public backgroundColor = Color.fromRGB(205, 205, 205),
        public strokeColor = Color.fromRGB(121, 121, 121),
    ) {
        super();
    }

    public getBufferCtx(): CanvasRenderingContext2D {
        return this.buffer.canvas;
    }

    public render(ctx: Renderable): void {
        ctx.canvas.save();
        ctx.canvas.globalAlpha = 0.7;

        const x = (this.x - this.sizeX).anchoredScreenSpace(this.anchorX);
        const y = (this.y - this.sizeY).anchoredScreenSpace(this.anchorY);
        const sizeX = this.sizeX.screenSpace();
        const sizeY = this.sizeY.screenSpace();

        ctx.canvas.save();
        ctx.canvas.translate(x, y);
        ctx.canvas.scale(this.sizeX.screenSpace(), this.sizeY.screenSpace());
        ctx.canvas.save();
        ctx.canvas.beginPath();
        ctx.canvas.rect(0, 0, 1, 1);
        ctx.canvas.clip();
        ctx.canvas.fillStyle = this.backgroundColor.toCSS();
        ctx.canvas.fillRect(0, 0, 1, 1);
        
        ctx.canvas.drawImage(this.buffer.canvas.canvas, 0, 0, 1, 1);

        ctx.canvas.restore();
        ctx.canvas.strokeStyle = this.strokeColor.toCSS();
        ctx.canvas.lineWidth = 0.03;
        ctx.canvas.lineJoin = "round";
        ctx.canvas.strokeRect(0, 0, 1, 1);
        ctx.canvas.restore();

        ctx.canvas.restore();
    }
}