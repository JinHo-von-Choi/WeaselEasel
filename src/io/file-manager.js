import { open, save } from '@tauri-apps/plugin-dialog';
import { readFile, writeFile } from '@tauri-apps/plugin-fs';

export class FileManager {
  constructor(app) {
    this.app = app;
    this.currentPath = null;
  }

  async openFile() {
    const path = await open({
      multiple: false,
      filters: [{
        name: '이미지',
        extensions: ['png', 'jpg', 'jpeg', 'bmp', 'webp'],
      }],
    });

    if (!path) return;

    const data = await readFile(path);
    const blob = new Blob([data]);
    const bitmap = await createImageBitmap(blob);

    this.app.history.clear();
    this.app.engine.loadImage(bitmap);
    this.app.statusBar.updateSize();
    this.currentPath = path;
    this._updateTitle(path);
  }

  async saveFile() {
    if (this.currentPath) {
      await this._writeToPath(this.currentPath);
    } else {
      await this.saveFileAs();
    }
  }

  async saveFileAs() {
    const path = await save({
      filters: [
        { name: 'PNG', extensions: ['png'] },
        { name: 'JPEG', extensions: ['jpg', 'jpeg'] },
      ],
    });

    if (!path) return;

    await this._writeToPath(path);
    this.currentPath = path;
    this._updateTitle(path);
  }

  async _writeToPath(path) {
    const isJpeg = /\.jpe?g$/i.test(path);
    const mimeType = isJpeg ? 'image/jpeg' : 'image/png';
    const quality = isJpeg ? 0.92 : undefined;

    const blob = await this.app.engine.toBlob(mimeType, quality);
    const buffer = await blob.arrayBuffer();
    await writeFile(path, new Uint8Array(buffer));
  }

  _updateTitle(path) {
    const name = path.split('/').pop();
    document.title = `${name} - Weasel Easel`;
    const win = document.querySelector('title');
    if (win) win.textContent = `${name} - Weasel Easel`;
  }

  newFile() {
    this.app.history.clear();
    this.app.engine.clear();
    this.currentPath = null;
    document.title = '제목 없음 - Weasel Easel';
  }
}
