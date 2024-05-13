"use strict";
(() => {
  // src/util/Clamp.ts
  var clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  // src/util/Animation.ts
  var Animation = class {
    constructor(animationType = "easeInOutSine" /* EaseInOutSine */, timeStep = 0.05, timer = 0, latest = 0, isClamped = true) {
      this.animationType = animationType;
      this.timeStep = timeStep;
      this.timer = timer;
      this.latest = latest;
      this.isClamped = isClamped;
    }
    stepForward() {
      if (this.isClamped) {
        if (this.timer === 1)
          return false;
        this.timer = clamp(this.timer + this.timeStep, 0, 1);
      } else
        this.timer += this.timeStep;
      this.latest = this.timer[this.animationType]();
      return true;
    }
    stepBackward() {
      if (this.isClamped) {
        if (this.timer === 0)
          return false;
        this.timer = clamp(this.timer - this.timeStep, 0, 1);
      } else
        this.timer -= this.timeStep;
      this.latest = this.timer[this.animationType]();
      return true;
    }
    step(isForward) {
      if (this.isClamped) {
        if (isForward && this.timer === 1 || !isForward && this.timer === 0)
          return false;
        this.timer = clamp(this.timer + (isForward ? this.timeStep : -this.timeStep), 0, 1);
      } else
        this.timer += isForward ? this.timeStep : -this.timeStep;
      this.latest = this.timer[this.animationType]();
      return true;
    }
  };
  Number.prototype.blendWith = function(wanted) {
    return (this * 9 + wanted) / 10;
  };
  Number.prototype.smoothStep = function() {
    return this ** 2 * (3 - 2 * this);
  };
  Number.prototype.exponentialSmoothing = function(wanted, rate) {
    return this * (1 - clamp(rate, 0, 1)) + wanted * clamp(rate, 0, 1);
  };
  Number.prototype.biExponentialSmoothing = function(wanted, primaryRate, secondaryRate) {
    if (this < wanted)
      return this.exponentialSmoothing(wanted, primaryRate);
    else
      return this.exponentialSmoothing(wanted, secondaryRate);
  };
  Number.prototype.easeInSine = function() {
    return -1 * Math.cos(this * (Math.PI / 2)) + 1;
  };
  Number.prototype.easeOutSine = function() {
    return Math.sin(this * (Math.PI / 2));
  };
  Number.prototype.easeInOutSine = function() {
    return -0.5 * (Math.cos(Math.PI * this) - 1);
  };
  Number.prototype.easeInQuad = function() {
    return this * this;
  };
  Number.prototype.easeOutQuad = function() {
    return this * (2 - this);
  };
  Number.prototype.easeInOutQuad = function() {
    return this < 0.5 ? 2 * this * this : -1 + (4 - 2 * this) * this;
  };
  Number.prototype.easeInCubic = function() {
    return this * this * this;
  };
  Number.prototype.easeOutCubic = function() {
    const t1 = this - 1;
    return t1 * t1 * t1 + 1;
  };
  Number.prototype.easeInOutCubic = function() {
    return this < 0.5 ? 4 * this * this * this : (this - 1) * (2 * this - 2) * (2 * this - 2) + 1;
  };
  Number.prototype.easeInQuart = function() {
    return this * this * this * this;
  };
  Number.prototype.easeOutQuart = function() {
    const t1 = this - 1;
    return 1 - t1 * t1 * t1 * t1;
  };
  Number.prototype.easeInOutQuart = function() {
    const t1 = this - 1;
    return this < 0.5 ? 8 * this * this * this * this : 1 - 8 * t1 * t1 * t1 * t1;
  };
  Number.prototype.easeInQuint = function() {
    return this * this * this * this * this;
  };
  Number.prototype.easeOutQuint = function() {
    const t1 = this - 1;
    return 1 + t1 * t1 * t1 * t1 * t1;
  };
  Number.prototype.easeInOutQuint = function() {
    const t1 = this - 1;
    return this < 0.5 ? 16 * this * this * this * this * this : 1 + 16 * t1 * t1 * t1 * t1 * t1;
  };
  Number.prototype.easeInExpo = function() {
    if (this === 0) {
      return 0;
    }
    return Math.pow(2, 10 * (this - 1));
  };
  Number.prototype.easeOutExpo = function() {
    if (this === 1) {
      return 1;
    }
    return -Math.pow(2, -10 * this) + 1;
  };
  Number.prototype.easeInOutExpo = function() {
    if (this === 0 || this === 1) {
      return this;
    }
    const scaledTime = this * 2;
    const scaledTime1 = scaledTime - 1;
    if (scaledTime < 1) {
      return 0.5 * Math.pow(2, 10 * scaledTime1);
    }
    return 0.5 * (-Math.pow(2, -10 * scaledTime1) + 2);
  };
  Number.prototype.easeInCirc = function() {
    const scaledTime = this / 1;
    return -1 * (Math.sqrt(1 - scaledTime * this) - 1);
  };
  Number.prototype.easeOutCirc = function() {
    const t1 = this - 1;
    return Math.sqrt(1 - t1 * t1);
  };
  Number.prototype.easeInOutCirc = function() {
    const scaledTime = this * 2;
    const scaledTime1 = scaledTime - 2;
    if (scaledTime < 1) {
      return -0.5 * (Math.sqrt(1 - scaledTime * scaledTime) - 1);
    }
    return 0.5 * (Math.sqrt(1 - scaledTime1 * scaledTime1) + 1);
  };
  Number.prototype.easeInBack = function(magnitude = 1.70158) {
    return this * this * ((magnitude + 1) * this - magnitude);
  };
  Number.prototype.easeOutBack = function(magnitude = 1.70158) {
    const scaledTime = this / 1 - 1;
    return scaledTime * scaledTime * ((magnitude + 1) * scaledTime + magnitude) + 1;
  };
  Number.prototype.easeInOutBack = function(magnitude = 1.70158) {
    const scaledTime = this * 2;
    const scaledTime2 = scaledTime - 2;
    const s = magnitude * 1.525;
    if (scaledTime < 1) {
      return 0.5 * scaledTime * scaledTime * ((s + 1) * scaledTime - s);
    }
    return 0.5 * (scaledTime2 * scaledTime2 * ((s + 1) * scaledTime2 + s) + 2);
  };
  Number.prototype.easeInElastic = function(magnitude = 0.7) {
    if (this === 0 || this === 1) {
      return this;
    }
    const scaledTime = this / 1;
    const scaledTime1 = scaledTime - 1;
    const p = 1 - magnitude;
    const s = p / (2 * Math.PI) * Math.asin(1);
    return -(Math.pow(2, 10 * scaledTime1) * Math.sin((scaledTime1 - s) * (2 * Math.PI) / p));
  };
  Number.prototype.easeOutElastic = function(magnitude = 0.7) {
    if (this === 0 || this === 1) {
      return this;
    }
    const p = 1 - magnitude;
    const scaledTime = this * 2;
    const s = p / (2 * Math.PI) * Math.asin(1);
    return Math.pow(2, -10 * scaledTime) * Math.sin((scaledTime - s) * (2 * Math.PI) / p) + 1;
  };
  Number.prototype.easeInOutElastic = function(magnitude = 0.65) {
    if (this === 0 || this === 1) {
      return this;
    }
    const p = 1 - magnitude;
    const scaledTime = this * 2;
    const scaledTime1 = scaledTime - 1;
    const s = p / (2 * Math.PI) * Math.asin(1);
    if (scaledTime < 1) {
      return -0.5 * (Math.pow(2, 10 * scaledTime1) * Math.sin((scaledTime1 - s) * (2 * Math.PI) / p));
    }
    return Math.pow(2, -10 * scaledTime1) * Math.sin((scaledTime1 - s) * (2 * Math.PI) / p) * 0.5 + 1;
  };
  Number.prototype.easeOutBounce = function() {
    const scaledTime = this / 1;
    if (scaledTime < 1 / 2.75) {
      return 7.5625 * scaledTime * scaledTime;
    } else if (scaledTime < 2 / 2.75) {
      const scaledTime2 = scaledTime - 1.5 / 2.75;
      return 7.5625 * scaledTime2 * scaledTime2 + 0.75;
    } else if (scaledTime < 2.5 / 2.75) {
      const scaledTime2 = scaledTime - 2.25 / 2.75;
      return 7.5625 * scaledTime2 * scaledTime2 + 0.9375;
    } else {
      const scaledTime2 = scaledTime - 2.625 / 2.75;
      return 7.5625 * scaledTime2 * scaledTime2 + 0.984375;
    }
  };
  Number.prototype.easeInBounce = function() {
    return 1 - (1 - this).easeOutBounce();
  };
  Number.prototype.easeInOutBounce = function() {
    if (this < 0.5) {
      return (this * 2).easeInBounce() * 0.5;
    }
    return (this * 2 - 1).easeOutBounce() * 0.5 + 0.5;
  };

  // src/util/Color.ts
  var Color = class _Color {
    constructor(color) {
      this.r = 0;
      this.g = 0;
      this.b = 0;
      this.r = color >>> 16 & 255;
      this.g = color >>> 8 & 255;
      this.b = color >>> 0 & 255;
    }
    static {
      this.BLACK = _Color.fromRGB(0, 0, 0);
    }
    static {
      this.WHITE = _Color.fromRGB(255, 255, 255);
    }
    static fromRGB(r, g, b) {
      return new _Color(r << 16 | g << 8 | b << 0);
    }
    static blendColors(primary, secondary, factor) {
      const c = new _Color(primary.toInt());
      c.blendWith(factor, secondary);
      return c;
    }
    toInt() {
      return this.r << 16 | this.g << 8 | this.b << 0;
    }
    toCSS() {
      return `rgb(${this.r},${this.g},${this.b})`;
    }
    clone() {
      return new _Color(this.toInt());
    }
    blendWith(factor, color) {
      this.r = Math.round(color.r * factor + this.r * (1 - factor));
      this.g = Math.round(color.g * factor + this.g * (1 - factor));
      this.b = Math.round(color.b * factor + this.b * (1 - factor));
    }
    blendTogether(factor, color) {
      const r = Math.round(color.r * factor + this.r * (1 - factor));
      const g = Math.round(color.g * factor + this.g * (1 - factor));
      const b = Math.round(color.b * factor + this.b * (1 - factor));
      return _Color.fromRGB(r, g, b);
    }
  };

  // src/core/Renderable.ts
  var Renderable = class {
    constructor(canvas) {
      const ctx = (canvas || new OffscreenCanvas(1, 1)).getContext("2d");
      if (!ctx)
        throw "Unable to create a new canvas context";
      this.canvas = ctx;
      this.canvas.imageSmoothingEnabled = false;
    }
    get renderable() {
      return this.canvas.canvas;
    }
    get canvasSize() {
      return {
        width: this.canvas.canvas.width,
        height: this.canvas.canvas.height
      };
    }
    set canvasSize(value) {
      this.canvas.canvas.width = Math.max(1, value.width);
      this.canvas.canvas.height = Math.max(1, value.height);
    }
    get canvasWidth() {
      return this.canvas.canvas.width;
    }
    get canvasHeight() {
      return this.canvas.canvas.height;
    }
    set canvasWidth(value) {
      this.canvas.canvas.width = Math.max(1, value);
    }
    set canvasHeight(value) {
      this.canvas.canvas.height = Math.max(1, value);
    }
  };

  // src/core/Widget.ts
  var Widget = class extends Renderable {
    render(ctx, x, y) {
      ctx.canvas.drawImage(this.renderable, Math.floor(x), Math.floor(y));
    }
    renderCentered(ctx, x, y) {
      ctx.canvas.drawImage(this.renderable, Math.floor(x - this.canvasWidth / 2), Math.floor(y - this.canvasHeight / 2));
    }
    renderVerticallyCentered(ctx, x, y) {
      ctx.canvas.drawImage(this.renderable, Math.floor(x), Math.floor(y - this.canvasHeight / 2));
    }
    renderHorizontallyCentered(ctx, x, y) {
      ctx.canvas.drawImage(this.renderable, Math.floor(x - this.canvasWidth / 2), Math.floor(y));
    }
  };
  var InteractableWidget = class extends Widget {
    constructor() {
      super(...arguments);
      this.isUnHoverable = false;
      this.isUnPressable = false;
      this.onHoverCursor = "pointer";
      this.onPressCursor = null;
      this.isHovered = false;
      this.isPressed = false;
      this.isClicked = false;
    }
    interact() {
      const isHovered = !this.isUnHoverable && Viewport.ctx.canvas.isPointInPath(this.getInteractablePath(), Input.mouse.x, Input.mouse.y);
      const isClicked = !this.isUnPressable && isHovered && this.isPressed && Input.mouse.clicked;
      const isPressed = !this.isUnPressable && isHovered && Input.mouse.leftDown;
      const hasInteracted = this.isHovered !== isHovered || this.isClicked !== isClicked || this.isPressed !== isPressed;
      this.isHovered = isHovered;
      this.isClicked = isClicked;
      this.isPressed = isPressed;
      if (this.isHovered) {
        if (this.onHoverCursor)
          Input.mouse.cursor = this.onHoverCursor;
        this.onHover();
      }
      if (this.isPressed) {
        if (this.onPressCursor)
          Input.mouse.cursor = this.onPressCursor;
        this.onPress();
      }
      if (this.isClicked) {
        this.onClick();
      }
      return hasInteracted;
    }
  };

  // src/widgets/Button.ts
  var Button = class extends InteractableWidget {
    constructor(_x = 0, _y = 0, _width = 1, _height = 1, _fillColor = Color.WHITE, _strokeColor = Color.BLACK, _strokeWidth = 10, _mockHover = false, _mockPress = false) {
      super();
      this._x = _x;
      this._y = _y;
      this._width = _width;
      this._height = _height;
      this._fillColor = _fillColor;
      this._strokeColor = _strokeColor;
      this._strokeWidth = _strokeWidth;
      this._mockHover = _mockHover;
      this._mockPress = _mockPress;
      this.redraw = true;
    }
    onHover() {
    }
    onPress() {
    }
    onClick() {
    }
    getInteractablePath() {
      const path = new Path2D();
      path.rect(this._x.screenSpace(), this._y.screenSpace(), this._width.screenSpace(), this._height.screenSpace());
      return path;
    }
    get renderable() {
      if (this.interact())
        this.redraw = true;
      if (!this.redraw && !Viewport.guiZoomChanged)
        return this.canvas.canvas;
      this.redraw = false;
      const strokeWidth = this._strokeWidth.screenSpace();
      const width = this._width.screenSpace();
      const height = this._height.screenSpace();
      this.canvasSize = { width: width + strokeWidth, height: height + strokeWidth };
      this.canvas.save();
      const fillColor = this._fillColor?.clone();
      if (fillColor) {
        if (this.isPressed || this._mockPress)
          fillColor.blendWith(0.2, Color.BLACK);
        else if (this.isHovered || this._mockHover)
          fillColor.blendWith(0.2, Color.WHITE);
      }
      if (strokeWidth && this._strokeColor) {
        this.canvas.lineWidth = strokeWidth;
        this.canvas.lineJoin = "round";
        this.canvas.strokeStyle = this._strokeColor.toCSS();
        this.canvas.strokeRect(strokeWidth / 2, strokeWidth / 2, width, height);
      }
      if (fillColor) {
        this.canvas.fillStyle = fillColor.toCSS();
        this.canvas.fillRect(strokeWidth / 2, strokeWidth / 2, width, height);
      }
      this.canvas.globalAlpha = 0.2;
      this.canvas.fillStyle = Color.BLACK.toCSS();
      if (this.isPressed || this._mockPress) {
        this.canvas.fillRect(strokeWidth / 2, strokeWidth / 2, width, height * 7 / 12);
      } else {
        this.canvas.fillRect(strokeWidth / 2, strokeWidth / 2 + height * 7 / 12, width, height - height * 7 / 12);
      }
      this.canvas.restore();
      return this.canvas.canvas;
    }
    render(ctx, x, y) {
      ctx.canvas.drawImage(this.renderable, Math.floor(x - this._strokeWidth.screenSpace() / 2), Math.floor(y - this._strokeWidth.screenSpace() / 2));
    }
    renderVerticallyCentered(ctx, x, y) {
      ctx.canvas.drawImage(this.renderable, Math.floor(x - this._strokeWidth.screenSpace() / 2), Math.floor(y - this.canvasHeight / 2));
    }
    renderHorizontallyCentered(ctx, x, y) {
      ctx.canvas.drawImage(this.renderable, Math.floor(x - this.canvasWidth / 2), Math.floor(y - this._strokeWidth.screenSpace() / 2));
    }
    /* getters & setters for non public attributes */
    get x() {
      return this._x;
    }
    set x(val) {
      if (this._x === val)
        return;
      this.redraw = true;
      this._x = val;
    }
    get y() {
      return this._y;
    }
    set y(val) {
      if (this._y === val)
        return;
      this.redraw = true;
      this._y = val;
    }
    get width() {
      return this._width;
    }
    set width(val) {
      if (this._width === val)
        return;
      this.redraw = true;
      this._width = val;
    }
    get height() {
      return this._height;
    }
    set height(val) {
      if (this._height === val)
        return;
      this.redraw = true;
      this._height = val;
    }
    get fillColor() {
      return this._fillColor;
    }
    set fillColor(val) {
      if (this._fillColor === val)
        return;
      this.redraw = true;
      this._fillColor = val;
    }
    get strokeColor() {
      return this._strokeColor;
    }
    set strokeColor(val) {
      if (this._strokeColor === val)
        return;
      this.redraw = true;
      this._strokeColor = val;
    }
    get strokeWidth() {
      return this._strokeWidth;
    }
    set strokeWidth(val) {
      if (this._strokeWidth === val)
        return;
      this.redraw = true;
      this._strokeWidth = val;
    }
    get forceHover() {
      return this._mockHover;
    }
    set forceHover(val) {
      if (this._mockHover === val)
        return;
      this.redraw = true;
      this._mockHover = val;
    }
    get forcePress() {
      return this._mockPress;
    }
    set forcePress(val) {
      if (this._mockPress === val)
        return;
      this.redraw = true;
      this._mockPress = val;
    }
  };

  // res/Images.json
  var preLoader = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4QBWRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAAITAAMAAAABAAEAAAAAAAAAAAEsAAAAAQAAASwAAAAB/+0ALFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAPHAFaAAMbJUccAQAAAgAEAP/hDW5odHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0nYWRvYmU6bnM6bWV0YS8nIHg6eG1wdGs9J0ltYWdlOjpFeGlmVG9vbCAxMS44OCc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczp0aWZmPSdodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyc+CiAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICA8dGlmZjpYUmVzb2x1dGlvbj4zMDAvMTwvdGlmZjpYUmVzb2x1dGlvbj4KICA8dGlmZjpZUmVzb2x1dGlvbj4zMDAvMTwvdGlmZjpZUmVzb2x1dGlvbj4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6eG1wPSdodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvJz4KICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIFN0b2NrIFBsYXRmb3JtPC94bXA6Q3JlYXRvclRvb2w+CiA8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOnhtcE1NPSdodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vJz4KICA8eG1wTU06RG9jdW1lbnRJRD54bXAuaWlkOjhkMTQ1OGQzLWMzZGItNGQ4ZC04Y2U1LTJkYWM0OGRlNGNmMDwveG1wTU06RG9jdW1lbnRJRD4KICA8eG1wTU06SW5zdGFuY2VJRD5hZG9iZTpkb2NpZDpzdG9jazphNmExMTk3My0wMWRlLTRiMWQtYjdlYy05YmVjNDE5NGRhYzM8L3htcE1NOkluc3RhbmNlSUQ+CiAgPHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpzdG9jazo3MTYwNTcxMzU8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KIDwvcmRmOkRlc2NyaXB0aW9uPgo8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSd3Jz8+/9sAQwAD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";

  // src/widgets/Image.ts
  var cachedPreLoaderImg = document.createElement("img");
  cachedPreLoaderImg.src = preLoader;
  var Image = class _Image extends Widget {
    constructor(_source = null) {
      super();
      this._source = _source;
      this.redraw = false;
    }
    static fromURL(url) {
      const img = document.createElement("img");
      const widget = new _Image(img);
      img.src = url;
      img.onload = () => widget.redraw = true;
      return widget;
    }
    get renderable() {
      if (this._source instanceof HTMLImageElement && !this._source.complete)
        return cachedPreLoaderImg;
      return this._source || this.canvas.canvas;
    }
    /* getters & setters for non public attributes */
    get source() {
      return this._source;
    }
    set source(val) {
      if (this._source === val)
        return;
      if (typeof val === "string") {
        const img = document.createElement("img");
        img.src = val;
        img.onload = () => this.redraw = true;
        val = img;
      }
      this._source = val;
    }
    get sourceSize() {
      return {
        width: this._source?.width || 0,
        height: this._source?.height || 0
      };
    }
    get sourceWidth() {
      return this._source?.width || 0;
    }
    get sourceHeight() {
      return this._source?.height || 0;
    }
  };

  // src/widgets/Bar.ts
  var Bar = class extends Widget {
    constructor(_width = 1, _value = 0, _innerColor = Color.WHITE, _innerHeightFactor = 0.75, _outerColor = Color.BLACK, _outerHeight = 24) {
      super();
      this._width = _width;
      this._value = _value;
      this._innerColor = _innerColor;
      this._innerHeightFactor = _innerHeightFactor;
      this._outerColor = _outerColor;
      this._outerHeight = _outerHeight;
      this.redraw = true;
    }
    get renderable() {
      if (!this.redraw && !Viewport.guiZoomChanged)
        return this.canvas.canvas;
      this.redraw = false;
      const width = this._width.screenSpace();
      const outerHeight = this._outerHeight.screenSpace();
      const maxStroke = Math.max(this.innerHeightFactor * outerHeight, outerHeight) + 1;
      this.canvasSize = { width: width + maxStroke / 2, height: maxStroke };
      this.canvas.save();
      this.canvas.lineCap = "round";
      this.canvas.lineWidth = outerHeight;
      this.canvas.strokeStyle = this._outerColor.toCSS();
      this.canvas.beginPath();
      this.canvas.moveTo(outerHeight / 2, outerHeight / 2);
      this.canvas.lineTo(width, outerHeight / 2);
      this.canvas.stroke();
      this.canvas.lineWidth = this._innerHeightFactor * outerHeight;
      this.canvas.strokeStyle = this._innerColor.toCSS();
      this.canvas.beginPath();
      this.canvas.moveTo(outerHeight / 2, outerHeight / 2);
      this.canvas.lineTo(width * this._value, outerHeight / 2);
      this.canvas.stroke();
      this.canvas.restore();
      return this.canvas.canvas;
    }
    /* getters & setters for non public attributes */
    get width() {
      return this._width;
    }
    set width(val) {
      if (this._width === val)
        return;
      this.redraw = true;
      this._width = val;
    }
    get value() {
      return this._value;
    }
    set value(val) {
      if (this._value === val)
        return;
      this.redraw = true;
      this._value = val;
    }
    get innerColor() {
      return this._innerColor;
    }
    set innerColor(val) {
      if (this._innerColor === val)
        return;
      this.redraw = true;
      this._innerColor = val;
    }
    get innerHeightFactor() {
      return this._innerHeightFactor;
    }
    set innerHeightFactor(val) {
      if (this._innerHeightFactor === val)
        return;
      this.redraw = true;
      this._innerHeightFactor = val;
    }
    get outerColor() {
      return this._outerColor;
    }
    set outerColor(val) {
      if (this._outerColor === val)
        return;
      this.redraw = true;
      this._outerColor = val;
    }
    get outerHeight() {
      return this._outerHeight;
    }
    set outerHeight(val) {
      if (this._outerHeight === val)
        return;
      this.redraw = true;
      this._outerHeight = val;
    }
  };

  // src/widgets/Text.ts
  var Text = class extends Widget {
    constructor(_text = "", _fontSize = 16, _fillColor = Color.WHITE, _strokeColor = Color.BLACK, _strokeWidthFactor = 0.2) {
      super();
      this._text = _text;
      this._fontSize = _fontSize;
      this._fillColor = _fillColor;
      this._strokeColor = _strokeColor;
      this._strokeWidthFactor = _strokeWidthFactor;
      this.redraw = true;
    }
    calculateMargin() {
      return this._strokeWidthFactor * this._fontSize.screenSpace() * 2;
    }
    calculateWidth() {
      this.canvas.font = `${this._fontSize.screenSpace()}px Ubuntu`;
      return Math.max(1, this.canvas.measureText(this._text).width + this.calculateMargin() * 2);
    }
    calculateHeight() {
      return Math.max(1, this._fontSize.screenSpace() * 1.4);
    }
    get renderable() {
      if (!this.redraw && !Viewport.guiZoomChanged)
        return this.canvas.canvas;
      this.redraw = false;
      const fontSize = this._fontSize.screenSpace();
      this.canvasSize = { width: this.calculateWidth(), height: this.calculateHeight() };
      this.canvas.font = `${fontSize}px Ubuntu`;
      this.canvas.textBaseline = "middle";
      this.canvas.textAlign = "left";
      const x = this.calculateMargin();
      const y = this.canvasHeight / 2;
      if (this._strokeWidthFactor && this._strokeColor) {
        this.canvas.fillStyle = this._strokeColor.toCSS();
        this.canvas.lineWidth = fontSize * this._strokeWidthFactor;
        this.canvas.strokeText(this._text, x, y);
      }
      if (this._fillColor) {
        this.canvas.fillStyle = this._fillColor.toCSS();
        this.canvas.fillText(this._text, x, y);
      }
      return this.canvas.canvas;
    }
    /* getters & setters for non public attributes */
    get text() {
      return this._text;
    }
    set text(val) {
      if (this._text === val)
        return;
      this.redraw = true;
      this._text = val;
    }
    get fontSize() {
      return this._fontSize;
    }
    set fontSize(val) {
      if (this._fontSize === val)
        return;
      this.redraw = true;
      this._fontSize = val;
    }
    get fillColor() {
      return this._fillColor;
    }
    set fillColor(val) {
      if (this._fillColor === val)
        return;
      this.redraw = true;
      this._fillColor = val;
    }
    get strokeColor() {
      return this._strokeColor;
    }
    set strokeColor(val) {
      if (this._strokeColor === val)
        return;
      this.redraw = true;
      this._strokeColor = val;
    }
    get strokeWidthFactor() {
      return this._strokeWidthFactor;
    }
    set strokeWidthFactor(val) {
      if (this._strokeWidthFactor === val)
        return;
      this.redraw = true;
      this._strokeWidthFactor = val;
    }
  };

  // src/widgets/ProgressBar.ts
  var ProgressBar = class extends Bar {
    constructor(textWidget = new Text(), _width = 1, _value = 0, _innerColor = Color.WHITE, _innerHeightFactor = 0.75, _outerColor = Color.BLACK, _outerHeight = 24) {
      super();
      this.textWidget = textWidget;
      this._width = _width;
      this._value = _value;
      this._innerColor = _innerColor;
      this._innerHeightFactor = _innerHeightFactor;
      this._outerColor = _outerColor;
      this._outerHeight = _outerHeight;
    }
    get renderable() {
      if (!this.redraw && !Viewport.guiZoomChanged)
        return this.canvas.canvas;
      this.redraw = false;
      const width = this._width.screenSpace();
      const outerHeight = this._outerHeight.screenSpace();
      const maxStroke = Math.max(this.innerHeightFactor * outerHeight, outerHeight) + 1;
      this.canvasSize = { width: width + maxStroke / 2, height: maxStroke };
      this.canvas.save();
      this.canvas.lineCap = "round";
      this.canvas.lineWidth = outerHeight;
      this.canvas.strokeStyle = this._outerColor.toCSS();
      this.canvas.beginPath();
      this.canvas.moveTo(outerHeight / 2, outerHeight / 2);
      this.canvas.lineTo(width, outerHeight / 2);
      this.canvas.stroke();
      this.canvas.lineWidth = this._innerHeightFactor * outerHeight;
      this.canvas.strokeStyle = this._innerColor.toCSS();
      this.canvas.beginPath();
      this.canvas.moveTo(outerHeight / 2, outerHeight / 2);
      this.canvas.lineTo(width * this._value, outerHeight / 2);
      this.canvas.stroke();
      this.canvas.restore();
      this.textWidget.renderCentered(this, this.canvasWidth / 2, this.canvasHeight / 2);
      return this.canvas.canvas;
    }
  };

  // src/widgets/buttons/Checkbox.ts
  var Checkbox = class extends Button {
    constructor(_isChecked = false, _checkColor = Color.BLACK, checkAnimation = new Animation(), _x = 0, _y = 0, _width = 1, _height = 1, _fillColor = Color.WHITE, _strokeColor = Color.BLACK, _strokeWidth = 10, _mockHover = false, _mockPress = false) {
      super();
      this._isChecked = _isChecked;
      this._checkColor = _checkColor;
      this.checkAnimation = checkAnimation;
      this._x = _x;
      this._y = _y;
      this._width = _width;
      this._height = _height;
      this._fillColor = _fillColor;
      this._strokeColor = _strokeColor;
      this._strokeWidth = _strokeWidth;
      this._mockHover = _mockHover;
      this._mockPress = _mockPress;
    }
    onClick() {
      this.isChecked = !this.isChecked;
    }
    get renderable() {
      if (this.interact())
        this.redraw = true;
      if (this.checkAnimation.step(this.isChecked))
        this.redraw = true;
      if (!this.redraw && !Viewport.guiZoomChanged)
        return this.canvas.canvas;
      this.redraw = false;
      const strokeWidth = this._strokeWidth.screenSpace();
      const width = this._width.screenSpace();
      const height = this._height.screenSpace();
      this.canvasSize = { width: width + strokeWidth, height: height + strokeWidth };
      this.canvas.save();
      if (strokeWidth && this._strokeColor) {
        this.canvas.lineWidth = strokeWidth;
        this.canvas.lineJoin = "round";
        this.canvas.strokeStyle = this._strokeColor.toCSS();
        this.canvas.strokeRect(strokeWidth / 2, strokeWidth / 2, width, height);
      }
      if (this._fillColor) {
        this.canvas.fillStyle = this._fillColor.toCSS();
        this.canvas.fillRect(strokeWidth / 2, strokeWidth / 2, width, height);
      }
      if (this._checkColor) {
        this.canvas.fillStyle = this._checkColor.toCSS();
        const w = width * 0.75 * this.checkAnimation.latest;
        const h = height * 0.75 * this.checkAnimation.latest;
        const x = strokeWidth / 2 + (width - w) / 2;
        const y = strokeWidth / 2 + (height - h) / 2;
        this.canvas.fillRect(x, y, w, h);
      }
      this.canvas.restore();
      return this.canvas.canvas;
    }
    /* getters & setters for non public attributes */
    get isChecked() {
      return this._isChecked;
    }
    set isChecked(val) {
      if (this._isChecked === val)
        return;
      this.redraw = true;
      this._isChecked = val;
    }
    get checkColor() {
      return this._checkColor;
    }
    set checkColor(val) {
      if (this._checkColor === val)
        return;
      this.redraw = true;
      this._checkColor = val;
    }
  };

  // src/widgets/buttons/ImageButton.ts
  var ImageButton = class extends Button {
    constructor(imageWidget = new Image(), _x = 0, _y = 0, _width = 1, _height = 1, _strokeColor = Color.BLACK, _strokeWidth = 10, _mockHover = false, _mockPress = false) {
      super();
      this.imageWidget = imageWidget;
      this._x = _x;
      this._y = _y;
      this._width = _width;
      this._height = _height;
      this._strokeColor = _strokeColor;
      this._strokeWidth = _strokeWidth;
      this._mockHover = _mockHover;
      this._mockPress = _mockPress;
    }
    get renderable() {
      if (this.interact())
        this.redraw = true;
      if (this.imageWidget.redraw)
        this.redraw = true;
      if (!this.redraw && !Viewport.guiZoomChanged)
        return this.canvas.canvas;
      this.redraw = false;
      const strokeWidth = this._strokeWidth.screenSpace();
      const width = this._width.screenSpace();
      const height = this._height.screenSpace();
      this.canvasSize = { width: width + strokeWidth, height: height + strokeWidth };
      this.canvas.save();
      if (strokeWidth && this._strokeColor) {
        this.canvas.lineWidth = strokeWidth;
        this.canvas.lineJoin = "round";
        this.canvas.strokeStyle = this._strokeColor.toCSS();
        this.canvas.strokeRect(strokeWidth / 2, strokeWidth / 2, width, height);
      }
      this.canvas.drawImage(this.imageWidget.renderable, strokeWidth / 2, strokeWidth / 2, width, height);
      if (this.isPressed || this._mockPress) {
        this.canvas.globalAlpha = 0.2;
        this.canvas.fillStyle = Color.BLACK.toCSS();
        this.canvas.fillRect(strokeWidth / 2, strokeWidth / 2, width, height);
      } else if (this.isHovered || this._mockHover) {
        this.canvas.globalAlpha = 0.2;
        this.canvas.fillStyle = Color.WHITE.toCSS();
        this.canvas.fillRect(strokeWidth / 2, strokeWidth / 2, width, height);
      }
      this.canvas.restore();
      return this.canvas.canvas;
    }
  };

  // src/widgets/buttons/TextButton.ts
  var TextButton = class extends Button {
    constructor(textWidget = new Text(), _x = 0, _y = 0, _width = 1, _height = 1, _fillColor = Color.WHITE, _strokeColor = Color.BLACK, _strokeWidth = 10, _mockHover = false, _mockPress = false) {
      super();
      this.textWidget = textWidget;
      this._x = _x;
      this._y = _y;
      this._width = _width;
      this._height = _height;
      this._fillColor = _fillColor;
      this._strokeColor = _strokeColor;
      this._strokeWidth = _strokeWidth;
      this._mockHover = _mockHover;
      this._mockPress = _mockPress;
    }
    get renderable() {
      if (this.interact())
        this.redraw = true;
      if (!this.redraw && !Viewport.guiZoomChanged)
        return this.canvas.canvas;
      this.redraw = false;
      const strokeWidth = this._strokeWidth.screenSpace();
      const width = this._width.screenSpace();
      const height = this._height.screenSpace();
      this.canvasSize = { width: width + strokeWidth, height: height + strokeWidth };
      this.canvas.save();
      const fillColor = this._fillColor?.clone();
      if (fillColor) {
        if (this.isPressed || this._mockPress)
          fillColor.blendWith(0.2, Color.BLACK);
        else if (this.isHovered || this._mockHover)
          fillColor.blendWith(0.2, Color.WHITE);
      }
      if (strokeWidth && this._strokeColor) {
        this.canvas.lineWidth = strokeWidth;
        this.canvas.lineJoin = "round";
        this.canvas.strokeStyle = this._strokeColor.toCSS();
        this.canvas.strokeRect(strokeWidth / 2, strokeWidth / 2, width, height);
      }
      if (fillColor) {
        this.canvas.fillStyle = fillColor.toCSS();
        this.canvas.fillRect(strokeWidth / 2, strokeWidth / 2, width, height);
      }
      this.canvas.globalAlpha = 0.2;
      this.canvas.fillStyle = Color.BLACK.toCSS();
      if (this.isPressed || this._mockPress) {
        this.canvas.fillRect(strokeWidth / 2, strokeWidth / 2, width, height * 7 / 12);
      } else {
        this.canvas.fillRect(strokeWidth / 2, strokeWidth / 2 + height * 7 / 12, width, height - height * 7 / 12);
      }
      this.canvas.restore();
      this.textWidget.renderCentered(this, this.canvasWidth / 2, this.canvasHeight / 2);
      return this.canvas.canvas;
    }
  };

  // src/core/Viewport.ts
  var Viewport = class {
    static {
      this.maxWidth = 1920;
    }
    static {
      this.maxHeight = 1080;
    }
    static {
      this.width = 1;
    }
    static {
      this.height = 1;
    }
    static {
      this.guiScale = 1;
    }
    static {
      this.guiZoomFactor = 1;
    }
    static {
      this.guiZoomChanged = true;
    }
    static {
      this.ctx = new Renderable(document.getElementById("canvas"));
    }
    static resize() {
      this.width = window.innerWidth * window.devicePixelRatio;
      this.height = window.innerHeight * window.devicePixelRatio;
      const guiZoomFactor = Math.max(this.width / this.maxWidth, this.height / this.maxHeight) * this.guiScale;
      this.guiZoomChanged = this.guiZoomFactor !== guiZoomFactor;
      this.guiZoomFactor = guiZoomFactor;
      this.ctx.canvasSize = { width: this.width, height: this.height };
    }
    static {
      this.a = new ProgressBar(new Text("100%", 150 / 1.4), 300, 0.5, Color.WHITE, 0.75, Color.BLACK, 150);
    }
    static {
      this.b = new Button(100, 100, 200, 200, Color.fromRGB(0, 0, 255), Color.BLACK, 20, false, false);
    }
    static {
      this.c = new Checkbox(true, Color.fromRGB(255, 0, 0), new Animation("easeInOutExpo" /* EaseInOutExpo */, 0.05), 100, 100, 50, 50, Color.WHITE, Color.BLACK, 20, false, false);
    }
    static {
      this.d = new TextButton(new Text("test button", 20), 100, 100, 200, 200, Color.fromRGB(0, 0, 255), Color.BLACK, 20, false, false);
    }
    static {
      this.e = new ImageButton(Image.fromURL("https://assets.hager.com/step-content/P/HA_22410449/10/std.lang.all/WDI100.webp"), 100, 100, 200, 200, Color.BLACK, 20, false, false);
    }
    /*
        this.canvas.save();
        this.canvas.strokeStyle = Color.fromRGB(255, 0, 0).toCSS();
        this.canvas.lineWidth = 1;
        this.canvas.strokeRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.canvas.restore();
    */
    static render() {
      this.resize();
      this.ctx.canvas.reset();
      this.e.render(this.ctx, this.e.x.screenSpace(), this.e.y.screenSpace());
    }
  };
  Number.prototype.screenSpace = function() {
    return this * Viewport.guiZoomFactor;
  };

  // src/core/Input.ts
  var Input = class {
    static {
      this.mouse = {
        x: 0,
        y: 0,
        leftDown: false,
        rightDown: false,
        wheelDown: false,
        clicked: false,
        wheelDelta: 0,
        cursor: "default"
      };
    }
    static {
      this.mapping = {
        "Space": 0 /* Shoot */,
        "ShiftLeft": 1 /* Repel */,
        "KeyW": 2 /* Up */,
        "KeyA": 3 /* Left */,
        "KeyS": 4 /* Down */,
        "KeyD": 5 /* Right */,
        "BracketLeft": 6 /* GodMode */,
        "KeyO": 7 /* Suicide */,
        "KeyU": 8 /* PreAllocateStat */,
        "KeyM": 9 /* MaxAllocateStat */,
        "KeyH": 10 /* Possess */,
        "Enter": 11 /* Confirm */,
        "KeyY": 12 /* TankWheel */,
        "KeyE": 13 /* AutoFire */,
        "KeyC": 14 /* AutoSpin */,
        "KeyL": 15 /* ServerInfo */,
        "KeyK": 16 /* LevelUp */,
        "Digit1": 17 /* Attribute0 */,
        "Digit2": 18 /* Attribute1 */,
        "Digit3": 19 /* Attribute2 */,
        "Digit4": 20 /* Attribute3 */,
        "Digit5": 21 /* Attribute4 */,
        "Digit6": 22 /* Attribute5 */,
        "Digit7": 23 /* Attribute6 */,
        "Digit8": 24 /* Attribute7 */,
        "Digit9": 25 /* Attribute8 */,
        "Digit0": 26 /* Attribute9 */
      };
    }
    static {
      this.keyDown = /* @__PURE__ */ new Set();
    }
    static {
      this.keyUp = /* @__PURE__ */ new Set();
    }
    static {
      this.keyPress = /* @__PURE__ */ new Set();
    }
    static init() {
      window.addEventListener("mousemove", (e) => {
        this.mouse.x = e.clientX * window.devicePixelRatio;
        this.mouse.y = e.clientY * window.devicePixelRatio;
      });
      window.addEventListener("mousedown", (e) => {
        this.mouse.leftDown = Boolean(e.buttons & 1 << 0);
        this.mouse.rightDown = Boolean(e.buttons & 1 << 1);
        this.mouse.wheelDown = Boolean(e.buttons & 1 << 2);
      });
      window.addEventListener("mouseup", (e) => {
        this.mouse.leftDown = Boolean(e.buttons & 1 << 0);
        this.mouse.rightDown = Boolean(e.buttons & 1 << 1);
        this.mouse.wheelDown = Boolean(e.buttons & 1 << 2);
      });
      window.addEventListener("click", () => {
        this.mouse.clicked = true;
      });
      window.addEventListener("wheel", (e) => {
        this.mouse.wheelDelta = e.deltaY;
      });
      window.addEventListener("keydown", (e) => {
        const event = this.mapping[e.code];
        if (event === void 0)
          return;
        this.keyDown.add(event);
      });
      window.addEventListener("keyup", (e) => {
        const event = this.mapping[e.code];
        if (event === void 0)
          return;
        this.keyUp.add(event);
      });
      window.addEventListener("keypress", (e) => {
        const event = this.mapping[e.code];
        if (event === void 0)
          return;
        this.keyPress.add(event);
      });
      const canvas = Viewport.ctx.canvas.canvas;
      canvas.ondragstart = canvas.oncontextmenu = (e) => e.preventDefault();
    }
    static startFrame() {
      this.mouse.cursor = "default";
    }
    static endFrame() {
      this.keyPress.clear();
      for (const key of Array.from(this.keyUp))
        this.keyDown.delete(key);
      this.keyUp.clear();
      this.mouse.clicked = false;
      Viewport.ctx.canvas.canvas.style.cursor = this.mouse.cursor;
    }
  };

  // src/index.ts
  var render = () => {
    Input.startFrame();
    Viewport.render();
    Input.endFrame();
    requestAnimationFrame(render);
  };
  document.fonts.onloadingdone = () => {
    Input.init();
    requestAnimationFrame(render);
  };
})();
