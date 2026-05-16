import { ToolBase } from './tool-base.js';

export class RectangleTool extends ToolBase {
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
    const rx = Math.min(this.startX, x);
    const ry = Math.min(this.startY, y);
    const rw = Math.abs(x - this.startX);
    const rh = Math.abs(y - this.startY);

    if (rw === 0 || rh === 0) return;

    ctx.lineWidth = this.brushSize;

    if (this.fillMode === 'fill' || this.fillMode === 'both') {
      ctx.fillStyle = this.colorManager.foreground;
      ctx.fillRect(rx, ry, rw, rh);
    }
    if (this.fillMode === 'stroke' || this.fillMode === 'both') {
      ctx.strokeStyle = this.colorManager.foreground;
      ctx.strokeRect(rx, ry, rw, rh);
    }
  }

  onMouseUp(x, y, e) {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    const rw = Math.abs(x - this.startX);
    const rh = Math.abs(y - this.startY);
    if (rw > 0 && rh > 0) {
      this.history.pushSnapshot();
      this.engine.commitPreview();
    } else {
      this.engine.clearPreview();
    }
  }
}
