import { MAX_HISTORY_BYTES } from '../utils/constants.js';

export class History {
  constructor(engine) {
    this.engine    = engine;
    this.undoStack = [];
    this.redoStack = [];
    this.totalBytes = 0;
  }

  get maxSteps() {
    const snapshotSize = this.engine.width * this.engine.height * 4;
    return Math.max(5, Math.floor(MAX_HISTORY_BYTES / snapshotSize));
  }

  pushSnapshot() {
    const snapshot = this.engine.mainCtx.getImageData(
      0, 0, this.engine.width, this.engine.height
    );
    const size = snapshot.data.byteLength;

    this.undoStack.push({ snapshot, size });
    this.totalBytes += size;

    // Clear redo on new action
    this.redoStack.forEach(entry => this.totalBytes -= entry.size);
    this.redoStack = [];

    // Trim oldest if over budget
    while (this.totalBytes > MAX_HISTORY_BYTES && this.undoStack.length > 1) {
      const removed = this.undoStack.shift();
      this.totalBytes -= removed.size;
    }

    this._dispatch();
  }

  undo() {
    if (this.undoStack.length === 0) return false;

    // Save current state to redo
    const current = this.engine.mainCtx.getImageData(
      0, 0, this.engine.width, this.engine.height
    );
    const currentSize = current.data.byteLength;
    this.redoStack.push({ snapshot: current, size: currentSize });
    this.totalBytes += currentSize;

    // Restore previous state
    const entry = this.undoStack.pop();
    this.totalBytes -= entry.size;
    this.engine.mainCtx.putImageData(entry.snapshot, 0, 0);

    this._dispatch();
    return true;
  }

  redo() {
    if (this.redoStack.length === 0) return false;

    // Save current state to undo
    const current = this.engine.mainCtx.getImageData(
      0, 0, this.engine.width, this.engine.height
    );
    const currentSize = current.data.byteLength;
    this.undoStack.push({ snapshot: current, size: currentSize });
    this.totalBytes += currentSize;

    // Restore redo state
    const entry = this.redoStack.pop();
    this.totalBytes -= entry.size;
    this.engine.mainCtx.putImageData(entry.snapshot, 0, 0);

    this._dispatch();
    return true;
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
    this.totalBytes = 0;
    this._dispatch();
  }

  _dispatch() {
    window.dispatchEvent(new CustomEvent('history-changed', {
      detail: {
        canUndo: this.undoStack.length > 0,
        canRedo: this.redoStack.length > 0,
        steps: this.undoStack.length,
        maxSteps: this.maxSteps,
      }
    }));
  }
}
