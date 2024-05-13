import { Cursor } from "../util/Cursor";
import Viewport from "./Viewport";

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

    public static init() {
        window.addEventListener("mousemove", e => {
            this.mouse.x = e.clientX * window.devicePixelRatio;
            this.mouse.y = e.clientY * window.devicePixelRatio;
        });

        window.addEventListener("mousedown", e => {
            this.mouse.leftDown = Boolean(e.buttons & 1 << 0);
            this.mouse.rightDown = Boolean(e.buttons & 1 << 1);
            this.mouse.wheelDown = Boolean(e.buttons & 1 << 2);
        });

        window.addEventListener("mouseup", e => {
            this.mouse.leftDown = Boolean(e.buttons & 1 << 0);
            this.mouse.rightDown = Boolean(e.buttons & 1 << 1);
            this.mouse.wheelDown = Boolean(e.buttons & 1 << 2);
        });

        window.addEventListener("click", () => {
            this.mouse.clicked = true;
        });

        window.addEventListener("wheel", e => {
            this.mouse.wheelDelta = e.deltaY;
        });

        window.addEventListener("keydown", e => {
            const event = this.mapping[e.code];
            if (event === undefined) return;
            this.keyDown.add(event);
        });

        window.addEventListener("keyup", e => {
            const event = this.mapping[e.code];
            if (event === undefined) return;
            this.keyUp.add(event);
        });

        window.addEventListener("keypress", e => {
            const event = this.mapping[e.code];
            if (event === undefined) return;
            this.keyPress.add(event);
        });

        const canvas = Viewport.ctx.canvas.canvas;
        canvas.ondragstart = canvas.oncontextmenu = e => e.preventDefault();
    }

    public static startFrame() {
        this.mouse.cursor = "default";
    }

    public static endFrame() {
        this.keyPress.clear();
        for (const key of Array.from(this.keyUp)) this.keyDown.delete(key);
        this.keyUp.clear();
        this.mouse.clicked = false;
        Viewport.ctx.canvas.canvas.style.cursor = this.mouse.cursor;
    }
}

