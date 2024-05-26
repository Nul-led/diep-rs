import AppInfo from "../components/AppInfo";
import Changelog from "../components/Changelog";
import InfoHeader from "../components/InfoHeader";
import Invite from "../components/Invite";
import Minimap from "../components/Minimap";
import PlayerStatus from "../components/PlayerStatus";
import Input from "./Input";
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

    public static appInfo: AppInfo | null = new AppInfo;
    public static attributes: null = null;
    public static changelog: Changelog | null = new Changelog;
    public static classes: null = null;
    public static classTree: null = null;
    public static console: null = null;
    public static fadeout: null = null;
    public static gameModes: null = null;
    public static infoHeader: InfoHeader | null = null;
    public static invite: Invite | null = new Invite;
    public static minimap: Minimap | null = new Minimap;
    public static notifications: null = null;
    public static playerStats: null = null;
    public static playerStatus: PlayerStatus | null = new PlayerStatus;
    public static scoreboard: null = null;
    public static spawnMenu: null = null;

    protected static resize() {
        Viewport.width = window.innerWidth * window.devicePixelRatio;
        Viewport.height = window.innerHeight * window.devicePixelRatio;
        const guiZoomFactor = Math.max(Viewport.width / Viewport.maxWidth, Viewport.height / Viewport.maxHeight) * Viewport.guiScale;
        Viewport.guiZoomChanged = Viewport.guiZoomFactor !== guiZoomFactor;
        Viewport.guiZoomFactor = guiZoomFactor;
        Viewport.ctx.canvasSize = { width: Viewport.width, height: Viewport.height };
    }

    /*
        this.canvas.save();
        this.canvas.strokeStyle = Color.fromRGB(255, 0, 0).toCSS();
        this.canvas.lineWidth = 1;
        this.canvas.strokeRect(0, 0, Viewport.canvasWidth, Viewport.canvasHeight);
        this.canvas.restore();
    */

    public static getCtx(): CanvasRenderingContext2D {
        return Viewport.ctx.canvas;
    }
    
    public static startFrame() {
        Viewport.resize();
        Viewport.ctx.canvas.reset();
        Input.startFrame();
    }

    public static renderComponents() {
        if (Viewport.appInfo) Viewport.appInfo.render(Viewport.ctx);
        //if(Viewport.attributes) Viewport.attributes.render(Viewport.ctx);
        //if(Viewport.changelog) Viewport.changelog.render(Viewport.ctx);
        //if(Viewport.classes) Viewport.classes.render(Viewport.ctx);
        //if(Viewport.classTree) Viewport.classTree.render(Viewport.ctx);
        //if(Viewport.console) Viewport.console.render(Viewport.ctx);
        //if(Viewport.fadeout) Viewport.fadeout.render(Viewport.ctx);
        //if(Viewport.gameModes) Viewport.gameModes.render(Viewport.ctx);
        if (Viewport.infoHeader) Viewport.infoHeader.render(Viewport.ctx);
        if (Viewport.invite) Viewport.invite.render(Viewport.ctx);
        if (Viewport.minimap) Viewport.minimap.render(Viewport.ctx);
        //if(Viewport.notifications) Viewport.notifications.render(Viewport.ctx);
        //if(Viewport.playerStats) Viewport.playerStats.render(Viewport.ctx);
        if (Viewport.playerStatus) Viewport.playerStatus.render(Viewport.ctx);
        //if(Viewport.scoreboard) Viewport.scoreboard.render(Viewport.ctx);
        //if(Viewport.spawnMenu) Viewport.spawnMenu.render(Viewport.ctx);
    }

    public static endFrame() {
        Input.endFrame();
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