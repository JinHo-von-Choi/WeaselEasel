import { ToolBase } from './tool-base.js';

export class LineTool extends ToolBase {
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
    ctx.strokeStyle = this.colorManager.foreground;
    ctx.lineWidth = this.brushSize;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  onMouseUp(x, y, e) {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    if (this.startX !== x || this.startY !== y) {
      this.history.pushSnapshot();
      this.engine.commitPreview();
    } else {
      this.engine.clearPreview();
    }
  }
}
