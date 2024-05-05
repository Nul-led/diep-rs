export default class Renderable {
    public canvas: CanvasRenderingContext2D;

    public constructor(canvas?: HTMLCanvasElement) {
        const ctx = (canvas || new OffscreenCanvas(1, 1)).getContext("2d");
        if (!ctx) throw "Unable to create a new canvas context";
        this.canvas = ctx as CanvasRenderingContext2D; // Quick hack since these types are pretty much overlapping
        this.canvas.imageSmoothingEnabled = false;
    }

    public get renderable(): CanvasImageSource {
        return this.canvas.canvas;
    }

    public get canvasSize(): ({ width: number, height: number }) {
        return {
            width: this.canvas.canvas.width,
            height: this.canvas.canvas.height,
        };
    }

    public set canvasSize(value: ({ width: number, height: number })) {
        this.canvas.canvas.width = Math.max(1, value.width);
        this.canvas.canvas.height = Math.max(1, value.height);
    }

    public get canvasWidth(): number {
        return this.canvas.canvas.width;
    }

    public get canvasHeight(): number {
        return this.canvas.canvas.width;
    }

    public set canvasWidth(value: number) {
        this.canvas.canvas.width = Math.max(1, value);
    }

    public set canvasHeight(value: number) {
        this.canvas.canvas.height = Math.max(1, value);
    }
}