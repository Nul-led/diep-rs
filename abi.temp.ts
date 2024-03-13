
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

    frame(frame: number): void;
}

const KEYEVENT_MAPPING: Map<string, KeyEvent> = new Map([[
        "Space", KeyEvent.Shoot
    ], [
        "ShiftLeft", KeyEvent.Repel
    ], [
        "KeyW", KeyEvent.Up
    ], [
        "KeyA", KeyEvent.Left
    ], [
        "KeyS", KeyEvent.Down
    ], [
        "KeyD", KeyEvent.Right
    ], [
        "BracketLeft", KeyEvent.GodMode
    ], [
        "KeyO", KeyEvent.Suicide
    ], [
        "KeyU", KeyEvent.PreAllocateStat
    ], [
        "KeyM", KeyEvent.MaxAllocateStat
    ], [
        "KeyH", KeyEvent.Possess
    ], [
        "Enter", KeyEvent.Confirm
    ], [
        "KeyY", KeyEvent.ClassTree
    ], [
        "KeyE", KeyEvent.AutoFire
    ], [
        "KeyC", KeyEvent.AutoSpin
    ], [
        "KeyL", KeyEvent.ServerInfo
    ], [
        "KeyK", KeyEvent.LevelUp
    ], [
        "Digit1", KeyEvent.Attribute0
    ], [
        "Digit2", KeyEvent.Attribute1
    ], [
        "Digit3", KeyEvent.Attribute2
    ], [
        "Digit4", KeyEvent.Attribute3
    ], [
        "Digit5", KeyEvent.Attribute4
    ], [
        "Digit6", KeyEvent.Attribute5
    ], [
        "Digit7", KeyEvent.Attribute6
    ], [
        "Digit8", KeyEvent.Attribute7
    ], [
        "Digit9", KeyEvent.Attribute8
    ], [
        "Digit0", KeyEvent.Attribute9
    ]]); 

enum KeyEvent {
    Shoot,
    Repel,
    Up,
    Left,
    Down,
    Right,
    GodMode,
    Suicide,
    PreAllocateStat,
    MaxAllocateStat,
    Possess,
    Confirm,
    ClassTree,
    AutoFire,
    AutoSpin,
    ServerInfo,
    LevelUp,
    Attribute0,
    Attribute1,
    Attribute2,
    Attribute3,
    Attribute4,
    Attribute5,
    Attribute6,
    Attribute7,
    Attribute8,
    Attribute9,
}

interface Input {
    getMouseX(): number;
    getMouseY(): number;
    getMouseLeftDown(): boolean;
    getMouseRightDown(): boolean;
    getMouseWheelDown(): boolean;
    getMouseWheelDelta(): number;

    overrideCursor(cursor: string): void;
    overrideInputBlocker(isBlocked: boolean): void;

    getKeyDown(key: KeyEvent): boolean;
    getKeyUp(key: KeyEvent): boolean;
    getKeyPress(key: KeyEvent): boolean;
    
    frame(frame: number): void;
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
