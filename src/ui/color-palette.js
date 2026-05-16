import { DEFAULT_PALETTE } from '../utils/constants.js';

export class ColorPalette {
  constructor(colorManager) {
    this.colorManager = colorManager;
    this.container = document.getElementById('color-palette');
    this.fgPreview = document.getElementById('fg-color-preview');
    this.bgPreview = document.getElementById('bg-color-preview');
    this._build();
    this._bindEvents();
  }

  _build() {
    DEFAULT_PALETTE.forEach(color => {
      const swatch = document.createElement('div');
      swatch.className = 'palette-color';
      swatch.style.background = color;
      swatch.title = color;

      // Left click → foreground, Right click → background
      swatch.addEventListener('click', () => {
        this.colorManager.setForeground(color);
      });
      swatch.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        this.colorManager.setBackground(color);
      });

      this.container.appendChild(swatch);
    });
  }

  _bindEvents() {
    // Custom color picker
    const picker = document.getElementById('custom-color-picker');
    picker.addEventListener('input', () => {
      this.colorManager.setForeground(picker.value);
    });

    // Swap button
    document.getElementById('swap-colors').addEventListener('click', () => {
      this.colorManager.swap();
    });

    // FG/BG preview clicks
    this.fgPreview.addEventListener('click', () => {
      picker.value = this.colorManager.foreground;
      picker.click();
    });

    this.bgPreview.addEventListener('click', () => {
      const current = this.colorManager.background;
      picker.value = current;
      const handler = () => {
        this.colorManager.setBackground(picker.value);
        picker.removeEventListener('input', handler);
      };
      picker.addEventListener('input', handler);
      picker.click();
    });

    // Listen for color changes
    window.addEventListener('color-changed', (e) => {
      this._updatePreviews(e.detail);
    });

    // Initial update
    this._updatePreviews({
      foreground: this.colorManager.foreground,
      background: this.colorManager.background,
    });
  }

  _updatePreviews({ foreground, background }) {
    this.fgPreview.style.background = foreground;
    this.bgPreview.style.background = background;
  }
}
