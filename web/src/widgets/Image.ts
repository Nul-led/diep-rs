import Viewport from "../core/Viewport";
import Widget from "../core/Widget";

export default class Image extends Widget {
    public static fromURL(url: string): Image {
        const img = new HTMLImageElement;
        img.src = url;
        return new Image(img);
    }
    
    constructor(
        protected _source: HTMLImageElement | HTMLCanvasElement | OffscreenCanvas,
    ) {
        super();
    }

    public get renderable(): CanvasImageSource {
        return this._source;
    }

    /* getters & setters for non public attributes */

    public get source() { return this._source; }

    public set source(val: string | HTMLImageElement | HTMLCanvasElement | OffscreenCanvas) {
        if (this._source === val) return;
        if(typeof val === "string") {
            const img = new HTMLImageElement;
            img.src = val;
            val = img;
        }
        this._source = val;
    }
}