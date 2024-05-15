import { Component } from "../core/Component";
import Renderable from "../core/Renderable";
import { ScreenAnchorX, ScreenAnchorY } from "../core/Viewport";
import Text from "../widgets/Text";
import TextArea from "../widgets/TextArea";

export default class Changelog extends Component {
    public constructor(
        public readonly header: Text = new Text("Changelog", 20),
        public readonly lines: TextArea = new TextArea("test entry\ntest entry 2", 16),
        public x: number = 30,
        public y: number = 30,
        public anchorX: ScreenAnchorX = ScreenAnchorX.Min,
        public anchorY: ScreenAnchorY = ScreenAnchorY.Min,
    ) {
        super();
    }

    public render(ctx: Renderable): void {
        const x = this.x.anchoredScreenSpace(this.anchorX);
        const y = this.y.anchoredScreenSpace(this.anchorY);

        this.header.render(ctx, x, y);
        this.lines.render(ctx, x, y + this.header.canvasHeight);
    }
}