import { Component } from "../core/Component";
import Renderable from "../core/Renderable";
import { ScreenAnchorX, ScreenAnchorY } from "../core/Viewport";
import Animation, { AnimationType } from "../util/Animation";
import Text from "../widgets/Text";

export default class InfoHeader extends Component {
    public constructor(
        public readonly header: Text = new Text("Connecting...", 70),
        public x: number = 0,
        public y: number = 0,
        public anchorX: ScreenAnchorX = ScreenAnchorX.Center,
        public anchorY: ScreenAnchorY = ScreenAnchorY.Center,
        public animation: Animation = new Animation(AnimationType.EaseOutExpo, 0.0075),
    ) {
        super();
    }

    public resetAnimation() {
        this.animation.timer = 0;
    }

    public render(ctx: Renderable): void {
        const x = this.x.anchoredScreenSpace(this.anchorX);
        this.animation.stepForward();
        const y = this.y.anchoredScreenSpace(this.anchorY) * this.animation.latest;

        this.header.renderCentered(ctx, x, y);
    }
}