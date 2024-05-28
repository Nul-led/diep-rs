import { Component } from "../core/Component";
import Renderable from "../core/Renderable";
import { ScreenAnchorX, ScreenAnchorY } from "../core/Viewport";
import Animation, { AnimationType } from "../util/Animation";
import Text from "../widgets/Text";
import TextArea from "../widgets/TextArea";

export default class Attributes extends Component {
    public constructor(
        public readonly unAllocatedText: Text = new Text("", 24),
        public readonly animation: Animation = new Animation(AnimationType.EaseInOutExpo, 0.1),
        public readonly
        public x: number = -20,
        public y: number = -198,
        public anchorX: ScreenAnchorX = ScreenAnchorX.Max,
        public anchorY: ScreenAnchorY = ScreenAnchorY.Max,
    ) {
        super();
    }

    public render(ctx: Renderable): void {
        ctx.canvas.save();
        ctx.canvas.globalAlpha = 0.7;

        40 - 400 * (1 - this.animation.latest)

        const x = this.x.anchoredScreenSpace(this.anchorX);
        const y = this.y.anchoredScreenSpace(this.anchorY);

        ctx.canvas.restore();
    }
}