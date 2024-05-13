import { Cursor } from "../util/Cursor";
import Renderable from "./Renderable";
import { Interactable } from "./Interactable";
import Input from "./Input";
import Viewport from "./Viewport";

export default abstract class Widget extends Renderable {
    public render(ctx: Renderable, x: number, y: number) {
        ctx.canvas.drawImage(this.renderable, Math.floor(x), Math.floor(y));
    }

    public renderCentered(ctx: Renderable, x: number, y: number) {
        ctx.canvas.drawImage(this.renderable, Math.floor(x - this.canvasWidth / 2), Math.floor(y - this.canvasHeight / 2));
    }

    public renderVerticallyCentered(ctx: Renderable, x: number, y: number) {
        ctx.canvas.drawImage(this.renderable, Math.floor(x), Math.floor(y - this.canvasHeight / 2));
    }

    public renderHorizontallyCentered(ctx: Renderable, x: number, y: number) {
        ctx.canvas.drawImage(this.renderable, Math.floor(x - this.canvasWidth / 2), Math.floor(y));
    }
}

export abstract class InteractableWidget extends Widget implements Interactable {
    public isUnHoverable: boolean = false;
    public isUnPressable: boolean = false;

    public onHoverCursor: Cursor | null = "pointer";
    public onPressCursor: Cursor | null = null;

    public isHovered: boolean = false;
    public isPressed: boolean = false;
    public isClicked: boolean = false;

    public abstract onHover(): void;
    public abstract onPress(): void;
    public abstract onClick(): void;

    protected abstract getInteractablePath(): Path2D;

    public interact(): boolean {
        const isHovered = !this.isUnHoverable && Viewport.ctx.canvas.isPointInPath(this.getInteractablePath(), Input.mouse.x, Input.mouse.y);
        const isClicked = !this.isUnPressable && isHovered && this.isPressed && Input.mouse.clicked;
        const isPressed = !this.isUnPressable && isHovered && Input.mouse.leftDown;

        const hasInteracted = this.isHovered !== isHovered || this.isClicked !== isClicked || this.isPressed !== isPressed;

        this.isHovered = isHovered;
        this.isClicked = isClicked;
        this.isPressed = isPressed;

        if (this.isHovered) {
            if (this.onHoverCursor) Input.mouse.cursor = this.onHoverCursor;
            this.onHover();
        }

        if (this.isPressed) {
            if (this.onPressCursor) Input.mouse.cursor = this.onPressCursor;
            this.onPress();
        }

        if (this.isClicked) {
            this.onClick();
        }

        return hasInteracted;
    }
}