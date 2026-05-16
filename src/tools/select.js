import { ToolBase } from './tool-base.js';

export class SelectTool extends ToolBase {
  constructor(engine, history, colorManager, selection) {
    super(engine, history, colorManager);
    this.selection = selection;
    this.startX = 0;
    this.startY = 0;
    this._isMoving = false;
    this._moveOffsetX = 0;
    this._moveOffsetY = 0;
    this._movedImageData = null;
  }

  onMouseDown(x, y, e) {
    // If clicking inside existing selection, start moving
    if (this.selection.active &&
        x >= this.selection.x && x < this.selection.x + this.selection.width &&
        y >= this.selection.y && y < this.selection.y + this.selection.height) {
      this._isMoving = true;
      this._moveOffsetX = x - this.selection.x;
      this._moveOffsetY = y - this.selection.y;
      if (!this._movedImageData) {
        this.history.pushSnapshot();
        this._movedImageData = this.selection.capture();
        // Clear original area
        this.engine.mainCtx.fillStyle = '#FFFFFF';
        this.engine.mainCtx.fillRect(
          this.selection.x, this.selection.y,
          this.selection.width, this.selection.height
        );
      }
      return;
    }

    // Start new selection
    if (this._movedImageData) {
      this._commitMove();
    }
    this.selection.clear();
    this.isDrawing = true;
    this.startX = x;
    this.startY = y;
  }

  onMouseMove(x, y, e) {
    if (this._isMoving && this._movedImageData) {
      // Move selection
      this.engine.clearPreview();
      const newX = x - this._moveOffsetX;
      const newY = y - this._moveOffsetY;
      this.selection.x = newX;
      this.selection.y = newY;

      // Draw on preview
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = this.selection.width;
      tempCanvas.height = this.selection.height;
      tempCanvas.getContext('2d').putImageData(this._movedImageData, 0, 0);
      this.engine.previewCtx.drawImage(tempCanvas, newX, newY);
      this.selection.set(newX, newY, this.selection.width, this.selection.height);
      return;
    }

    if (!this.isDrawing) return;

    // Draw selection rectangle on UI canvas
    this.engine.clearUI();
    const rx = Math.min(this.startX, x);
    const ry = Math.min(this.startY, y);
    const rw = Math.abs(x - this.startX);
    const rh = Math.abs(y - this.startY);

    if (rw > 0 && rh > 0) {
      const ctx = this.engine.uiCtx;
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = '#3498DB';
      ctx.lineWidth = 1;
      ctx.strokeRect(rx + 0.5, ry + 0.5, rw - 1, rh - 1);
      ctx.setLineDash([]);
    }
  }

  onMouseUp(x, y, e) {
    if (this._isMoving) {
      this._isMoving = false;
      return;
    }

    if (!this.isDrawing) return;
    this.isDrawing = false;

    const rx = Math.min(this.startX, x);
    const ry = Math.min(this.startY, y);
    const rw = Math.abs(x - this.startX);
    const rh = Math.abs(y - this.startY);

    if (rw > 2 && rh > 2) {
      this.selection.set(rx, ry, rw, rh);
    } else {
      this.selection.clear();
    }
  }

  _commitMove() {
    if (this._movedImageData) {
      this.engine.commitPreview();
      this._movedImageData = null;
    }
  }

  onDeactivate() {
    if (this._movedImageData) {
      this._commitMove();
    }
    this.selection.clear();
    super.onDeactivate();
  }

  getCursor() {
    return 'default';
  }
}
