export class Selection {
  constructor(engine) {
    this.engine = engine;
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.imageData = null;
    this._animFrame = null;
  }

  set(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.active = true;
    this._startMarchingAnts();
  }

  capture() {
    if (!this.active) return null;
    this.imageData = this.engine.mainCtx.getImageData(
      this.x, this.y, this.width, this.height
    );
    return this.imageData;
  }

  clear() {
    this.active = false;
    this.imageData = null;
    this.engine.clearUI();
    if (this._animFrame) {
      cancelAnimationFrame(this._animFrame);
      this._animFrame = null;
    }
  }

  deleteSelection(history) {
    if (!this.active) return;
    history.pushSnapshot();
    this.engine.mainCtx.fillStyle = '#FFFFFF';
    this.engine.mainCtx.fillRect(this.x, this.y, this.width, this.height);
  }

  _startMarchingAnts() {
    let offset = 0;
    const draw = () => {
      if (!this.active) return;
      this.engine.clearUI();
      const ctx = this.engine.uiCtx;
      ctx.setLineDash([6, 4]);
      ctx.lineDashOffset = -offset;
      ctx.strokeStyle = '#3498DB';
      ctx.lineWidth = 1;
      ctx.strokeRect(this.x + 0.5, this.y + 0.5, this.width - 1, this.height - 1);
      // Second pass with white for contrast
      ctx.lineDashOffset = -(offset + 5);
      ctx.strokeStyle = '#FFFFFF';
      ctx.strokeRect(this.x + 0.5, this.y + 0.5, this.width - 1, this.height - 1);
      ctx.setLineDash([]);
      offset = (offset + 0.5) % 10;
      this._animFrame = requestAnimationFrame(draw);
    };
    draw();
  }
}
