import { clamp } from "./Clamp";

export enum AnimationType {
    EaseInSine = "easeInSine",
    EaseOutSine = "easeOutSine",
    EaseInOutSine = "easeInOutSine",
    EaseInQuad = "easeInQuad",
    EaseOutQuad = "easeOutQuad",
    EaseInOutQuad = "easeInOutQuad",
    EaseInCubic = "easeInCubic",
    EaseOutCubic = "easeOutCubic",
    EaseInOutCubic = "easeInOutCubic",
    EaseInQuart = "easeInQuart",
    EaseOutQuart = "easeOutQuart",
    EaseInOutQuart = "easeInOutQuart",
    EaseInQuint = "easeInQuint",
    EaseOutQuint = "easeOutQuint",
    EaseInOutQuint = "easeInOutQuint",
    EaseInExpo = "easeInExpo",
    EaseOutExpo = "easeOutExpo",
    EaseInOutExpo = "easeInOutExpo",
    EaseInCirc = "easeInCirc",
    EaseOutCirc = "easeOutCirc",
    EaseInOutCirc = "easeInOutCirc",
    EaseInBack = "easeInBack",
    EaseOutBack = "easeOutBack",
    EaseInOutBack = "easeInOutBack",
    EaseInElastic = "easeInElastic",
    EaseOutElastic = "easeOutElastic",
    EaseInOutElastic = "easeInOutElastic",
    EaseOutBounce = "easeOutBounce",
    EaseInBounce = "easeInBounce",
    EaseInOutBounce = "easeInOutBounce",
}

export default class Animation {
    constructor(
        public animationType: AnimationType = AnimationType.EaseInOutSine,
        public timeStep: number = 0.05,
        public timer: number = 0,
        public latest: number = 0,
        public isClamped: boolean = true,
    ) { }

    stepForward(): boolean {
        if (this.isClamped) {
            if (this.timer === 1) return false;
            this.timer = clamp(this.timer + this.timeStep, 0, 1);
        }
        else this.timer += this.timeStep;
        this.latest = this.timer[this.animationType]();
        return true;
    }

    stepBackward(): boolean {
        if (this.isClamped) {
            if (this.timer === 0) return false;
            this.timer = clamp(this.timer - this.timeStep, 0, 1);
        }
        else this.timer -= this.timeStep;
        this.latest = this.timer[this.animationType]();
        return true;
    }

    step(isForward: boolean): boolean {
        return isForward ? this.stepForward() : this.stepBackward();
    }
}

declare global {
    interface Number {
        blendWith(wanted: number): number;
        smoothStep(): number;
        exponentialSmoothing(wanted: number, rate: number): number;
        biExponentialSmoothing(wanted: number, primaryRate: number, secondaryRate: number): number;
        easeInSine(): number;
        easeOutSine(): number;
        easeInOutSine(): number;
        easeInQuad(): number;
        easeOutQuad(): number;
        easeInOutQuad(): number;
        easeInCubic(): number;
        easeOutCubic(): number;
        easeInOutCubic(): number;
        easeInQuart(): number;
        easeOutQuart(): number;
        easeInOutQuart(): number;
        easeInQuint(): number;
        easeOutQuint(): number;
        easeInOutQuint(): number;
        easeInExpo(): number;
        easeOutExpo(): number;
        easeInOutExpo(): number;
        easeInCirc(): number;
        easeOutCirc(): number;
        easeInOutCirc(): number;
        easeInBack(magnitude?: number): number;
        easeOutBack(magnitude?: number): number;
        easeInOutBack(magnitude?: number): number;
        easeInElastic(magnitude?: number): number;
        easeOutElastic(magnitude?: number): number;
        easeInOutElastic(magnitude?: number): number;
        easeOutBounce(): number;
        easeInBounce(): number;
        easeInOutBounce(): number;
    }
}

Number.prototype.blendWith = function (wanted: number) {
    return ((this as number) * 9 + wanted) / 10;
};

Number.prototype.smoothStep = function () {
    return ((this as number) ** 2) * (3 - 2 * (this as number));
};

Number.prototype.exponentialSmoothing = function (wanted: number, rate: number) {
    return (this as number) * (1 - clamp(rate, 0, 1)) + wanted * clamp(rate, 0, 1);
};

Number.prototype.biExponentialSmoothing = function (wanted: number, primaryRate: number, secondaryRate: number) {
    if ((this as number) < wanted) return this.exponentialSmoothing(wanted, primaryRate);
    else return this.exponentialSmoothing(wanted, secondaryRate);
};

Number.prototype.easeInSine = function () {
    return -1 * Math.cos((this as number) * (Math.PI / 2)) + 1;
};

Number.prototype.easeOutSine = function () {
    return Math.sin((this as number) * (Math.PI / 2));
};

Number.prototype.easeInOutSine = function () {
    return -0.5 * (Math.cos(Math.PI * (this as number)) - 1);
};

Number.prototype.easeInQuad = function () {
    return (this as number) * (this as number);
};

Number.prototype.easeOutQuad = function () {
    return (this as number) * (2 - (this as number));
};

Number.prototype.easeInOutQuad = function () {
    return (this as number) < 0.5 ? 2 * (this as number) * (this as number) : - 1 + (4 - 2 * (this as number)) * (this as number);
};

Number.prototype.easeInCubic = function () {
    return (this as number) * (this as number) * (this as number);
};

Number.prototype.easeOutCubic = function () {
    const t1 = (this as number) - 1;
    return t1 * t1 * t1 + 1;
};

Number.prototype.easeInOutCubic = function () {
    return (this as number) < 0.5 ? 4 * (this as number) * (this as number) * (this as number) : ((this as number) - 1) * (2 * (this as number) - 2) * (2 * (this as number) - 2) + 1;
};

Number.prototype.easeInQuart = function () {
    return (this as number) * (this as number) * (this as number) * (this as number);
};

Number.prototype.easeOutQuart = function () {
    const t1 = (this as number) - 1;
    return 1 - t1 * t1 * t1 * t1;
};

Number.prototype.easeInOutQuart = function () {
    const t1 = (this as number) - 1;
    return (this as number) < 0.5 ? 8 * (this as number) * (this as number) * (this as number) * (this as number) : 1 - 8 * t1 * t1 * t1 * t1;
};

Number.prototype.easeInQuint = function () {
    return (this as number) * (this as number) * (this as number) * (this as number) * (this as number);
};

Number.prototype.easeOutQuint = function () {
    const t1 = (this as number) - 1;
    return 1 + t1 * t1 * t1 * t1 * t1;
};

Number.prototype.easeInOutQuint = function () {
    const t1 = (this as number) - 1;
    return (this as number) < 0.5 ? 16 * (this as number) * (this as number) * (this as number) * (this as number) * (this as number) : 1 + 16 * t1 * t1 * t1 * t1 * t1;
};

Number.prototype.easeInExpo = function () {
    if ((this as number) === 0) {
        return 0;
    }
    return Math.pow(2, 10 * ((this as number) - 1));
};

Number.prototype.easeOutExpo = function () {
    if ((this as number) === 1) {
        return 1;
    }
    return (-Math.pow(2, -10 * (this as number)) + 1);
};

Number.prototype.easeInOutExpo = function () {
    if ((this as number) === 0 || (this as number) === 1) {
        return (this as number);
    }
    const scaledTime = (this as number) * 2;
    const scaledTime1 = scaledTime - 1;
    if (scaledTime < 1) {
        return 0.5 * Math.pow(2, 10 * (scaledTime1));
    }
    return 0.5 * (-Math.pow(2, -10 * scaledTime1) + 2);
};

Number.prototype.easeInCirc = function () {
    const scaledTime = (this as number) / 1;
    return -1 * (Math.sqrt(1 - scaledTime * (this as number)) - 1);
};

Number.prototype.easeOutCirc = function () {
    const t1 = (this as number) - 1;
    return Math.sqrt(1 - t1 * t1);
};

Number.prototype.easeInOutCirc = function () {
    const scaledTime = (this as number) * 2;
    const scaledTime1 = scaledTime - 2;
    if (scaledTime < 1) {
        return -0.5 * (Math.sqrt(1 - scaledTime * scaledTime) - 1);
    }
    return 0.5 * (Math.sqrt(1 - scaledTime1 * scaledTime1) + 1);
};

Number.prototype.easeInBack = function (magnitude: number = 1.70158) {
    return (this as number) * (this as number) * ((magnitude + 1) * (this as number) - magnitude);
};

Number.prototype.easeOutBack = function (magnitude: number = 1.70158) {
    const scaledTime = ((this as number) / 1) - 1;
    return (scaledTime * scaledTime * ((magnitude + 1) * scaledTime + magnitude)) + 1;
};

Number.prototype.easeInOutBack = function (magnitude: number = 1.70158) {
    const scaledTime = (this as number) * 2;
    const scaledTime2 = scaledTime - 2;
    const s = magnitude * 1.525;
    if (scaledTime < 1) {
        return 0.5 * scaledTime * scaledTime * (((s + 1) * scaledTime) - s);
    }
    return 0.5 * (scaledTime2 * scaledTime2 * ((s + 1) * scaledTime2 + s) + 2);
};

Number.prototype.easeInElastic = function (magnitude: number = 0.7) {
    if ((this as number) === 0 || (this as number) === 1) {
        return (this as number);
    }
    const scaledTime = (this as number) / 1;
    const scaledTime1 = scaledTime - 1;
    const p = 1 - magnitude;
    const s = p / (2 * Math.PI) * Math.asin(1);
    return -(Math.pow(2, 10 * scaledTime1) * Math.sin((scaledTime1 - s) * (2 * Math.PI) / p));
};

Number.prototype.easeOutElastic = function (magnitude: number = 0.7) {
    if ((this as number) === 0 || (this as number) === 1) {
        return (this as number);
    }
    const p = 1 - magnitude;
    const scaledTime = (this as number) * 2;
    const s = p / (2 * Math.PI) * Math.asin(1);
    return (Math.pow(2, -10 * scaledTime) * Math.sin((scaledTime - s) * (2 * Math.PI) / p)) + 1;
};

Number.prototype.easeInOutElastic = function (magnitude: number = 0.65) {
    if ((this as number) === 0 || (this as number) === 1) {
        return (this as number);
    }
    const p = 1 - magnitude;
    const scaledTime = (this as number) * 2;
    const scaledTime1 = scaledTime - 1;
    const s = p / (2 * Math.PI) * Math.asin(1);
    if (scaledTime < 1) {
        return -0.5 * (Math.pow(2, 10 * scaledTime1) * Math.sin((scaledTime1 - s) * (2 * Math.PI) / p));
    }
    return (Math.pow(2, -10 * scaledTime1) * Math.sin((scaledTime1 - s) * (2 * Math.PI) / p) * 0.5) + 1;
};

Number.prototype.easeOutBounce = function () {
    const scaledTime = (this as number) / 1;
    if (scaledTime < (1 / 2.75)) {
        return 7.5625 * scaledTime * scaledTime;
    } else if (scaledTime < (2 / 2.75)) {
        const scaledTime2 = scaledTime - (1.5 / 2.75);
        return (7.5625 * scaledTime2 * scaledTime2) + 0.75;
    } else if (scaledTime < (2.5 / 2.75)) {
        const scaledTime2 = scaledTime - (2.25 / 2.75);
        return (7.5625 * scaledTime2 * scaledTime2) + 0.9375;
    } else {
        const scaledTime2 = scaledTime - (2.625 / 2.75);
        return (7.5625 * scaledTime2 * scaledTime2) + 0.984375;
    }
};

Number.prototype.easeInBounce = function () {
    return 1 - (1 - (this as number)).easeOutBounce();
};

Number.prototype.easeInOutBounce = function () {
    if ((this as number) < 0.5) {
        return ((this as number) * 2).easeInBounce() * 0.5;
    }
    return ((((this as number) * 2) - 1).easeOutBounce() * 0.5) + 0.5;
};