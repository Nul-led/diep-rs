import { Cursor } from "../util/Cursor";

interface Mouse {
    x: number;
    y: number;
    leftDown: boolean;
    rightDown: boolean;
    wheelDown: boolean;
    clicked: boolean;
    wheelDelta: number;
    cursor: Cursor;
}

export enum KeyEvent {
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
    TankWheel,
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

export default class Input {
    public static mouse: Mouse = {
        x: 0,
        y: 0,
        leftDown: false,
        rightDown: false,
        wheelDown: false,
        clicked: false,
        wheelDelta: 0,
        cursor: "default",
    };

    public static mapping: Record<string, KeyEvent> = {
        "Space": KeyEvent.Shoot,
        "ShiftLeft": KeyEvent.Repel,
        "KeyW": KeyEvent.Up,
        "KeyA": KeyEvent.Left,
        "KeyS": KeyEvent.Down,
        "KeyD": KeyEvent.Right,
        "BracketLeft": KeyEvent.GodMode,
        "KeyO": KeyEvent.Suicide,
        "KeyU": KeyEvent.PreAllocateStat,
        "KeyM": KeyEvent.MaxAllocateStat,
        "KeyH": KeyEvent.Possess,
        "Enter": KeyEvent.Confirm,
        "KeyY": KeyEvent.TankWheel,
        "KeyE": KeyEvent.AutoFire,
        "KeyC": KeyEvent.AutoSpin,
        "KeyL": KeyEvent.ServerInfo,
        "KeyK": KeyEvent.LevelUp,
        "Digit1": KeyEvent.Attribute0,
        "Digit2": KeyEvent.Attribute1,
        "Digit3": KeyEvent.Attribute2,
        "Digit4": KeyEvent.Attribute3,
        "Digit5": KeyEvent.Attribute4,
        "Digit6": KeyEvent.Attribute5,
        "Digit7": KeyEvent.Attribute6,
        "Digit8": KeyEvent.Attribute7,
        "Digit9": KeyEvent.Attribute8,
        "Digit0": KeyEvent.Attribute9,
    };

    public static keyDown: Set<KeyEvent> = new Set();
    public static keyUp: Set<KeyEvent> = new Set();
    public static keyPress: Set<KeyEvent> = new Set();
}

