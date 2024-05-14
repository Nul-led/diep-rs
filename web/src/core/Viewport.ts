import Animation, { AnimationType } from "../util/Animation";
import Color from "../util/Color";
import Bar from "../widgets/Bar";
import Button from "../widgets/Button";
import Image from "../widgets/Image";
import ProgressBar from "../widgets/ProgressBar";
import Slider from "../widgets/Slider";
import Text from "../widgets/Text";
import Checkbox from "../widgets/buttons/Checkbox";
import ImageButton from "../widgets/buttons/ImageButton";
import { TextButton } from "../widgets/buttons/TextButton";
import Renderable from "./Renderable";

export default class Viewport {
    public static maxWidth: number = 1920;
    public static maxHeight: number = 1080;
    public static width: number = 1;
    public static height: number = 1;
    public static guiScale: number = 1;
    public static guiZoomFactor: number = 1;
    public static guiZoomChanged: boolean = true;

    public static ctx: Renderable = new Renderable(document.getElementById("canvas") as HTMLCanvasElement);

    protected static resize() {
        this.width = window.innerWidth * window.devicePixelRatio;
        this.height = window.innerHeight * window.devicePixelRatio;
        const guiZoomFactor = Math.max(this.width / this.maxWidth, this.height / this.maxHeight) * this.guiScale;
        this.guiZoomChanged = this.guiZoomFactor !== guiZoomFactor;
        this.guiZoomFactor = guiZoomFactor;
        this.ctx.canvasSize = { width: this.width, height: this.height };
    }

    protected static a: Slider = new Slider(100, 100, 200, 20, 0.01, 1, Color.BLACK, Color.fromRGB(255, 0, 0));

    protected static b: Text = new Text("Slider widget value: 0", 25);

    /*
        this.canvas.save();
        this.canvas.strokeStyle = Color.fromRGB(255, 0, 0).toCSS();
        this.canvas.lineWidth = 1;
        this.canvas.strokeRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.canvas.restore();
    */

    public static render() {
        this.resize();
        this.ctx.canvas.reset();
        this.a.render(this.ctx, this.a.x.screenSpace(), this.a.y.screenSpace());
        this.b.text = "Slider widget value: " + this.a.value.toFixed(2);
        this.b.renderCentered(this.ctx, this.a.x.screenSpace() + this.a.canvasWidth / 2, this.a.y.screenSpace() - (20).screenSpace());
    }
}

declare global {
    interface Number {
        screenSpace(): number;
    }
}

Number.prototype.screenSpace = function () {
    return this as number * Viewport.guiZoomFactor;
}