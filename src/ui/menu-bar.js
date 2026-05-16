import { MENU_ITEMS } from '../utils/constants.js';

export class MenuBar {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById('menu-items');
    this.activeMenu = null;
    this._build();
    this._bindGlobal();
  }

  _build() {
    Object.entries(MENU_ITEMS).forEach(([key, menu]) => {
      const item = document.createElement('div');
      item.className = 'menu-item';
      item.textContent = menu.label;
      item.dataset.menu = key;

      item.addEventListener('click', (e) => {
        e.stopPropagation();
        this._toggleMenu(key, item);
      });

      item.addEventListener('mouseenter', () => {
        if (this.activeMenu && this.activeMenu !== key) {
          this._toggleMenu(key, item);
        }
      });

      this.container.appendChild(item);
    });

    // Logo click → about
    document.querySelector('.menu-logo')?.addEventListener('click', () => {
      this.app.executeCommand('about');
    });

    document.addEventListener('click', () => this._closeAll());
  }

  _toggleMenu(key, element) {
    this._closeAll();

    const menu = MENU_ITEMS[key];
    this.activeMenu = key;
    element.classList.add('active');

    const dropdown = document.createElement('div');
    dropdown.className = 'menu-dropdown';

    menu.items.forEach(item => {
      if (item.type === 'separator') {
        const sep = document.createElement('div');
        sep.className = 'menu-dropdown-separator';
        dropdown.appendChild(sep);
        return;
      }

      const row = document.createElement('div');
      row.className = 'menu-dropdown-item';

      const labelSpan = document.createElement('span');
      labelSpan.textContent = item.label;
      row.appendChild(labelSpan);

      if (item.shortcut) {
        const shortcutSpan = document.createElement('span');
        shortcutSpan.className = 'menu-dropdown-shortcut';
        shortcutSpan.textContent = item.shortcut;
        row.appendChild(shortcutSpan);
      }

      row.addEventListener('click', (e) => {
        e.stopPropagation();
        this._closeAll();
        this.app.executeCommand(item.id);
      });
      dropdown.appendChild(row);
    });

    element.appendChild(dropdown);
  }

  _closeAll() {
    this.activeMenu = null;
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.menu-dropdown').forEach(el => el.remove());
  }

  _bindGlobal() {
    // Not used here - keyboard shortcuts are in main.js
  }
}
