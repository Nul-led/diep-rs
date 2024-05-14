import AABB from "../util/AABB";
import { Cursor } from "../util/Cursor";

export interface Interactable {
    isHovered: boolean;
    isPressed: boolean;
    isClicked: boolean;

    isUnHoverable: boolean;
    isUnPressable: boolean;

    onHoverCursor: Cursor | null;
    onPressCursor: Cursor | null;

    onHover(): void;
    onPress(): void;
    onClick(): void;

    interact(path: Path2D): void;
}