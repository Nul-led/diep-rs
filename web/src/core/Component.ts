import Renderable from "./Renderable";
import { ScreenAnchorX, ScreenAnchorY } from "./Viewport";

export abstract class Component extends EventTarget {
    public constructor(
        public x: number = 0,
        public y: number = 0,
        public anchorX: ScreenAnchorX = ScreenAnchorX.Min,
        public anchorY: ScreenAnchorY = ScreenAnchorY.Min,
    ) {
        super();
    }

    public abstract render(ctx: Renderable): void;
}