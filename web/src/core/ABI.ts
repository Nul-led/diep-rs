import AppInfo from "../components/AppInfo";
import Changelog from "../components/Changelog";
import InfoHeader from "../components/InfoHeader";
import Invite from "../components/Invite";
import Minimap from "../components/Minimap";
import PlayerStatus from "../components/PlayerStatus";
import Input from "./Input";
import Viewport from "./Viewport";

export enum Component {
    AppInfo,
    Attributes,
    Changelog,
    Classes,
    ClassTree,
    Console,
    Fadeout,
    InfoHeader,
    Invite,
    Minimap,
    Notifications,
    PlayerStats,
    PlayerStatus,
    Scoreboard,
    SpawnMenu,
}

declare global {
    interface Window {
        enableComponents(components: Component[]): void;
        disableComponents(components: Component[]): void;

        setAppInfoHeader(text: string): void;
        setAppInfoBody(text: string): void;
        // attributes
        setChangelog(text: string): void;
        // classes
        // class tree
        // console
        // fadeout
        setInfoHeader(text: string): void;
        setInvite(link: string): void;
        // notifications
        // player stats
        setPlayerStatusLevelbarText(text: string): void;
        setPlayerStatusScorebarText(text: string): void;
        setPlayerStatusPlayerName(name: string): void;
        setPlayerStatusRenderScorebar(renderScorebar: boolean): void;
        // scoreboard
        // spawnmenu
        Viewport: Viewport,
        Input: Input,
    }
}

window.enableComponents = (components) => {
    for (const component of components) {
        switch (component) {
            case Component.AppInfo:
                Viewport.appInfo ||= new AppInfo;
                break;
            case Component.Attributes:
                break;
            case Component.Changelog:
                Viewport.changelog ||= new Changelog;
                break;
            case Component.ClassTree:
                break;
            case Component.Changelog:
                Viewport.changelog ||= new Changelog;
                break;
            case Component.Classes:
                break;
            case Component.Console:
                break;
            case Component.Fadeout:
                break;
            case Component.InfoHeader:
                Viewport.infoHeader ||= new InfoHeader;
                break;
            case Component.Invite:
                Viewport.invite ||= new Invite;
                break;
            case Component.Minimap:
                Viewport.minimap ||= new Minimap;
                break;
            case Component.Notifications:
                break;
            case Component.PlayerStats:
                break;
            case Component.PlayerStatus:
                Viewport.playerStatus ||= new PlayerStatus;
                break;
            case Component.Scoreboard:
                break;
            case Component.SpawnMenu:
                break;
        }
    }
};

window.disableComponents = (components) => {
    for (const component of components) {
        switch (component) {
            case Component.AppInfo:
                Viewport.appInfo = null;
                break;
            case Component.Attributes:
                Viewport.attributes = null;
                break;
            case Component.Changelog:
                Viewport.changelog = null;
                break;
            case Component.ClassTree:
                Viewport.classTree = null;
                break;
            case Component.Changelog:
                Viewport.changelog = null;
                break;
            case Component.Classes:
                Viewport.classes = null;
                break;
            case Component.Console:
                Viewport.console = null;
                break;
            case Component.Fadeout:
                Viewport.fadeout = null;
                break;
            case Component.InfoHeader:
                Viewport.infoHeader = null;
                break;
            case Component.Invite:
                Viewport.invite = null;
                break;
            case Component.Minimap:
                Viewport.minimap = null;
                break;
            case Component.Notifications:
                Viewport.notifications = null;
                break;
            case Component.PlayerStats:
                Viewport.playerStats = null;
                break;
            case Component.PlayerStatus:
                Viewport.playerStatus = null;
                break;
            case Component.Scoreboard:
                Viewport.scoreboard = null;
                break;
            case Component.SpawnMenu:
                Viewport.spawnMenu = null;
                break;
        }
    }
};

window.setAppInfoBody = (text) => {
    if (Viewport.appInfo) Viewport.appInfo.lines.text = text;
};

window.setAppInfoHeader = (text) => {
    if (Viewport.appInfo) Viewport.appInfo.header.text = text;
};

window.setChangelog = (text) => {
    if (Viewport.changelog) Viewport.changelog.lines.text = text;
};

window.setInfoHeader = (text) => {
    if (Viewport.infoHeader) Viewport.infoHeader.header.text = text;
};

window.setInvite = (link) => {
    if (Viewport.invite) Viewport.invite.inviteLink = link;
};

window.setPlayerStatusLevelbarText = (text) => {
    if (Viewport.playerStatus) Viewport.playerStatus.levelbar.textWidget.text = text;
};

window.setPlayerStatusPlayerName = (name) => {
    if (Viewport.playerStatus) Viewport.playerStatus.playerNameText.text = name;
};

window.setPlayerStatusRenderScorebar = (renderScorebar) => {
    if (Viewport.playerStatus) Viewport.playerStatus.renderScorebar = renderScorebar;
};

window.setPlayerStatusScorebarText = (text) => {
    if (Viewport.playerStatus) Viewport.playerStatus.scorebar.textWidget.text = text;
};

window.Input = Input;
window.Viewport = Viewport;


/*
interface GUI {
    setMinimap(minimap: CanvasImageSource): void;
    setConsole(commands: Command[]): void;
    setNotifications(notification[]): void;
    setFadeout(alphaState: number, image: ({ url: string, enabled: boolean })): void;
    setScoreboard(entries: ScoreboardEntry[]): void;
    setStatus(level: number, levelbarState: number, score: number, scorebarState: number, className: string, playerName: string): void;
    setStats(classImage: CanvasImageSource, killedBy: string, level: number, score: number, timeAlive: number): void;
    setAttributes(attributes: Attribute[], unallocated: number): void;
    setClasses(classes: ({ className: string, classImage: CanvasImageSource })[]): void;
    // these have no ui impl yet
    //setClassTree(): void;
    //setSpawnMenu(): void;

    getSelectedCommand(): string?;
    getSelectedGameMode(): string?;
    getSelectedAttributes(): number[];
    getSelectedPreAllocatedAttributes(): number[];

    getViewportScale(): number;

    frame(frame: number): void;
}*/