import { Component } from "../core/Component";
import Renderable from "../core/Renderable";
import { ScreenAnchorX, ScreenAnchorY } from "../core/Viewport";
import Color from "../util/Color";
import ProgressBar from "../widgets/ProgressBar";
import Text from "../widgets/Text";

export default class PlayerStatus extends Component {
    public constructor(
        public readonly lebelbar: ProgressBar = new ProgressBar(new Text("Lvl 1 Tank", 16), 424, 24, new Color(16768579)),
        public readonly scorebar: ProgressBar = new ProgressBar(new Text("Score: 0", 15), 320, 20, new Color(4456337)),
        public readonly playerNameText: Text = new Text("Unnamed", 40),
        public x: number = 0,
        public y: number = -34,
        public anchorX: ScreenAnchorX = ScreenAnchorX.Half,
        public anchorY: ScreenAnchorY = ScreenAnchorY.Max,
        public renderScorebar: boolean = true,
    ) {
        super();
    }

    public render(ctx: Renderable): void {
        ctx.canvas.save();
        ctx.canvas.globalAlpha = 0.7;

        const x = this.x.anchoredScreenSpace(this.anchorX);
        const y = this.y.anchoredScreenSpace(this.anchorY);
        const levelbarHeight = this.lebelbar.outerHeight.screenSpace();
        const scorebarHeight = this.scorebar.outerHeight.screenSpace();

        this.lebelbar.renderCentered(ctx, x, y);
        if (this.renderScorebar) this.scorebar.renderCentered(ctx, x, y - levelbarHeight);
        this.playerNameText.renderCentered(ctx, x, y - levelbarHeight - (this.renderScorebar ? (scorebarHeight + levelbarHeight / 2) : (levelbarHeight / 2)));
        
        ctx.canvas.restore();
    }
}