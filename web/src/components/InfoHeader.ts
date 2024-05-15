import { Component } from "../core/Component";
import Renderable from "../core/Renderable";
import { ScreenAnchorX, ScreenAnchorY } from "../core/Viewport";
import Text from "../widgets/Text";

export default class InfoHeader extends Component {
    public constructor(
        public readonly header: Text = new Text("Connecting...", 70),
        public x: number = 0,
        public y: number = 0,
        public anchorX: ScreenAnchorX = ScreenAnchorX.Center,
        public anchorY: ScreenAnchorY = ScreenAnchorY.Center,
    ) {
        super();
    }

    public render(ctx: Renderable): void {
        const x = this.x.anchoredScreenSpace(this.anchorX);
        const y = this.y.anchoredScreenSpace(this.anchorY);

        this.header.renderCentered(ctx, x, y);
    }
}