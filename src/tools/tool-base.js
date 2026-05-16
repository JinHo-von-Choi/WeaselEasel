/**
 * Abstract base class for all drawing tools.
 * Subclasses must implement onMouseDown, onMouseMove, onMouseUp.
 */
export class ToolBase {
  constructor(engine, history, colorManager) {
    this.engine       = engine;
    this.history      = history;
    this.colorManager = colorManager;
    this.isDrawing    = false;
    this.brushSize    = 3;
    this.fillMode     = 'stroke'; // 'stroke', 'fill', 'both'
  }

  /** Called when mouse button pressed on canvas */
  onMouseDown(x, y, e) {}

  /** Called when mouse moves over canvas */
  onMouseMove(x, y, e) {}

  /** Called when mouse button released */
  onMouseUp(x, y, e) {}

  /** Called when tool is selected */
  onActivate() {}

  /** Called when tool is deselected */
  onDeactivate() {
    this.isDrawing = false;
  }

  /** Get the cursor CSS for this tool */
  getCursor() {
    return 'crosshair';
  }
}
