import { DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT, ZOOM_LEVELS } from '../utils/constants.js';
import { viewportToCanvas } from '../utils/helpers.js';

export class CanvasEngine {
  constructor() {
    this.mainCanvas    = document.getElementById('main-canvas');
    this.previewCanvas = document.getElementById('preview-canvas');
    this.uiCanvas      = document.getElementById('ui-canvas');
    this.mainCtx       = this.mainCanvas.getContext('2d');
    this.previewCtx    = this.previewCanvas.getContext('2d');
    this.uiCtx         = this.uiCanvas.getContext('2d');

    this.canvasStack = document.getElementById('canvas-stack');
    this.canvasSizer = document.getElementById('canvas-sizer');
    this.viewport    = document.getElementById('canvas-viewport');

    this.width  = DEFAULT_CANVAS_WIDTH;
    this.height = DEFAULT_CANVAS_HEIGHT;
    this.zoom   = 1;
    this.zoomIndex = ZOOM_LEVELS.indexOf(1);

    this._initCanvases();
  }

  _initCanvases() {
    [this.mainCanvas, this.previewCanvas, this.uiCanvas].forEach(c => {
      c.width  = this.width;
      c.height = this.height;
    });
    // Fill main canvas with white
    this.mainCtx.fillStyle = '#FFFFFF';
    this.mainCtx.fillRect(0, 0, this.width, this.height);
    this._updateSizer();
  }

  _updateSizer() {
    const w = this.width * this.zoom;
    const h = this.height * this.zoom;
    this.canvasSizer.style.width  = `${w}px`;
    this.canvasSizer.style.height = `${h}px`;
    this.canvasStack.style.transform = `scale(${this.zoom})`;
  }

  /** Convert mouse event to canvas coordinates */
  getCanvasCoords(e) {
    return viewportToCanvas(this.uiCanvas, e.clientX, e.clientY, this.zoom);
  }

  /** Composite preview onto main, then clear preview */
  commitPreview() {
    this.mainCtx.drawImage(this.previewCanvas, 0, 0);
    this.clearPreview();
  }

  clearPreview() {
    this.previewCtx.clearRect(0, 0, this.width, this.height);
  }

  clearUI() {
    this.uiCtx.clearRect(0, 0, this.width, this.height);
  }

  /** Zoom in */
  zoomIn() {
    if (this.zoomIndex < ZOOM_LEVELS.length - 1) {
      this.zoomIndex++;
      this.zoom = ZOOM_LEVELS[this.zoomIndex];
      this._updateSizer();
    }
    return this.zoom;
  }

  /** Zoom out */
  zoomOut() {
    if (this.zoomIndex > 0) {
      this.zoomIndex--;
      this.zoom = ZOOM_LEVELS[this.zoomIndex];
      this._updateSizer();
    }
    return this.zoom;
  }

  /** Reset zoom to 100% */
  zoomReset() {
    this.zoomIndex = ZOOM_LEVELS.indexOf(1);
    this.zoom = 1;
    this._updateSizer();
    return this.zoom;
  }

  /** Resize canvas (preserving content) */
  resize(newWidth, newHeight) {
    // Save current content
    const imageData = this.mainCtx.getImageData(0, 0, this.width, this.height);

    this.width  = newWidth;
    this.height = newHeight;

    [this.mainCanvas, this.previewCanvas, this.uiCanvas].forEach(c => {
      c.width  = newWidth;
      c.height = newHeight;
    });

    // Fill with white then restore
    this.mainCtx.fillStyle = '#FFFFFF';
    this.mainCtx.fillRect(0, 0, newWidth, newHeight);
    this.mainCtx.putImageData(imageData, 0, 0);

    this._updateSizer();
  }

  /** Clear canvas to white (for "new") */
  clear() {
    this.mainCtx.fillStyle = '#FFFFFF';
    this.mainCtx.fillRect(0, 0, this.width, this.height);
    this.clearPreview();
    this.clearUI();
  }

  /** Load an image onto the canvas */
  loadImage(imageBitmap) {
    this.width  = imageBitmap.width;
    this.height = imageBitmap.height;

    [this.mainCanvas, this.previewCanvas, this.uiCanvas].forEach(c => {
      c.width  = imageBitmap.width;
      c.height = imageBitmap.height;
    });

    this.mainCtx.drawImage(imageBitmap, 0, 0);
    this._updateSizer();
  }

  /** Get main canvas as Blob */
  async toBlob(type = 'image/png', quality = 0.92) {
    return new Promise(resolve => this.mainCanvas.toBlob(resolve, type, quality));
  }
}
