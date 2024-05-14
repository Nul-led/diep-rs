"use strict";
(() => {
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

  // src/util/Clamp.ts
  var clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  // src/widgets/Slider.ts
  var Slider = class extends InteractableWidget {
    constructor(_x = 0, _y = 0, _width = 100, _height = 20, step = 0.01, _value = 0, _barColor = Color.BLACK, _valueColor = Color.WHITE) {
      super();
      this._x = _x;
      this._y = _y;
      this._width = _width;
      this._height = _height;
      this.step = step;
      this._value = _value;
      this._barColor = _barColor;
      this._valueColor = _valueColor;
      this.redraw = true;
      this.isSliding = false;
    }
    onHover() {
    }
    onClick() {
    }
    onPress() {
      this.isSliding = true;
    }
    getInteractablePath() {
      const path = new Path2D();
      const x = this._x.screenSpace();
      const y = this._y.screenSpace();
      const w = this._width.screenSpace();
      const h = this._height.screenSpace();
      path.rect(x, y + h * 0.25, w, h);
      path.arc(x + Math.max(w * this._value, h / 2), y + h * 0.625, h * 0.625, 0, Math.PI * 2);
      return path;
    }
    get renderable() {
      this.interact();
      if (this.isSliding) {
        if (!Input.mouse.leftDown)
          this.isSliding = false;
        this.value = clamp((Input.mouse.x - this._x.screenSpace()) / this._width.screenSpace(), 0, 1);
        Input.mouse.cursor = "pointer";
      }
      if (!this.redraw && !Viewport.guiZoomChanged)
        return this.canvas.canvas;
      this.redraw = false;
      const width = this._width.screenSpace();
      const height = this._height.screenSpace();
      const maxHeight = height * 1.25;
      this.canvasSize = { width: width + maxHeight / 2, height: maxHeight };
      this.canvas.save();
      this.canvas.lineCap = "round";
      this.canvas.lineWidth = height;
      this.canvas.strokeStyle = this._barColor.toCSS();
      this.canvas.beginPath();
      this.canvas.moveTo(maxHeight / 2, maxHeight / 2);
      this.canvas.lineTo(width, maxHeight / 2);
      this.canvas.stroke();
      this.canvas.lineWidth = height;
      this.canvas.strokeStyle = this._valueColor.toCSS();
      this.canvas.beginPath();
      this.canvas.moveTo(maxHeight / 2, maxHeight / 2);
      this.canvas.lineTo(Math.max(width * this._value, maxHeight / 2), maxHeight / 2);
      this.canvas.stroke();
      this.canvas.beginPath();
      this.canvas.arc(Math.max(width * this._value, maxHeight / 2), maxHeight / 2, height / 2, 0, Math.PI * 2);
      this.canvas.lineWidth = maxHeight - height;
      this.canvas.strokeStyle = Color.BLACK.toCSS();
      this.canvas.stroke();
      this.canvas.fillStyle = this._valueColor.toCSS();
      this.canvas.fill();
      this.canvas.restore();
      return this.canvas.canvas;
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
    get value() {
      return this._value;
    }
    set value(val) {
      if (this._value === val)
        return;
      this.redraw = true;
      this._value = val;
    }
    get barColor() {
      return this._barColor;
    }
    set barColor(val) {
      if (this._barColor === val)
        return;
      this.redraw = true;
      this._barColor = val;
    }
    get valueColor() {
      return this._valueColor;
    }
    set valueColor(val) {
      if (this._valueColor === val)
        return;
      this.redraw = true;
      this._valueColor = val;
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
      this.a = new Slider(100, 100, 200, 20, 0.01, 1, Color.BLACK, Color.fromRGB(255, 0, 0));
    }
    static {
      this.b = new Text("Slider widget value: 0", 25);
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
      this.a.render(this.ctx, this.a.x.screenSpace(), this.a.y.screenSpace());
      this.b.text = "Slider widget value: " + this.a.value.toFixed(2);
      this.b.renderCentered(this.ctx, this.a.x.screenSpace() + this.a.canvasWidth / 2, this.a.y.screenSpace() - 20 .screenSpace());
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
