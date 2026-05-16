import { ToolBase } from './tool-base.js';
import { rgbaToHex, getPixelColor } from '../utils/helpers.js';

export class EyedropperTool extends ToolBase {
  onMouseDown(x, y, e) {
    this._pickColor(x, y, e);
  }

  onMouseMove(x, y, e) {
    if (e.buttons > 0) {
      this._pickColor(x, y, e);
    }
  }

  onMouseUp(x, y, e) {}

  _pickColor(x, y, e) {
    if (x < 0 || y < 0 || x >= this.engine.width || y >= this.engine.height) return;

    const imageData = this.engine.mainCtx.getImageData(x, y, 1, 1);
    const color = rgbaToHex(imageData.data[0], imageData.data[1], imageData.data[2]);

    if (e.button === 2) {
      this.colorManager.setBackground(color);
    } else {
      this.colorManager.setForeground(color);
    }
  }

  getCursor() {
    return 'crosshair';
  }
}
