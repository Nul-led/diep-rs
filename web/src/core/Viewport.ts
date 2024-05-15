import Animation, { AnimationType } from "../util/Animation";
import Color from "../util/Color";
import Bar from "../widgets/Bar";
import Button from "../widgets/Button";
import Image from "../widgets/Image";
import ProgressBar from "../widgets/ProgressBar";
import Slider from "../widgets/Slider";
import Text from "../widgets/Text";
import TextArea from "../widgets/TextArea";
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

    protected static a: TextArea = new TextArea("😀 test test test\ntest1 28382382838\nthis   is   a    very long         string        :)))))))", 16, "center");

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
        this.a.render(this.ctx, 500, 500);
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