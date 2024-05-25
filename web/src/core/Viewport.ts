import AppInfo from "../components/AppInfo";
import Changelog from "../components/Changelog";
import InfoHeader from "../components/InfoHeader";
import Invite from "../components/Invite";
import Minimap from "../components/Minimap";
import PlayerStatus from "../components/PlayerStatus";
import Renderable from "./Renderable";

export enum ScreenAnchorX {
    Min = 0,
    Half = 1,
    Max = 2,
}

export enum ScreenAnchorY {
    Min = 3,
    Half = 4,
    Max = 5,
}

export default class Viewport {
    public static maxWidth: number = 1920;
    public static maxHeight: number = 1080;
    public static width: number = 1;
    public static height: number = 1;
    public static guiScale: number = 1;
    public static guiZoomFactor: number = 1;
    public static guiZoomChanged: boolean = true;

    public static ctx: Renderable = new Renderable(document.getElementById("canvas") as HTMLCanvasElement);

    protected static resize() {
        this.width = window.innerWidth * window.devicePixelRatio;
        this.height = window.innerHeight * window.devicePixelRatio;
        const guiZoomFactor = Math.max(this.width / this.maxWidth, this.height / this.maxHeight) * this.guiScale;
        this.guiZoomChanged = this.guiZoomFactor !== guiZoomFactor;
        this.guiZoomFactor = guiZoomFactor;
        this.ctx.canvasSize = { width: this.width, height: this.height };
    }

    public static appInfo: AppInfo | null = new AppInfo;
    public static attributes: null = null;
    public static changelog: Changelog | null = new Changelog;
    public static classes: null = null;
    public static classTree: null = null;
    public static console: null = null;
    public static fadeout: null = null;
    public static gameModes: null = null;
    public static infoHeader: InfoHeader | null = new InfoHeader;
    public static invite: Invite | null = new Invite;
    public static minimap: Minimap | null = new Minimap;
    public static notifications: null = null;
    public static playerStats: null = null;
    public static playerStatus: PlayerStatus | null = new PlayerStatus;
    public static scoreboard: null = null;
    public static spawnMenu: null = null;

    /*
        this.canvas.save();
        this.canvas.strokeStyle = Color.fromRGB(255, 0, 0).toCSS();
        this.canvas.lineWidth = 1;
        this.canvas.strokeRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.canvas.restore();
    */

    public static startFrame() {
        this.resize();
        this.ctx.canvas.reset();
    }

    public static renderComponents() {
        if (this.appInfo) this.appInfo.render(this.ctx);
        //if(this.attributes) this.attributes.render(this.ctx);
        //if(this.changelog) this.changelog.render(this.ctx);
        //if(this.classes) this.classes.render(this.ctx);
        //if(this.classTree) this.classTree.render(this.ctx);
        //if(this.console) this.console.render(this.ctx);
        //if(this.fadeout) this.fadeout.render(this.ctx);
        //if(this.gameModes) this.gameModes.render(this.ctx);
        if (this.infoHeader) this.infoHeader.render(this.ctx);
        if (this.invite) this.invite.render(this.ctx);
        if (this.minimap) this.minimap.render(this.ctx);
        //if(this.notifications) this.notifications.render(this.ctx);
        //if(this.playerStats) this.playerStats.render(this.ctx);
        if (this.playerStatus) this.playerStatus.render(this.ctx);
        //if(this.scoreboard) this.scoreboard.render(this.ctx);
        //if(this.spawnMenu) this.spawnMenu.render(this.ctx);
    }
}

declare global {
    interface Number {
        screenSpace(): number;
        anchoredScreenSpace(anchor: ScreenAnchorX | ScreenAnchorY): number;
    }
}

Number.prototype.screenSpace = function () {
    return (this as number) * Viewport.guiZoomFactor;
}

Number.prototype.anchoredScreenSpace = function (anchor: ScreenAnchorX | ScreenAnchorY) {
    switch (anchor) {
        case ScreenAnchorX.Min: return (this as number) * Viewport.guiZoomFactor;
        case ScreenAnchorX.Half: return Viewport.width / 2 + (this as number) * Viewport.guiZoomFactor;
        case ScreenAnchorX.Max: return Viewport.width + (this as number) * Viewport.guiZoomFactor;
        case ScreenAnchorY.Min: return (this as number) * Viewport.guiZoomFactor;
        case ScreenAnchorY.Half: return Viewport.height / 2 + (this as number) * Viewport.guiZoomFactor;
        case ScreenAnchorY.Max: return Viewport.height + (this as number) * Viewport.guiZoomFactor;
    }
}