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

  // src/widgets/TextArea.ts
  var TextArea = class extends Text {
    constructor(_text = "", _fontSize = 16, _textAlign = "left", _fillColor = Color.WHITE, _strokeColor = Color.BLACK, _strokeWidthFactor = 0.2) {
      super(_text, _fontSize, _fillColor, _strokeColor, _strokeWidthFactor);
      this._text = _text;
      this._fontSize = _fontSize;
      this._textAlign = _textAlign;
      this._fillColor = _fillColor;
      this._strokeColor = _strokeColor;
      this._strokeWidthFactor = _strokeWidthFactor;
    }
    calculateMargin() {
      return this._strokeWidthFactor * this._fontSize.screenSpace() * 2;
    }
    calculateWidth() {
      this.canvas.font = `${this._fontSize.screenSpace()}px Ubuntu`;
      const margin = this.calculateMargin() * 2;
      return Math.max(1, ...this._text.split("\n").map((e) => this.canvas.measureText(e).width + margin));
    }
    calculateHeight() {
      return Math.max(1, this._fontSize.screenSpace() * 1.4 * this._text.split("\n").length);
    }
    get renderable() {
      if (!this.redraw && !Viewport.guiZoomChanged)
        return this.canvas.canvas;
      this.redraw = false;
      const fontSize = this._fontSize.screenSpace();
      this.canvasSize = { width: this.calculateWidth(), height: this.calculateHeight() };
      this.canvas.font = `${fontSize}px Ubuntu`;
      this.canvas.textBaseline = "middle";
      this.canvas.textAlign = this._textAlign;
      let x;
      switch (this._textAlign) {
        case "left":
          x = this.calculateMargin();
          break;
        case "center":
          x = this.canvasWidth / 2;
          break;
        case "right":
          x = this.canvasWidth - this.calculateMargin();
          break;
      }
      const lines = this._text.split("\n");
      for (let i = 0; i < lines.length; ++i) {
        const y = Math.max(1, this._fontSize.screenSpace() * 1.4) * (i + 0.5);
        if (this._strokeWidthFactor && this._strokeColor) {
          this.canvas.fillStyle = this._strokeColor.toCSS();
          this.canvas.lineWidth = fontSize * this._strokeWidthFactor;
          this.canvas.strokeText(lines[i], x, y);
        }
        if (this._fillColor) {
          this.canvas.fillStyle = this._fillColor.toCSS();
          this.canvas.fillText(lines[i], x, y);
        }
      }
      return this.canvas.canvas;
    }
    /* getters & setters for non public attributes */
    get textAlign() {
      return this._textAlign;
    }
    set textAlign(val) {
      if (this._textAlign === val)
        return;
      this.redraw = true;
      this._textAlign = val;
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
      this.a = new TextArea("test test test\ntest1 28382382838\nthis   is   a    very long         string        :)))))))", 16, "right");
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
      this.a.render(this.ctx, 500, 500);
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
