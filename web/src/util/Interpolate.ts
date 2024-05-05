import { clamp } from "./Clamp";

declare global {
    interface Number {
        lerp(limit: number, rate: number): number;
        angleLerp(angle: number, rate: number): number;
    }
}

Number.prototype.lerp = function(limit: number, rate: number) {
    return (this as number) * (1 - rate) + limit * rate;
};

Number.prototype.angleLerp = function(angle: number, rate: number) {
    const max = Math.PI * 2;
    const delta = (angle - (this as number)) % max;
    return (2 * delta % max - delta) * rate + (this as number);
};