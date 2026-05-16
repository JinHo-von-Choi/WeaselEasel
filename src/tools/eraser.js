import { ToolBase } from './tool-base.js';

export class EraserTool extends ToolBase {
  onMouseDown(x, y, e) {
    this.history.pushSnapshot();
    this.isDrawing = true;
    const ctx = this.engine.mainCtx;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = this.brushSize * 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
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
  }

  getCursor() {
    return 'cell';
  }
}
