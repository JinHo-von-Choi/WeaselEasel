/**
 * Convert viewport (screen) coordinates to canvas pixel coordinates.
 */
export function viewportToCanvas(canvas, clientX, clientY, zoom) {
  const rect = canvas.getBoundingClientRect();
  const x = (clientX - rect.left) / zoom;
  const y = (clientY - rect.top) / zoom;
  return { x: Math.floor(x), y: Math.floor(y) };
}

/**
 * Clamp a value between min and max.
 */
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/**
 * Parse a hex color string to RGBA components.
 */
export function hexToRgba(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = hex.length > 7 ? parseInt(hex.slice(7, 9), 16) : 255;
  return { r, g, b, a };
}

/**
 * Convert RGBA to hex string.
 */
export function rgbaToHex(r, g, b, a = 255) {
  const hex = [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
  return a < 255 ? `#${hex}${a.toString(16).padStart(2, '0')}` : `#${hex}`;
}

/**
 * Check if two RGBA colors match within a tolerance.
 */
export function colorsMatch(c1, c2, tolerance = 0) {
  return Math.abs(c1.r - c2.r) <= tolerance
      && Math.abs(c1.g - c2.g) <= tolerance
      && Math.abs(c1.b - c2.b) <= tolerance
      && Math.abs(c1.a - c2.a) <= tolerance;
}

/**
 * Get pixel color at (x, y) from ImageData.
 */
export function getPixelColor(imageData, x, y) {
  const idx = (y * imageData.width + x) * 4;
  return {
    r: imageData.data[idx],
    g: imageData.data[idx + 1],
    b: imageData.data[idx + 2],
    a: imageData.data[idx + 3],
  };
}

/**
 * Set pixel color at (x, y) in ImageData.
 */
export function setPixelColor(imageData, x, y, color) {
  const idx = (y * imageData.width + x) * 4;
  imageData.data[idx]     = color.r;
  imageData.data[idx + 1] = color.g;
  imageData.data[idx + 2] = color.b;
  imageData.data[idx + 3] = color.a;
}

/**
 * Calculate distance between two points.
 */
export function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}
