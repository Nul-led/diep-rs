

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
    addComponent(component: Component): void;
    removeComponent(component: Component): void;

    setAppInfo(header: string, body: string): void;
    // attributes
    setChangelog(text: string): void;
    // classes
    // class tree
    // console
    // fadeout
    // game modes
    setInfoHeader(text: string): void;
    




    setGameModes(gameModes: GameMode[]): void;

}


export default {
    
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