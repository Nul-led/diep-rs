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
        public anchorX: ScreenAnchorX = ScreenAnchorX.Half,
        public anchorY: ScreenAnchorY = ScreenAnchorY.Half,
        public slideDownAnimation: Animation = new Animation(AnimationType.EaseOutExpo, 0.0075),
        public slideUpAnimation: Animation = new Animation(AnimationType.EaseInSine, 0.05, 1),
        public isDown: boolean = true,
    ) {
        super();
    }

    public render(ctx: Renderable): void {
        const x = this.x.anchoredScreenSpace(this.anchorX);
        const animation = this.isDown ? this.slideDownAnimation : this.slideUpAnimation;
        animation.step(this.isDown);
        const y = this.y.anchoredScreenSpace(this.anchorY) * animation.latest;

        // dont actually render if not needed
        if(animation.timer === 0) return;

        this.header.renderCentered(ctx, x, y);
    }
}