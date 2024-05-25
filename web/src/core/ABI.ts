import AppInfo from "../components/AppInfo";
import Changelog from "../components/Changelog";
import InfoHeader from "../components/InfoHeader";
import Invite from "../components/Invite";
import Minimap from "../components/Minimap";
import PlayerStatus from "../components/PlayerStatus";
import Viewport from "./Viewport";


export enum Component {
    AppInfo,
    Attributes,
    Changelog,
    Classes,
    ClassTree,
    Console,
    Fadeout,
    GameModes,
    InfoHeader,
    Invite,
    Minimap,
    Notifications,
    PlayerStats,
    PlayerStatus,
    Scoreboard,
    SpawnMenu,
}

export interface ABI {
    enableComponents(component: Component[]): void;
    disableComponents(component: Component[]): void;

    setAppInfoHeader(text: string): void;
    setAppInfoBody(text: string): void;
    // attributes
    setChangelog(text: string): void;
    // classes
    // class tree
    // console
    // fadeout
    // game modes
    setInfoHeader(text: string): void;
    setInvite(link: string): void;
    getMinimap(): OffscreenCanvasRenderingContext2D;
    // notifications
    // player stats
    setPlayerStatusLevelbarText(text: string): void;
    setPlayerStatusScorebarText(text: string): void;
    setPlayerStatusPlayerName(name: string): void;
    setPlayerStatusRenderScorebar(renderScorebar: boolean): void;
    // scoreboard
    // spawnmenu

    getViewport(): Viewport;


    public static maxWidth: number = 1920;
    public static maxHeight: number = 1080;
    public static width: number = 1;
    public static height: number = 1;
    public static guiScale: number = 1;
    public static guiZoomFactor: number = 1;
    public static guiZoomChanged: boolean = true;
}


export default {
    enableComponents(components) {
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
                case Component.GameModes:
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
    },
} as ABI;



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
}