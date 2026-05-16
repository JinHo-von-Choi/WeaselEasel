export class ColorManager {
  constructor() {
    this.foreground = '#000000';
    this.background = '#FFFFFF';
  }

  setForeground(color) {
    this.foreground = color;
    window.dispatchEvent(new CustomEvent('color-changed', {
      detail: { foreground: this.foreground, background: this.background }
    }));
  }

  setBackground(color) {
    this.background = color;
    window.dispatchEvent(new CustomEvent('color-changed', {
      detail: { foreground: this.foreground, background: this.background }
    }));
  }

  swap() {
    [this.foreground, this.background] = [this.background, this.foreground];
    window.dispatchEvent(new CustomEvent('color-changed', {
      detail: { foreground: this.foreground, background: this.background }
    }));
  }
}
