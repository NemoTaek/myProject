import { COLS, ROWS, BLOCK_SIZE, COLORS } from './constant'
import Piece from './piece'

interface board {
  ctx: any;
  reset(): void;
  getEmptyGrid(): any;
  valid(p: any): any;
  rotate(p: any): any;
}

class Board implements board {
  grid: any;
  piece: Piece;

  constructor(public ctx: any) {
    this.ctx = ctx;
    this.init();
  }

  // 맵, 블럭 크기 세팅
  init() {
    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;
    this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  // 새 게임이 시작되면 맵 초기화
  reset() {
    this.grid = this.getEmptyGrid();
    this.piece = new Piece(this.ctx);
    this.piece.setStartingPosition();
  }

  // 0으로 채워진 행렬
  getEmptyGrid() {
    return Array.from(
      { length: ROWS }, () => Array(COLS).fill(0)
    );
  }

  // 조각 그리기
  drawPiece() {
    this.piece.draw();
    this.drawBoard();
  }
  drawBoard() {
    this.grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillStyle = COLORS[value];
          this.ctx.fillRect(x, y, 1, 1);
        }
      });
    });
  }

  // 좌우 벽 내의 충돌 감지
  insideWalls(x: number) {
    return x >= 0 && x < COLS;
  }

  // 바닥 충돌 감지
  aboveFloor(y: number) {
    return y < ROWS;
  }

  // 충돌 검사 함수
  valid(p: any) {
    return p.shape.every((row, dy) => {
      return row.every((value, dx) => {
        let x = p.x + dx;
        let y = p.y + dy;
        return (
          value === 0 ||
          (this.insideWalls(x) && this.aboveFloor(y))
        );
      });
    });
  }

  // 블록 회전 함수
  rotate(p: any) {
    // 행렬을 사용하여 시계방향으로 90도 회전 방법: 
    // 전치행렬로 기존 행렬의 행과 열을 바꾸고,
    // [0,0,1]
    // [0,1,0] 을 곱하여 열 기준 대칭
    // [1,0,0]
    for (let y = 0; y < p.shape.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
      }
    }

    // 열 기준 대칭
    p.shape.forEach(row => row.reverse());
    return p;
  }
}

export default Board;