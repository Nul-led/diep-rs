import { Component } from "../core/Component";
import Renderable from "../core/Renderable";
import { ScreenAnchorX, ScreenAnchorY } from "../core/Viewport";
import Color from "../util/Color";
import ProgressBar from "../widgets/ProgressBar";
import Text from "../widgets/Text";

export default class Scoreboard extends Component {
    public constructor(
        public readonly header: Text = new Text("Scoreboard", 24),
        public scoreboard: ProgressBar[] = [],
        public x: number = -130,
        public y: number = 32,
        public anchorX: ScreenAnchorX = ScreenAnchorX.Max,
        public anchorY: ScreenAnchorY = ScreenAnchorY.Min,
        public renderScorebar: boolean = true,
    ) {
        super();
    }

    /*public set scoreboardEntries(entries: ScoreboardEntry[]) {
        TODO
    }*/

    public render(ctx: Renderable): void {
        const x = this.x.anchoredScreenSpace(this.anchorX);
        const y = this.y.anchoredScreenSpace(this.anchorY);
    }
}

/*

export default class Scoreboard {
    protected static header: Text = new Text();
    public static scoreboard: ScoreboardEntry[] = [];

    public static render(ctx: Context): void {
        const x = Renderer.screenWidth - Renderer.screenSpace(130);
        let y = Renderer.screenSpace(32);
        const w = Renderer.screenSpace(220);
        const h = Renderer.screenSpace(20);
        this.header.text = "Scoreboard";
        this.header.fontSize = Renderer.screenSpace(24);
        this.header.renderBufferedCentered(ctx, x, y);
        y += this.header.height;

        const maxScore = this.scoreboard[0]?.score || 0;

        for (const entry of this.scoreboard) {
            const amount = entry === this.scoreboard[0] ? 1 : entry.score / maxScore;
            // TODO color config
            Renderer.drawBar(ctx, amount, x, y, w, h, entry.color, Color.BLACK);

            ctx.canvas.save();
            ctx.canvas.translate(x + (w - h) * amount + ((w - h) / -2), y);
            if (entry === this.scoreboard[0]) ctx.canvas.rotate(Math.PI);
            entry._tank.tank = entry.tank;
            entry._tank.scale = Renderer.screenSpace(0.13);
            entry._tank.centerAroundAABB = false;
            entry._tank.renderBufferedCentered(ctx, 0, 0);
            ctx.canvas.restore();

            entry._text.text = `${entry.name} - ${Renderer.prettifyNumber(entry.score)} ${entry.suffix}`;
            entry._text.fontSize = Renderer.screenSpace(15);
            entry._text.renderBufferedCentered(ctx, x, y);
            y += Renderer.screenSpace(24);
        }
    }
}

*/