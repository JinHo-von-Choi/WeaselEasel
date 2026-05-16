import { ToolBase } from './tool-base.js';
import { hexToRgba, getPixelColor, setPixelColor, colorsMatch } from '../utils/helpers.js';

export class FillTool extends ToolBase {
  onMouseDown(x, y, e) {
    if (x < 0 || y < 0 || x >= this.engine.width || y >= this.engine.height) return;

    const fillColor = hexToRgba(
      e.button === 2 ? this.colorManager.background : this.colorManager.foreground
    );
    const imageData = this.engine.mainCtx.getImageData(
      0, 0, this.engine.width, this.engine.height
    );
    const targetColor = getPixelColor(imageData, x, y);

    // If same color, do nothing
    if (colorsMatch(targetColor, fillColor)) return;

    this.history.pushSnapshot();
    this._scanlineFill(imageData, x, y, targetColor, fillColor);
    this.engine.mainCtx.putImageData(imageData, 0, 0);
  }

  onMouseMove() {}
  onMouseUp() {}

  _scanlineFill(imageData, startX, startY, targetColor, fillColor) {
    const w = imageData.width;
    const h = imageData.height;
    const stack = [{ x: startX, y: startY }];
    const tolerance = 10;

    while (stack.length > 0) {
      let { x, y } = stack.pop();

      // Scan up to find topmost matching pixel in this column
      while (y >= 0 && colorsMatch(getPixelColor(imageData, x, y), targetColor, tolerance)) {
        y--;
      }
      y++; // Back to first matching

      let reachLeft = false;
      let reachRight = false;

      // Scan down, filling pixels
      while (y < h && colorsMatch(getPixelColor(imageData, x, y), targetColor, tolerance)) {
        setPixelColor(imageData, x, y, fillColor);

        // Check left neighbor
        if (x > 0) {
          const leftMatch = colorsMatch(getPixelColor(imageData, x - 1, y), targetColor, tolerance);
          if (!reachLeft && leftMatch) {
            stack.push({ x: x - 1, y });
            reachLeft = true;
          } else if (reachLeft && !leftMatch) {
            reachLeft = false;
          }
        }

        // Check right neighbor
        if (x < w - 1) {
          const rightMatch = colorsMatch(getPixelColor(imageData, x + 1, y), targetColor, tolerance);
          if (!reachRight && rightMatch) {
            stack.push({ x: x + 1, y });
            reachRight = true;
          } else if (reachRight && !rightMatch) {
            reachRight = false;
          }
        }

        y++;
      }
    }
  }

  getCursor() {
    return 'crosshair';
  }
}
