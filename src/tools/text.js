import { ToolBase } from './tool-base.js';

export class TextTool extends ToolBase {
  constructor(engine, history, colorManager) {
    super(engine, history, colorManager);
    this._input = null;
  }

  onMouseDown(x, y, e) {
    if (this._input) {
      this._commitText();
      return;
    }
    this._createInput(x, y);
  }

  onMouseMove(x, y, e) {}
  onMouseUp(x, y, e) {}

  _createInput(x, y) {
    const input = document.createElement('textarea');
    input.className = 'canvas-text-input';
    input.style.position = 'absolute';
    input.style.left = `${x * this.engine.zoom}px`;
    input.style.top = `${y * this.engine.zoom}px`;
    input.style.fontSize = `${Math.max(14, this.brushSize * 4) * this.engine.zoom}px`;
    input.style.color = this.colorManager.foreground;
    input.style.fontFamily = 'sans-serif';
    input.style.background = 'transparent';
    input.style.border = `1px dashed var(--accent-orange, #E8854A)`;
    input.style.outline = 'none';
    input.style.resize = 'both';
    input.style.minWidth = '50px';
    input.style.minHeight = '30px';
    input.style.zIndex = '100';
    input.style.padding = '2px 4px';
    input.style.lineHeight = '1.2';

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this._removeInput();
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this._commitText();
      }
    });

    this.engine.canvasStack.appendChild(input);
    input.focus();
    this._input = input;
    this._textX = x;
    this._textY = y;
  }

  _commitText() {
    if (!this._input || !this._input.value.trim()) {
      this._removeInput();
      return;
    }

    this.history.pushSnapshot();
    const ctx = this.engine.mainCtx;
    const fontSize = Math.max(14, this.brushSize * 4);
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = this.colorManager.foreground;
    ctx.textBaseline = 'top';

    const lines = this._input.value.split('\n');
    lines.forEach((line, i) => {
      ctx.fillText(line, this._textX, this._textY + i * fontSize * 1.2);
    });

    this._removeInput();
  }

  _removeInput() {
    if (this._input && this._input.parentNode) {
      this._input.parentNode.removeChild(this._input);
    }
    this._input = null;
  }

  onDeactivate() {
    if (this._input) {
      this._commitText();
    }
    super.onDeactivate();
  }
}
