export const DOC_WIDTH = 1920;
export const DOC_HEIGHT = 1080;
export const DOC_FPS = 30;

export const DOC_SAFE = { top: 54, right: 96, bottom: 54, left: 96 };

export const DOC_CONTENT = {
  x: DOC_SAFE.left,
  y: DOC_SAFE.top,
  width: DOC_WIDTH - DOC_SAFE.left - DOC_SAFE.right,
  height: DOC_HEIGHT - DOC_SAFE.top - DOC_SAFE.bottom,
};

export const DOC_GRID = {
  columns: 12,
  gutter: 24,
  margin: DOC_SAFE.left,
  column: (DOC_CONTENT.width - 11 * 24) / 12,
};

export const DOC_THIRDS = {
  xLeft: Math.round(DOC_WIDTH / 3),
  xRight: Math.round((DOC_WIDTH * 2) / 3),
  yTop: Math.round(DOC_HEIGHT / 3),
  yBottom: Math.round((DOC_HEIGHT * 2) / 3),
};

export const DOC_CAPTION = {
  bottom: 92,
  maxWidth: 1520,
  fontSize: 58,
};

export const DOC_LOWER_THIRD = {
  x: DOC_SAFE.left,
  bottom: 150,
};

export const columnAt = (index: number, span = 1) =>
  DOC_GRID.margin + index * (DOC_GRID.column + DOC_GRID.gutter) + (span * DOC_GRID.column + (span - 1) * DOC_GRID.gutter);

export const spanWidth = (span: number) => span * DOC_GRID.column + (span - 1) * DOC_GRID.gutter;
