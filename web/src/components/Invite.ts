import { Component } from "../core/Component";
import Renderable from "../core/Renderable";
import { ScreenAnchorX, ScreenAnchorY } from "../core/Viewport";
import Color from "../util/Color";
import Text from "../widgets/Text";
import { TextButton } from "../widgets/buttons/TextButton";

export default class Invite extends Component {
    public constructor(
        public button: TextButton = new TextButton(new Text("Invite", 0.56 * 24), -135, 12, ScreenAnchorX.Max, ScreenAnchorY.Min, 120, 24, Color.fromRGB(119, 119, 119), Color.fromRGB(51, 51, 51)),
        public x: number = -135,
        public y: number = 12,
        public anchorX: ScreenAnchorX = ScreenAnchorX.Max,
        public anchorY: ScreenAnchorY = ScreenAnchorY.Min,
        public inviteLink: string = "",
    ) {
        super();
    }

    public render(ctx: Renderable): void {
        const x = this.x.anchoredScreenSpace(this.anchorX);
        const y = this.y.anchoredScreenSpace(this.anchorY);

        this.button.render(ctx, x, y);
        this.button.onClick = () => navigator.clipboard.writeText(this.inviteLink); // TODO invite
    }
}