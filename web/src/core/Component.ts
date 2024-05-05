import Renderable from "./Renderable";
import Viewport from "./Viewport";

export abstract class Component {
    public x: number = 0;
    public y: number = 0;

    public get guiX(): number {
        return this.x * Viewport.guiZoomFactor;
    }

    public get guiY(): number {
        return this.y * Viewport.guiZoomFactor;
    }

    public abstract render(ctx: Renderable): void;
}