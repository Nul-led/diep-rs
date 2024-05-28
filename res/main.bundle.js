"use strict";
(() => {
  // src/core/Component.ts
  var Component = class extends EventTarget {
    constructor(x = 0, y = 0, anchorX = 0 /* Min */, anchorY = 3 /* Min */) {
      super();
      this.x = x;
      this.y = y;
      this.anchorX = anchorX;
      this.anchorY = anchorY;
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

  // src/components/AppInfo.ts
  var AppInfo = class extends Component {
    constructor(header = new Text("diep.rs", 20), lines = new TextArea("0 players", 16, "right"), x = -20, y = -198, anchorX = 2 /* Max */, anchorY = 5 /* Max */) {
      super();
      this.header = header;
      this.lines = lines;
      this.x = x;
      this.y = y;
      this.anchorX = anchorX;
      this.anchorY = anchorY;
    }
    render(ctx) {
      ctx.canvas.save();
      ctx.canvas.globalAlpha = 0.7;
      const x = this.x.anchoredScreenSpace(this.anchorX);
      const y = this.y.anchoredScreenSpace(this.anchorY);
      this.lines.render(ctx, x - this.lines.calculateWidth(), y - this.lines.calculateHeight());
      this.header.render(ctx, x - this.header.calculateWidth(), y - this.header.calculateHeight() - this.lines.canvasHeight);
      ctx.canvas.restore();
    }
  };

  // src/components/Changelog.ts
  var Changelog = class extends Component {
    constructor(header = new Text("Changelog", 20), lines = new TextArea("test entry\ntest entry 2", 16), x = 30, y = 30, anchorX = 0 /* Min */, anchorY = 3 /* Min */) {
      super();
      this.header = header;
      this.lines = lines;
      this.x = x;
      this.y = y;
      this.anchorX = anchorX;
      this.anchorY = anchorY;
    }
    render(ctx) {
      const x = this.x.anchoredScreenSpace(this.anchorX);
      const y = this.y.anchoredScreenSpace(this.anchorY);
      this.header.render(ctx, x, y);
      this.lines.render(ctx, x, y + this.header.canvasHeight);
    }
  };

  // src/widgets/Button.ts
  var Button = class extends InteractableWidget {
    constructor(_x = 0, _y = 0, anchorX = 0 /* Min */, anchorY = 3 /* Min */, _width = 1, _height = 1, _fillColor = Color.WHITE, _strokeColor = Color.BLACK, _strokeWidth = 10, _mockHover = false, _mockPress = false) {
      super();
      this._x = _x;
      this._y = _y;
      this.anchorX = anchorX;
      this.anchorY = anchorY;
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
      path.rect(this._x.anchoredScreenSpace(this.anchorX), this._y.anchoredScreenSpace(this.anchorY), this._width.screenSpace(), this._height.screenSpace());
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

  // src/widgets/buttons/TextButton.ts
  var TextButton = class extends Button {
    constructor(textWidget = new Text(), _x = 0, _y = 0, anchorX = 0 /* Min */, anchorY = 3 /* Min */, _width = 1, _height = 1, _fillColor = Color.WHITE, _strokeColor = Color.BLACK, _strokeWidth = 10, _mockHover = false, _mockPress = false) {
      super();
      this.textWidget = textWidget;
      this._x = _x;
      this._y = _y;
      this.anchorX = anchorX;
      this.anchorY = anchorY;
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

  // src/components/Invite.ts
  var Invite = class extends Component {
    constructor(button = new TextButton(new Text("Invite", 0.56 * 24), -135, 12, 2 /* Max */, 3 /* Min */, 120, 24, Color.fromRGB(119, 119, 119), Color.fromRGB(51, 51, 51)), x = -135, y = 12, anchorX = 2 /* Max */, anchorY = 3 /* Min */, inviteLink = "") {
      super();
      this.button = button;
      this.x = x;
      this.y = y;
      this.anchorX = anchorX;
      this.anchorY = anchorY;
      this.inviteLink = inviteLink;
    }
    render(ctx) {
      const x = this.x.anchoredScreenSpace(this.anchorX);
      const y = this.y.anchoredScreenSpace(this.anchorY);
      this.button.render(ctx, x, y);
      this.button.onClick = () => navigator.clipboard.writeText(this.inviteLink);
    }
  };

  // src/components/Minimap.ts
  var Minimap = class extends Component {
    constructor(x = -20, y = -20, anchorX = 2 /* Max */, anchorY = 5 /* Max */, sizeX = 175, sizeY = 175, backgroundColor = Color.fromRGB(205, 205, 205), strokeColor = Color.fromRGB(121, 121, 121)) {
      super();
      this.x = x;
      this.y = y;
      this.anchorX = anchorX;
      this.anchorY = anchorY;
      this.sizeX = sizeX;
      this.sizeY = sizeY;
      this.backgroundColor = backgroundColor;
      this.strokeColor = strokeColor;
      this.buffer = new Renderable();
    }
    getBufferCtx() {
      return this.buffer.canvas;
    }
    render(ctx) {
      ctx.canvas.save();
      ctx.canvas.globalAlpha = 0.7;
      const x = (this.x - this.sizeX).anchoredScreenSpace(this.anchorX);
      const y = (this.y - this.sizeY).anchoredScreenSpace(this.anchorY);
      const sizeX = this.sizeX.screenSpace();
      const sizeY = this.sizeY.screenSpace();
      ctx.canvas.save();
      ctx.canvas.translate(x, y);
      ctx.canvas.scale(this.sizeX.screenSpace(), this.sizeY.screenSpace());
      ctx.canvas.save();
      ctx.canvas.beginPath();
      ctx.canvas.rect(0, 0, 1, 1);
      ctx.canvas.clip();
      ctx.canvas.fillStyle = this.backgroundColor.toCSS();
      ctx.canvas.fillRect(0, 0, 1, 1);
      ctx.canvas.drawImage(this.buffer.canvas.canvas, 0, 0, 1, 1);
      ctx.canvas.restore();
      ctx.canvas.strokeStyle = this.strokeColor.toCSS();
      ctx.canvas.lineWidth = 0.03;
      ctx.canvas.lineJoin = "round";
      ctx.canvas.strokeRect(0, 0, 1, 1);
      ctx.canvas.restore();
      ctx.canvas.restore();
    }
  };

  // src/widgets/Bar.ts
  var Bar = class extends Widget {
    constructor(_width = 1, _outerHeight = 1, _innerColor = Color.WHITE, _outerColor = Color.BLACK, _innerHeightFactor = 0.75, _value = 0) {
      super();
      this._width = _width;
      this._outerHeight = _outerHeight;
      this._innerColor = _innerColor;
      this._outerColor = _outerColor;
      this._innerHeightFactor = _innerHeightFactor;
      this._value = _value;
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
      this.canvas.lineTo(Math.max(width * this._value, maxStroke / 2), outerHeight / 2);
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

  // src/widgets/ProgressBar.ts
  var ProgressBar = class extends Bar {
    constructor(textWidget = new Text(), _width = 1, _outerHeight = 1, _innerColor = Color.WHITE, _outerColor = Color.BLACK, _innerHeightFactor = 0.75, _value = 0) {
      super();
      this.textWidget = textWidget;
      this._width = _width;
      this._outerHeight = _outerHeight;
      this._innerColor = _innerColor;
      this._outerColor = _outerColor;
      this._innerHeightFactor = _innerHeightFactor;
      this._value = _value;
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
      this.canvas.lineTo(Math.max(width * this._value, maxStroke / 2), outerHeight / 2);
      this.canvas.stroke();
      this.canvas.restore();
      this.textWidget.renderCentered(this, this.canvasWidth / 2, this.canvasHeight / 2);
      return this.canvas.canvas;
    }
  };

  // src/components/PlayerStatus.ts
  var PlayerStatus = class extends Component {
    constructor(levelbar = new ProgressBar(new Text("Lvl 1 Tank", 16), 424, 24, new Color(16768579)), scorebar = new ProgressBar(new Text("Score: 0", 15), 320, 20, new Color(4456337)), playerNameText = new Text("Unnamed", 40), x = 0, y = -34, anchorX = 1 /* Half */, anchorY = 5 /* Max */, renderScorebar = true) {
      super();
      this.levelbar = levelbar;
      this.scorebar = scorebar;
      this.playerNameText = playerNameText;
      this.x = x;
      this.y = y;
      this.anchorX = anchorX;
      this.anchorY = anchorY;
      this.renderScorebar = renderScorebar;
    }
    render(ctx) {
      ctx.canvas.save();
      ctx.canvas.globalAlpha = 0.7;
      const x = this.x.anchoredScreenSpace(this.anchorX);
      const y = this.y.anchoredScreenSpace(this.anchorY);
      const levelbarHeight = this.levelbar.outerHeight.screenSpace();
      const scorebarHeight = this.scorebar.outerHeight.screenSpace();
      this.levelbar.renderCentered(ctx, x, y);
      if (this.renderScorebar)
        this.scorebar.renderCentered(ctx, x, y - levelbarHeight);
      this.playerNameText.renderCentered(ctx, x, y - levelbarHeight - (this.renderScorebar ? scorebarHeight + levelbarHeight / 2 : levelbarHeight / 2));
      ctx.canvas.restore();
    }
  };

  // src/core/Viewport.ts
  var Viewport = class _Viewport {
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
    static {
      this.appInfo = new AppInfo();
    }
    static {
      this.attributes = null;
    }
    static {
      this.changelog = new Changelog();
    }
    static {
      this.classes = null;
    }
    static {
      this.classTree = null;
    }
    static {
      this.console = null;
    }
    static {
      this.fadeout = null;
    }
    static {
      this.infoHeader = null;
    }
    static {
      this.invite = new Invite();
    }
    static {
      this.minimap = new Minimap();
    }
    static {
      this.notifications = null;
    }
    static {
      this.playerStats = null;
    }
    static {
      this.playerStatus = new PlayerStatus();
    }
    static {
      this.scoreboard = null;
    }
    static {
      this.spawnMenu = null;
    }
    static resize() {
      _Viewport.width = window.innerWidth * window.devicePixelRatio;
      _Viewport.height = window.innerHeight * window.devicePixelRatio;
      const guiZoomFactor = Math.max(_Viewport.width / _Viewport.maxWidth, _Viewport.height / _Viewport.maxHeight) * _Viewport.guiScale;
      _Viewport.guiZoomChanged = _Viewport.guiZoomFactor !== guiZoomFactor;
      _Viewport.guiZoomFactor = guiZoomFactor;
      _Viewport.ctx.canvasSize = { width: _Viewport.width, height: _Viewport.height };
    }
    /*
        this.canvas.save();
        this.canvas.strokeStyle = Color.fromRGB(255, 0, 0).toCSS();
        this.canvas.lineWidth = 1;
        this.canvas.strokeRect(0, 0, Viewport.canvasWidth, Viewport.canvasHeight);
        this.canvas.restore();
    */
    static getCtx() {
      return _Viewport.ctx.canvas;
    }
    static startFrame() {
      _Viewport.resize();
      _Viewport.ctx.canvas.reset();
      Input.startFrame();
    }
    static renderComponents() {
      if (_Viewport.appInfo)
        _Viewport.appInfo.render(_Viewport.ctx);
      if (_Viewport.infoHeader)
        _Viewport.infoHeader.render(_Viewport.ctx);
      if (_Viewport.invite)
        _Viewport.invite.render(_Viewport.ctx);
      if (_Viewport.minimap)
        _Viewport.minimap.render(_Viewport.ctx);
      if (_Viewport.playerStatus)
        _Viewport.playerStatus.render(_Viewport.ctx);
    }
    static endFrame() {
      Input.endFrame();
    }
  };
  Number.prototype.screenSpace = function() {
    return this * Viewport.guiZoomFactor;
  };
  Number.prototype.anchoredScreenSpace = function(anchor) {
    switch (anchor) {
      case 0 /* Min */:
        return this * Viewport.guiZoomFactor;
      case 1 /* Half */:
        return Viewport.width / 2 + this * Viewport.guiZoomFactor;
      case 2 /* Max */:
        return Viewport.width + this * Viewport.guiZoomFactor;
      case 3 /* Min */:
        return this * Viewport.guiZoomFactor;
      case 4 /* Half */:
        return Viewport.height / 2 + this * Viewport.guiZoomFactor;
      case 5 /* Max */:
        return Viewport.height + this * Viewport.guiZoomFactor;
    }
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
      return isForward ? this.stepForward() : this.stepBackward();
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

  // src/components/InfoHeader.ts
  var InfoHeader = class extends Component {
    constructor(header = new Text("Connecting...", 70), x = 0, y = 0, anchorX = 1 /* Half */, anchorY = 4 /* Half */, slideDownAnimation = new Animation("easeOutExpo" /* EaseOutExpo */, 75e-4), slideUpAnimation = new Animation("easeInSine" /* EaseInSine */, 0.05, 1), isDown = true) {
      super();
      this.header = header;
      this.x = x;
      this.y = y;
      this.anchorX = anchorX;
      this.anchorY = anchorY;
      this.slideDownAnimation = slideDownAnimation;
      this.slideUpAnimation = slideUpAnimation;
      this.isDown = isDown;
    }
    render(ctx) {
      const x = this.x.anchoredScreenSpace(this.anchorX);
      const animation = this.isDown ? this.slideDownAnimation : this.slideUpAnimation;
      animation.step(this.isDown);
      const y = this.y.anchoredScreenSpace(this.anchorY) * animation.latest;
      if (animation.timer === 0) {
        this.dispatchEvent(new Event("animation::timer::min" /* AnimationTimerMin */));
        return;
      } else if (animation.timer === 1) {
        this.dispatchEvent(new Event("animation::timer::max" /* AnimationTimerMax */));
      }
      this.header.renderCentered(ctx, x, y);
    }
  };

  // src/core/ABI.ts
  window.enableComponents = (components) => {
    for (const component of components) {
      switch (component) {
        case 0 /* AppInfo */:
          Viewport.appInfo ||= new AppInfo();
          break;
        case 1 /* Attributes */:
          break;
        case 2 /* Changelog */:
          Viewport.changelog ||= new Changelog();
          break;
        case 4 /* ClassTree */:
          break;
        case 2 /* Changelog */:
          Viewport.changelog ||= new Changelog();
          break;
        case 3 /* Classes */:
          break;
        case 5 /* Console */:
          break;
        case 6 /* Fadeout */:
          break;
        case 7 /* InfoHeader */:
          Viewport.infoHeader ||= new InfoHeader();
          break;
        case 8 /* Invite */:
          Viewport.invite ||= new Invite();
          break;
        case 9 /* Minimap */:
          Viewport.minimap ||= new Minimap();
          break;
        case 10 /* Notifications */:
          break;
        case 11 /* PlayerStats */:
          break;
        case 12 /* PlayerStatus */:
          Viewport.playerStatus ||= new PlayerStatus();
          break;
        case 13 /* Scoreboard */:
          break;
        case 14 /* SpawnMenu */:
          break;
      }
    }
  };
  window.disableComponents = (components) => {
    for (const component of components) {
      switch (component) {
        case 0 /* AppInfo */:
          Viewport.appInfo = null;
          break;
        case 1 /* Attributes */:
          Viewport.attributes = null;
          break;
        case 2 /* Changelog */:
          Viewport.changelog = null;
          break;
        case 4 /* ClassTree */:
          Viewport.classTree = null;
          break;
        case 2 /* Changelog */:
          Viewport.changelog = null;
          break;
        case 3 /* Classes */:
          Viewport.classes = null;
          break;
        case 5 /* Console */:
          Viewport.console = null;
          break;
        case 6 /* Fadeout */:
          Viewport.fadeout = null;
          break;
        case 7 /* InfoHeader */:
          Viewport.infoHeader = null;
          break;
        case 8 /* Invite */:
          Viewport.invite = null;
          break;
        case 9 /* Minimap */:
          Viewport.minimap = null;
          break;
        case 10 /* Notifications */:
          Viewport.notifications = null;
          break;
        case 11 /* PlayerStats */:
          Viewport.playerStats = null;
          break;
        case 12 /* PlayerStatus */:
          Viewport.playerStatus = null;
          break;
        case 13 /* Scoreboard */:
          Viewport.scoreboard = null;
          break;
        case 14 /* SpawnMenu */:
          Viewport.spawnMenu = null;
          break;
      }
    }
  };
  window.setAppInfoBody = (text) => {
    if (Viewport.appInfo)
      Viewport.appInfo.lines.text = text;
  };
  window.setAppInfoHeader = (text) => {
    if (Viewport.appInfo)
      Viewport.appInfo.header.text = text;
  };
  window.setChangelog = (text) => {
    if (Viewport.changelog)
      Viewport.changelog.lines.text = text;
  };
  window.setInfoHeader = (text) => {
    if (Viewport.infoHeader)
      Viewport.infoHeader.header.text = text;
  };
  window.setInvite = (link) => {
    if (Viewport.invite)
      Viewport.invite.inviteLink = link;
  };
  window.setPlayerStatusLevelbarText = (text) => {
    if (Viewport.playerStatus)
      Viewport.playerStatus.levelbar.textWidget.text = text;
  };
  window.setPlayerStatusPlayerName = (name) => {
    if (Viewport.playerStatus)
      Viewport.playerStatus.playerNameText.text = name;
  };
  window.setPlayerStatusRenderScorebar = (renderScorebar) => {
    if (Viewport.playerStatus)
      Viewport.playerStatus.renderScorebar = renderScorebar;
  };
  window.setPlayerStatusScorebarText = (text) => {
    if (Viewport.playerStatus)
      Viewport.playerStatus.scorebar.textWidget.text = text;
  };
  window.Input = Input;
  window.Viewport = Viewport;

  // src/index.ts
  Input.init();
})();
