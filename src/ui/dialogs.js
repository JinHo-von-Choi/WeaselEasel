export class Dialogs {
  constructor(app) {
    this.app = app;
    this.overlay = document.getElementById('dialog-overlay');
    this.container = document.getElementById('dialog-container');
  }

  show(buildFn) {
    this.container.textContent = '';
    buildFn(this.container);
    this.overlay.classList.remove('hidden');

    // Close on overlay click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    // Close button
    this.container.querySelector('.dialog-close')?.addEventListener('click', () => {
      this.close();
    });
  }

  close() {
    this.overlay.classList.add('hidden');
    this.container.textContent = '';
  }

  showAbout() {
    this.show((root) => {
      const header = document.createElement('div');
      header.className = 'dialog-header';

      const title = document.createElement('span');
      title.className = 'dialog-title';
      title.textContent = 'Weasel Easel';
      title.style.flex = '1';
      title.style.textAlign = 'center';
      header.appendChild(title);

      const closeBtn = document.createElement('button');
      closeBtn.className = 'dialog-close';
      closeBtn.textContent = '\u00D7';
      header.appendChild(closeBtn);

      const body = document.createElement('div');
      body.className = 'dialog-body about-dialog';

      const logo = document.createElement('img');
      logo.src = '/logo/logo.png';
      logo.alt = 'Weasel Easel';
      logo.className = 'about-logo';
      body.appendChild(logo);

      const name = document.createElement('div');
      name.className = 'about-name';
      name.textContent = 'Weasel Easel';
      body.appendChild(name);

      const version = document.createElement('div');
      version.className = 'about-version';
      version.textContent = '버전 1.0.0';
      body.appendChild(version);

      const desc = document.createElement('div');
      desc.className = 'about-desc';
      desc.appendChild(document.createTextNode('macOS를 위한 간단한 그림판'));
      desc.appendChild(document.createElement('br'));
      desc.appendChild(document.createElement('br'));
      desc.appendChild(document.createTextNode('made by'));
      desc.appendChild(document.createElement('br'));
      desc.appendChild(document.createTextNode('jinho.von.choi@nerdvana.kr'));
      body.appendChild(desc);

      const footer = document.createElement('div');
      footer.className = 'dialog-footer';

      const okBtn = document.createElement('button');
      okBtn.className = 'dialog-btn primary';
      okBtn.textContent = '확인';
      okBtn.addEventListener('click', () => this.close());
      footer.appendChild(okBtn);

      root.appendChild(header);
      root.appendChild(body);
      root.appendChild(footer);
    });
  }

  showResize() {
    const currentWidth  = this.app.engine.width;
    const currentHeight = this.app.engine.height;

    this.show((root) => {
      const header = document.createElement('div');
      header.className = 'dialog-header';

      const title = document.createElement('span');
      title.className = 'dialog-title';
      title.textContent = '캔버스 크기 조절';
      header.appendChild(title);

      const closeBtn = document.createElement('button');
      closeBtn.className = 'dialog-close';
      closeBtn.textContent = '\u00D7';
      header.appendChild(closeBtn);

      const body = document.createElement('div');
      body.className = 'dialog-body';

      const form = document.createElement('div');
      form.className = 'resize-form';

      const widthLabel = document.createElement('label');
      widthLabel.textContent = '너비 (px)';
      form.appendChild(widthLabel);

      const widthInput = document.createElement('input');
      widthInput.type = 'number';
      widthInput.id = 'resize-width';
      widthInput.value = String(currentWidth);
      widthInput.min = '1';
      widthInput.max = '8000';
      form.appendChild(widthInput);

      const heightLabel = document.createElement('label');
      heightLabel.textContent = '높이 (px)';
      form.appendChild(heightLabel);

      const heightInput = document.createElement('input');
      heightInput.type = 'number';
      heightInput.id = 'resize-height';
      heightInput.value = String(currentHeight);
      heightInput.min = '1';
      heightInput.max = '8000';
      form.appendChild(heightInput);

      body.appendChild(form);

      const footer = document.createElement('div');
      footer.className = 'dialog-footer';

      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'dialog-btn';
      cancelBtn.textContent = '취소';
      cancelBtn.addEventListener('click', () => this.close());
      footer.appendChild(cancelBtn);

      const okBtn = document.createElement('button');
      okBtn.className = 'dialog-btn primary';
      okBtn.textContent = '확인';
      okBtn.addEventListener('click', () => {
        const w = parseInt(widthInput.value);
        const h = parseInt(heightInput.value);
        if (w > 0 && h > 0 && w <= 8000 && h <= 8000) {
          this.app.history.pushSnapshot();
          this.app.engine.resize(w, h);
          this.app.statusBar.updateSize();
          this.close();
        }
      });
      footer.appendChild(okBtn);

      root.appendChild(header);
      root.appendChild(body);
      root.appendChild(footer);
    });
  }
}
