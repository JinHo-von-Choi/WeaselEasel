import { TOOLS, TOOL_ORDER } from '../utils/constants.js';

/** SVG icon paths for each tool (safe, hardcoded markup — no user input) */
const TOOL_ICONS = {
  pencil:     'M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z',
  eraser:     null,
  fill:       null,
  eyedropper: null,
  line:       null,
  rectangle:  null,
  ellipse:    null,
  text:       null,
  select:     null,
  brush:      null,
};

/** Build an SVG element for a tool icon */
function buildIcon(toolId) {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');

  const iconDefs = {
    pencil: () => {
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', 'M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z');
      svg.appendChild(path);
    },
    brush: () => {
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', 'M18.37 2.63a2.12 2.12 0 0 1 3 3L14 13l-4 1 1-4ZM10 15H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h6');
      svg.appendChild(path);
    },
    eraser: () => {
      const p1 = document.createElementNS(NS, 'path');
      p1.setAttribute('d', 'm7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21');
      const p2 = document.createElementNS(NS, 'path');
      p2.setAttribute('d', 'M22 21H7');
      svg.appendChild(p1);
      svg.appendChild(p2);
    },
    fill: () => {
      const p1 = document.createElementNS(NS, 'path');
      p1.setAttribute('d', 'm19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z');
      const p2 = document.createElementNS(NS, 'path');
      p2.setAttribute('d', 'm5 2 5 5');
      const p3 = document.createElementNS(NS, 'path');
      p3.setAttribute('d', 'M20 14c.5.9 1 2.1 1 3a3 3 0 0 1-6 0c0-.9.5-2.1 1-3l2-3 2 3Z');
      svg.appendChild(p1);
      svg.appendChild(p2);
      svg.appendChild(p3);
    },
    eyedropper: () => {
      const p1 = document.createElementNS(NS, 'path');
      p1.setAttribute('d', 'm2 22 1-1h3l9-9');
      const p2 = document.createElementNS(NS, 'path');
      p2.setAttribute('d', 'M3 21v-3l9-9');
      const p3 = document.createElementNS(NS, 'path');
      p3.setAttribute('d', 'm15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9');
      svg.appendChild(p1);
      svg.appendChild(p2);
      svg.appendChild(p3);
    },
    line: () => {
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', '5');
      line.setAttribute('y1', '19');
      line.setAttribute('x2', '19');
      line.setAttribute('y2', '5');
      svg.appendChild(line);
    },
    rectangle: () => {
      const rect = document.createElementNS(NS, 'rect');
      rect.setAttribute('x', '3');
      rect.setAttribute('y', '3');
      rect.setAttribute('width', '18');
      rect.setAttribute('height', '18');
      rect.setAttribute('rx', '2');
      svg.appendChild(rect);
    },
    ellipse: () => {
      const ellipse = document.createElementNS(NS, 'ellipse');
      ellipse.setAttribute('cx', '12');
      ellipse.setAttribute('cy', '12');
      ellipse.setAttribute('rx', '10');
      ellipse.setAttribute('ry', '7');
      svg.appendChild(ellipse);
    },
    text: () => {
      const p1 = document.createElementNS(NS, 'path');
      p1.setAttribute('d', 'M4 7V4h16v3');
      const p2 = document.createElementNS(NS, 'path');
      p2.setAttribute('d', 'M9 20h6');
      const p3 = document.createElementNS(NS, 'path');
      p3.setAttribute('d', 'M12 4v16');
      svg.appendChild(p1);
      svg.appendChild(p2);
      svg.appendChild(p3);
    },
    select: () => {
      const paths = [
        'M5 3h4', 'M15 3h4', 'M3 5v4', 'M3 15v4',
        'M21 5v4', 'M21 15v4', 'M5 21h4', 'M15 21h4',
      ];
      paths.forEach(d => {
        const p = document.createElementNS(NS, 'path');
        p.setAttribute('d', d);
        svg.appendChild(p);
      });
    },
  };

  if (iconDefs[toolId]) {
    iconDefs[toolId]();
  }

  return svg;
}

export class Toolbar {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById('toolbar-tools');
    this.activeTool = null;
    this._build();
    this._bindOptions();
  }

  _build() {
    TOOL_ORDER.forEach(toolId => {
      const toolDef = Object.values(TOOLS).find(t => t.id === toolId);
      if (!toolDef) return;

      const btn = document.createElement('button');
      btn.className = 'tool-btn';
      btn.dataset.tool = toolId;
      btn.title = `${toolDef.name} (${toolDef.shortName})`;

      const icon = buildIcon(toolId);
      btn.appendChild(icon);

      const label = document.createElement('span');
      label.className = 'tool-btn-label';
      label.textContent = toolDef.name;
      btn.appendChild(label);

      btn.addEventListener('click', () => {
        this.setActive(toolId);
        this.app.setTool(toolId);
      });

      this.container.appendChild(btn);
    });
  }

  setActive(toolId) {
    this.container.querySelectorAll('.tool-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tool === toolId);
    });
    this.activeTool = toolId;
  }

  _bindOptions() {
    const sizeSlider = document.getElementById('brush-size');
    const sizeDisplay = document.getElementById('brush-size-display');
    sizeSlider.addEventListener('input', () => {
      const size = parseInt(sizeSlider.value);
      sizeDisplay.textContent = `${size}px`;
      this.app.setBrushSize(size);
    });

    const fillSelect = document.getElementById('fill-mode');
    fillSelect.addEventListener('change', () => {
      this.app.setFillMode(fillSelect.value);
    });

    document.getElementById('btn-undo').addEventListener('click', () => {
      this.app.executeCommand('undo');
    });
    document.getElementById('btn-redo').addEventListener('click', () => {
      this.app.executeCommand('redo');
    });
    document.getElementById('btn-zoom-in').addEventListener('click', () => {
      this.app.executeCommand('zoomIn');
    });
    document.getElementById('btn-zoom-out').addEventListener('click', () => {
      this.app.executeCommand('zoomOut');
    });

    // Listen for history changes
    window.addEventListener('history-changed', (e) => {
      document.getElementById('btn-undo').disabled = !e.detail.canUndo;
      document.getElementById('btn-redo').disabled = !e.detail.canRedo;
    });
  }
}
