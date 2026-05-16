/**
 * Utility for canvas-to-blob conversion.
 * Used by FileManager for save operations.
 */
export function canvasToBlob(canvas, type = 'image/png', quality = 0.92) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}
