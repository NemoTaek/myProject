export const COLS: number = 10;
export const ROWS: number = 20;
export const BLOCK_SIZE: number = 30;
export const LINES_PER_LEVEL: number = 10;

// 키보드 key.code
export const KEY = {
  UP: 'ArrowUp',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  SPACE: 'Space',
  P: 'KeyP'
}

// 블럭 색
export const COLORS = [
  'none',
  'cyan',
  'blue',
  'orange',
  'yellow',
  'green',
  'purple',
  'red'
];

// 블럭 모양
export const SHAPES = [
  [],
  [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  [[2, 0, 0], [2, 2, 2], [0, 0, 0]],
  [[0, 0, 3], [3, 3, 3], [0, 0, 0]],
  [[4, 4], [4, 4]],
  [[0, 5, 5], [5, 5, 0], [0, 0, 0]],
  [[0, 6, 0], [6, 6, 6], [0, 0, 0]],
  [[7, 7, 0], [0, 7, 7], [0, 0, 0]]
];

// 점수
export const POINTS = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1,
  HARD_DROP: 2
};

// 레벨 별 속도
export const LEVEL = {
  0: 800,
  1: 720,
  2: 630,
  3: 550,
  4: 470,
  5: 380,
  6: 300,
  7: 220,
  8: 130,
  9: 100,
  10: 80,
  11: 80,
  12: 80,
  13: 70,
  14: 70,
  15: 70,
  16: 50,
  17: 50,
  18: 50,
  19: 50,
  20: 50,
  21: 30,
  22: 30,
  23: 30,
  24: 30,
  25: 30,
  26: 30,
  27: 30,
  28: 30,
  29: 30,
  30: 30,
  31: 20,
  32: 20,
  33: 20,
  34: 20,
  35: 20,
  36: 20,
  37: 20,
  38: 20,
  39: 20,
  40: 20,
  41: 20,
  42: 20,
  43: 20,
  44: 20,
  45: 20,
  46: 20,
  47: 20,
  48: 20,
  49: 20,
  50: 20,
};

[KEY, COLORS, SHAPES, POINTS, LEVEL].forEach(item => Object.freeze(item));