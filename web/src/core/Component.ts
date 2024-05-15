import Renderable from "./Renderable";
import { ScreenAnchorX, ScreenAnchorY } from "./Viewport";

export abstract class Component {
    public constructor(
        public x: number = 0,
        public y: number = 0,
        public anchorX: ScreenAnchorX = ScreenAnchorX.Left,
        public anchorY: ScreenAnchorY = ScreenAnchorY.Top,
    ) { }

    public abstract render(ctx: Renderable): void;
}