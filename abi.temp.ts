
interface GUI {
    setInfoHeader(text: string): void;
    setAppInfo(header: string, body: string): void;
    setChangelog(text: string): void;
    setGameModes(gameModes: GameMode[]): void;
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
}

enum ComponentId {
    InfoHeader, // connecting, waiting for players, countdown
    AppInfo, // diep.io label + latency + tps + fps

    Changelog,
    GameModes,
    Invite, // Copy Party Link Button

    SpawnMenu,
    Console,
    Notifications,
    Fadeout,

    Minimap,
    Scoreboard,
    PlayerStatus,
    PlayerStats, // death stats
    ClassTree,

    Attributes,
    Classes,
}
