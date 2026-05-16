export class StatusBar {
  constructor(engine) {
    this.engine = engine;
    this.coordsEl = document.getElementById('status-coords');
    this.sizeEl   = document.getElementById('status-size');
    this.zoomEl   = document.getElementById('status-zoom');
    this.toolEl   = document.getElementById('status-tool');
    this.updateSize();
  }

  updateCoords(x, y) {
    this.coordsEl.textContent = `좌표: (${x}, ${y})`;
  }

  updateSize() {
    this.sizeEl.textContent = `${this.engine.width} \u00D7 ${this.engine.height}`;
  }

  updateZoom(zoom) {
    const pct = Math.round(zoom * 100);
    this.zoomEl.textContent = `${pct}%`;
    document.getElementById('zoom-display').textContent = `${pct}%`;
  }

  updateTool(toolName) {
    this.toolEl.textContent = toolName;
  }
}
