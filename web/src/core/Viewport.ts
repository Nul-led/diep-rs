import AppInfo from "../components/AppInfo";
import Changelog from "../components/Changelog";
import InfoHeader from "../components/InfoHeader";
import PlayerStatus from "../components/PlayerStatus";
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

export enum ScreenAnchorX {
    Min = 0,
    Half = 1,
    Max = 2,
}

export enum ScreenAnchorY {
    Min = 3,
    Half = 4,
    Max = 5,
}

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

    public static a = new AppInfo();
    public static b = new Changelog();
    public static c = new InfoHeader();
    public static d = new PlayerStatus();

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
        this.a.render(this.ctx);
        this.b.render(this.ctx);
        this.c.render(this.ctx);
        this.d.render(this.ctx);
    }
}

declare global {
    interface Number {
        screenSpace(): number;
        anchoredScreenSpace(anchor: ScreenAnchorX | ScreenAnchorY): number;
    }
}

Number.prototype.screenSpace = function () {
    return (this as number) * Viewport.guiZoomFactor;
}

Number.prototype.anchoredScreenSpace = function (anchor: ScreenAnchorX | ScreenAnchorY) {
    switch (anchor) {
        case ScreenAnchorX.Min: return (this as number) * Viewport.guiZoomFactor;
        case ScreenAnchorX.Half: return Viewport.width / 2 + (this as number) * Viewport.guiZoomFactor;
        case ScreenAnchorX.Max: return Viewport.width + (this as number) * Viewport.guiZoomFactor;
        case ScreenAnchorY.Min: return (this as number) * Viewport.guiZoomFactor;
        case ScreenAnchorY.Half: return Viewport.height / 2 + (this as number) * Viewport.guiZoomFactor;
        case ScreenAnchorY.Max: return Viewport.height + (this as number) * Viewport.guiZoomFactor;
    }
}