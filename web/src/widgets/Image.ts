import Widget from "../core/Widget";
import { preLoader } from "../../res/Images.json";

const cachedPreLoaderImg = document.createElement("img");
cachedPreLoaderImg.src = preLoader;

export default class Image extends Widget {
    public redraw: boolean = false;

    public static fromURL(url: string): Image {
        const img = document.createElement("img");
        const widget = new Image(img);
        img.src = url;
        img.onload = () => widget.redraw = true;
        return widget;
    }
    
    constructor(
        protected _source: null | HTMLImageElement | HTMLCanvasElement | OffscreenCanvas = null,
    ) {
        super();
    }

    public get renderable(): CanvasImageSource {
        if(this._source instanceof HTMLImageElement && !this._source.complete) return cachedPreLoaderImg;
        return this._source || this.canvas.canvas;
    }

    /* getters & setters for non public attributes */

    public get source() { return this._source; }

    public set source(val: null | string | HTMLImageElement | HTMLCanvasElement | OffscreenCanvas) {
        if (this._source === val) return;
        if(typeof val === "string") {
            const img = document.createElement("img");
            img.src = val;
            img.onload = () => this.redraw = true;
            val = img;
        }
        this._source = val;
    }

    public get sourceSize(): ({ width: number, height: number }) {
        return {
            width: this._source?.width || 0,
            height: this._source?.height || 0,
        };
    }

    public get sourceWidth() {
        return this._source?.width || 0;
    }

    public get sourceHeight() {
        return this._source?.height || 0;
    }
}