import Animation, { AnimationType } from "../util/Animation";
import Color from "../util/Color";
import Bar from "../widgets/Bar";
import Button from "../widgets/Button";
import Image from "../widgets/Image";
import ProgressBar from "../widgets/ProgressBar";
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

    protected static a: ProgressBar = new ProgressBar(new Text("100%", 150 / 1.4), 300, 0.5, Color.WHITE, 0.75, Color.BLACK, 150);

    protected static b: Button = new Button(100, 100, 200, 200, Color.fromRGB(0, 0, 255), Color.BLACK, 20, false, false);

    protected static c: Checkbox = new Checkbox(true, Color.fromRGB(255,0,0), new Animation(AnimationType.EaseInOutExpo, 0.05), 100, 100, 50, 50, Color.WHITE, Color.BLACK, 20, false, false);

    protected static d: TextButton = new TextButton(new Text("test button", 20), 100, 100, 200, 200, Color.fromRGB(0, 0, 255), Color.BLACK, 20, false, false);

    protected static e: ImageButton = new ImageButton(Image.fromURL("https://assets.hager.com/step-content/P/HA_22410449/10/std.lang.all/WDI100.webp"), 100, 100, 200, 200, Color.BLACK, 20, false, false);

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
        //this.a.renderCentered(this.ctx, this.width / 2, this.height / 2);
        //this.b.render(this.ctx, this.b.x.screenSpace(), this.b.y.screenSpace());
        //this.b.renderVerticallyCentered(this.ctx, (this.b.x + this.b.width / 2).screenSpace(), (this.b.y).screenSpace());
        //this.c.render(this.ctx, this.c.x.screenSpace(), this.c.y.screenSpace());
        //this.d.render(this.ctx, this.d.x.screenSpace(), this.d.y.screenSpace());
        this.e.render(this.ctx, this.e.x.screenSpace(), this.e.y.screenSpace());
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