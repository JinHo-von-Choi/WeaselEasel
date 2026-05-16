import { CanvasEngine }   from './core/canvas-engine.js';
import { History }        from './core/history.js';
import { ColorManager }   from './core/color-manager.js';
import { Selection }      from './core/selection.js';

import { PencilTool }     from './tools/pencil.js';
import { BrushTool }      from './tools/brush.js';
import { EraserTool }     from './tools/eraser.js';
import { LineTool }       from './tools/line.js';
import { RectangleTool }  from './tools/rectangle.js';
import { EllipseTool }    from './tools/ellipse.js';
import { TextTool }       from './tools/text.js';
import { FillTool }       from './tools/fill.js';
import { EyedropperTool } from './tools/eyedropper.js';
import { SelectTool }     from './tools/select.js';

import { MenuBar }        from './ui/menu-bar.js';
import { Toolbar }        from './ui/toolbar.js';
import { ColorPalette }   from './ui/color-palette.js';
import { StatusBar }      from './ui/status-bar.js';
import { Dialogs }        from './ui/dialogs.js';

import { FileManager }    from './io/file-manager.js';

import { TOOLS } from './utils/constants.js';

class WeaselEaselApp {
  constructor() {
    // Core
    this.engine       = new CanvasEngine();
    this.history      = new History(this.engine);
    this.colorManager = new ColorManager();
    this.selection    = new Selection(this.engine);

    // Tools
    this.tools = {
      pencil:     new PencilTool(this.engine, this.history, this.colorManager),
      brush:      new BrushTool(this.engine, this.history, this.colorManager),
      eraser:     new EraserTool(this.engine, this.history, this.colorManager),
      line:       new LineTool(this.engine, this.history, this.colorManager),
      rectangle:  new RectangleTool(this.engine, this.history, this.colorManager),
      ellipse:    new EllipseTool(this.engine, this.history, this.colorManager),
      text:       new TextTool(this.engine, this.history, this.colorManager),
      fill:       new FillTool(this.engine, this.history, this.colorManager),
      eyedropper: new EyedropperTool(this.engine, this.history, this.colorManager),
      select:     new SelectTool(this.engine, this.history, this.colorManager, this.selection),
    };

    this.currentTool = this.tools.pencil;

    // UI
    this.menuBar      = new MenuBar(this);
    this.toolbar      = new Toolbar(this);
    this.colorPalette = new ColorPalette(this.colorManager);
    this.statusBar    = new StatusBar(this.engine);
    this.dialogs      = new Dialogs(this);

    // I/O
    this.fileManager = new FileManager(this);

    // Set initial tool
    this.setTool('pencil');

    // Bind canvas events
    this._bindCanvasEvents();
    this._bindKeyboardShortcuts();

    // Prevent context menu on canvas
    this.engine.uiCanvas.addEventListener('contextmenu', e => e.preventDefault());
  }

  setTool(toolId) {
    if (this.currentTool) {
      this.currentTool.onDeactivate();
    }

    this.currentTool = this.tools[toolId];
    if (this.currentTool) {
      this.currentTool.onActivate();
      this.engine.uiCanvas.style.cursor = this.currentTool.getCursor();
      this.toolbar.setActive(toolId);

      const toolDef = Object.values(TOOLS).find(t => t.id === toolId);
      if (toolDef) {
        this.statusBar.updateTool(toolDef.name);
      }
    }
  }

  setBrushSize(size) {
    Object.values(this.tools).forEach(tool => {
      tool.brushSize = size;
    });
  }

  setFillMode(mode) {
    Object.values(this.tools).forEach(tool => {
      tool.fillMode = mode;
    });
  }

  executeCommand(cmd) {
    switch (cmd) {
      case 'new':
        this.fileManager.newFile();
        break;
      case 'open':
        this.fileManager.openFile();
        break;
      case 'save':
        this.fileManager.saveFile();
        break;
      case 'saveAs':
        this.fileManager.saveFileAs();
        break;
      case 'undo':
        this.history.undo();
        break;
      case 'redo':
        this.history.redo();
        break;
      case 'selectAll':
        this.setTool('select');
        this.selection.set(0, 0, this.engine.width, this.engine.height);
        break;
      case 'cut':
        if (this.selection.active) {
          this.selection.capture();
          this.selection.deleteSelection(this.history);
        }
        break;
      case 'copy':
        if (this.selection.active) {
          this.selection.capture();
        }
        break;
      case 'paste':
        if (this.selection.imageData) {
          this.history.pushSnapshot();
          this.engine.mainCtx.putImageData(this.selection.imageData, 0, 0);
        }
        break;
      case 'clear':
        this.history.pushSnapshot();
        this.engine.clear();
        break;
      case 'zoomIn': {
        const z1 = this.engine.zoomIn();
        this.statusBar.updateZoom(z1);
        break;
      }
      case 'zoomOut': {
        const z2 = this.engine.zoomOut();
        this.statusBar.updateZoom(z2);
        break;
      }
      case 'zoomReset': {
        const z3 = this.engine.zoomReset();
        this.statusBar.updateZoom(z3);
        break;
      }
      case 'resize':
        this.dialogs.showResize();
        break;
      case 'about':
        this.dialogs.showAbout();
        break;
    }
  }

  _bindCanvasEvents() {
    const uiCanvas = this.engine.uiCanvas;

    uiCanvas.addEventListener('mousedown', (e) => {
      const { x, y } = this.engine.getCanvasCoords(e);
      this.currentTool.onMouseDown(x, y, e);
    });

    uiCanvas.addEventListener('mousemove', (e) => {
      const { x, y } = this.engine.getCanvasCoords(e);
      this.statusBar.updateCoords(x, y);
      this.currentTool.onMouseMove(x, y, e);
    });

    uiCanvas.addEventListener('mouseup', (e) => {
      const { x, y } = this.engine.getCanvasCoords(e);
      this.currentTool.onMouseUp(x, y, e);
    });

    // Handle mouse leaving canvas
    uiCanvas.addEventListener('mouseleave', (e) => {
      if (this.currentTool.isDrawing) {
        const { x, y } = this.engine.getCanvasCoords(e);
        this.currentTool.onMouseUp(x, y, e);
      }
    });
  }

  _bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      const cmd = e.metaKey || e.ctrlKey;

      if (cmd && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.executeCommand('undo');
      } else if (cmd && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        this.executeCommand('redo');
      } else if (cmd && e.key === 'n') {
        e.preventDefault();
        this.executeCommand('new');
      } else if (cmd && e.key === 'o') {
        e.preventDefault();
        this.executeCommand('open');
      } else if (cmd && e.key === 's' && !e.shiftKey) {
        e.preventDefault();
        this.executeCommand('save');
      } else if (cmd && e.key === 's' && e.shiftKey) {
        e.preventDefault();
        this.executeCommand('saveAs');
      } else if (cmd && e.key === 'a') {
        e.preventDefault();
        this.executeCommand('selectAll');
      } else if (cmd && e.key === 'c') {
        e.preventDefault();
        this.executeCommand('copy');
      } else if (cmd && e.key === 'x') {
        e.preventDefault();
        this.executeCommand('cut');
      } else if (cmd && e.key === 'v') {
        e.preventDefault();
        this.executeCommand('paste');
      } else if (cmd && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        this.executeCommand('zoomIn');
      } else if (cmd && e.key === '-') {
        e.preventDefault();
        this.executeCommand('zoomOut');
      } else if (cmd && e.key === '0') {
        e.preventDefault();
        this.executeCommand('zoomReset');
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (this.selection.active && !e.target.closest('input, textarea')) {
          e.preventDefault();
          this.selection.deleteSelection(this.history);
          this.selection.clear();
        }
      }
    });
  }
}

// Initialize when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.app = new WeaselEaselApp();
});
