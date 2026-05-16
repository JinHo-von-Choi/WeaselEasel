import { ToolBase } from './tool-base.js';

export class BrushTool extends ToolBase {
  onMouseDown(x, y, e) {
    this.history.pushSnapshot();
    this.isDrawing = true;
    const ctx = this.engine.mainCtx;
    ctx.strokeStyle = e.button === 2 ? this.colorManager.background : this.colorManager.foreground;
    ctx.lineWidth = this.brushSize * 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  onMouseMove(x, y, e) {
    if (!this.isDrawing) return;
    const ctx = this.engine.mainCtx;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  onMouseUp(x, y, e) {
    this.isDrawing = false;
    this.engine.mainCtx.globalAlpha = 1.0;
  }
}
