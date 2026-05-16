import { ToolBase } from './tool-base.js';

export class EllipseTool extends ToolBase {
  constructor(engine, history, colorManager) {
    super(engine, history, colorManager);
    this.startX = 0;
    this.startY = 0;
  }

  onMouseDown(x, y, e) {
    this.isDrawing = true;
    this.startX = x;
    this.startY = y;
  }

  onMouseMove(x, y, e) {
    if (!this.isDrawing) return;
    this.engine.clearPreview();
    const ctx = this.engine.previewCtx;
    const cx = (this.startX + x) / 2;
    const cy = (this.startY + y) / 2;
    const rx = Math.abs(x - this.startX) / 2;
    const ry = Math.abs(y - this.startY) / 2;

    if (rx === 0 || ry === 0) return;

    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.lineWidth = this.brushSize;

    if (this.fillMode === 'fill' || this.fillMode === 'both') {
      ctx.fillStyle = this.colorManager.foreground;
      ctx.fill();
    }
    if (this.fillMode === 'stroke' || this.fillMode === 'both') {
      ctx.strokeStyle = this.colorManager.foreground;
      ctx.stroke();
    }
  }

  onMouseUp(x, y, e) {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    const rx = Math.abs(x - this.startX);
    const ry = Math.abs(y - this.startY);
    if (rx > 0 && ry > 0) {
      this.history.pushSnapshot();
      this.engine.commitPreview();
    } else {
      this.engine.clearPreview();
    }
  }
}
