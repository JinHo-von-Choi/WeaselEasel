export const TOOLS = {
  PENCIL:     { id: 'pencil',     name: '연필',   shortName: 'Pencil' },
  BRUSH:      { id: 'brush',      name: '브러시',  shortName: 'Brush' },
  ERASER:     { id: 'eraser',     name: '지우개',  shortName: 'Eraser' },
  FILL:       { id: 'fill',       name: '채우기',  shortName: 'Fill' },
  EYEDROPPER: { id: 'eyedropper', name: '스포이트', shortName: 'Eyedropper' },
  LINE:       { id: 'line',       name: '직선',   shortName: 'Line' },
  RECTANGLE:  { id: 'rectangle',  name: '사각형',  shortName: 'Rectangle' },
  ELLIPSE:    { id: 'ellipse',    name: '타원',   shortName: 'Ellipse' },
  TEXT:       { id: 'text',       name: '텍스트',  shortName: 'Text' },
  SELECT:     { id: 'select',     name: '선택',   shortName: 'Select' },
};

export const TOOL_ORDER = [
  'pencil', 'brush', 'eraser', 'fill', 'eyedropper',
  'line', 'rectangle', 'ellipse', 'text', 'select',
];

export const MENU_ITEMS = {
  file: {
    label: '파일',
    items: [
      { id: 'new',     label: '새로 만들기',       shortcut: '⌘N' },
      { id: 'open',    label: '열기',            shortcut: '⌘O' },
      { type: 'separator' },
      { id: 'save',    label: '저장',            shortcut: '⌘S' },
      { id: 'saveAs',  label: '다른 이름으로 저장', shortcut: '⌘⇧S' },
      { type: 'separator' },
      { id: 'resize',  label: '캔버스 크기 조절',  shortcut: '' },
    ],
  },
  edit: {
    label: '편집',
    items: [
      { id: 'undo',      label: '실행 취소',  shortcut: '⌘Z' },
      { id: 'redo',      label: '다시 실행',  shortcut: '⌘⇧Z' },
      { type: 'separator' },
      { id: 'cut',       label: '잘라내기',  shortcut: '⌘X' },
      { id: 'copy',      label: '복사',     shortcut: '⌘C' },
      { id: 'paste',     label: '붙여넣기',  shortcut: '⌘V' },
      { type: 'separator' },
      { id: 'selectAll', label: '모두 선택',  shortcut: '⌘A' },
      { id: 'clear',     label: '캔버스 지우기', shortcut: '' },
    ],
  },
  view: {
    label: '보기',
    items: [
      { id: 'zoomIn',    label: '확대',     shortcut: '⌘+' },
      { id: 'zoomOut',   label: '축소',     shortcut: '⌘-' },
      { id: 'zoomReset', label: '원본 크기', shortcut: '⌘0' },
    ],
  },
  help: {
    label: '도움말',
    items: [
      { id: 'about', label: 'Weasel Easel', shortcut: '' },
    ],
  },
};

export const DEFAULT_PALETTE = [
  '#000000', '#FFFFFF',
  '#808080', '#C0C0C0',
  '#800000', '#FF0000',
  '#808000', '#FFFF00',
  '#008000', '#00FF00',
  '#008080', '#00FFFF',
  '#000080', '#0000FF',
  '#800080', '#FF00FF',
  '#E74C3C', '#E8854A',
  '#F1C40F', '#27AE60',
  '#3498DB', '#8E44AD',
  '#1ABC9C', '#F39C12',
  '#D35400', '#2C3E50',
  '#7F8C8D', '#ECF0F1',
];

export const ZOOM_LEVELS = [0.25, 0.5, 1, 2, 4, 8];

export const DEFAULT_CANVAS_WIDTH  = 800;
export const DEFAULT_CANVAS_HEIGHT = 600;

export const MAX_HISTORY_BYTES = 256 * 1024 * 1024; // 256MB

export const FILL_MODES = {
  STROKE: 'stroke',
  FILL:   'fill',
  BOTH:   'both',
};
