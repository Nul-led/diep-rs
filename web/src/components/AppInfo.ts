import { Component } from "../core/Component";
import Renderable from "../core/Renderable";
import Viewport, { ScreenAnchorX, ScreenAnchorY } from "../core/Viewport";
import Text from "../widgets/Text";
import TextArea from "../widgets/TextArea";

export default class AppInfo extends Component {
    public constructor(
        public readonly header: Text = new Text("diep.rs", 20),
        public readonly lines: TextArea = new TextArea("0 players", 16, "right"),
        public x: number = -20,
        public y: number = -198,
        public anchorX: ScreenAnchorX = ScreenAnchorX.Right,
        public anchorY: ScreenAnchorY = ScreenAnchorY.Bottom,
    ) {
        super();
    }

    public render(ctx: Renderable): void {
        const x = this.x.anchoredScreenSpace(this.anchorX);
        const y = this.y.anchoredScreenSpace(this.anchorY);

        this.lines.render(ctx, x - this.lines.calculateWidth(), y - this.lines.calculateHeight());
        this.header.render(ctx, x - this.header.calculateWidth(), y - this.header.calculateHeight() - this.lines.canvasHeight);
    }
}