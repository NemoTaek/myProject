import { COLS, ROWS, BLOCK_SIZE, LINES_PER_LEVEL, COLORS, KEY, POINTS, LEVEL } from './constant'
import Piece from './piece'

interface board {
  ctx: any; // CanvasRenderingContext2D { ... }
  grid: any;  // 맵의 격자
  piece: Piece;
  nextPiece: Piece;
  reset(): void;
  getEmptyGrid(): any;
  valid(p: any): any;
  rotate(p: any): any;
}

class Board implements board {
  grid: any;
  piece: Piece;
  nextPiece: Piece;

  constructor(public ctx: any, public nextCtx: any) {
    this.ctx = ctx;
    this.nextCtx = nextCtx;
    this.init();
  }

  // 맵, 블럭 크기 세팅
  init() {
    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;
    this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

    this.nextCtx.canvas.width = 5 * BLOCK_SIZE;
    this.nextCtx.canvas.height = 4 * BLOCK_SIZE;
    this.nextCtx.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  // 새 게임이 시작되면 맵 초기화
  reset() {
    this.grid = this.getEmptyGrid();
    this.piece = new Piece(this.ctx);
    this.piece.setStartingPosition();
    this.getNextPiece();
  }

  // 0으로 채워진 행렬
  getEmptyGrid() {
    return Array.from(
      { length: ROWS }, () => Array(COLS).fill(0)
    );
  }

  // NEXT 블록 정하기
  getNextPiece() {
    this.nextPiece = new Piece(this.nextCtx);
    this.nextCtx.clearRect(0, 0, this.nextCtx.canvas.width, this.nextCtx.canvas.height);
    this.nextPiece.setNextPosition();
    this.nextPiece.draw();
    this.drawBoard();
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

  // 맵 내의 충돌 감지
  insideWalls(x: number, y: number) {
    return x >= 0 && x < COLS && y <= ROWS;
  }

  // 놓여질 곳에 블록이 있는가
  isDropped(x: number, y: number) {
    return this.grid[y] && this.grid[y][x] === 0;
  }

  // 충돌 검사 함수
  valid(p: any) {
    return p.shape.every((row, dy) => {
      return row.every((value, dx) => {
        let x = p.x + dx;
        let y = p.y + dy;
        return value === 0 || (this.insideWalls(x, y) && this.isDropped(x, y));
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

  drop(moves: any, time: any, account: any) {
    // 1칸씩 하강
    let p = moves[KEY.DOWN](this.piece);
    if (this.valid(p)) {
      this.piece.move(p);
    }
    else {
      this.freeze();
      this.clearLines(time, account);

      // 블럭을 놓을 자리가 없으면 게임오버
      if (this.piece.y === 0) {
        return false;
      }

      this.piece = this.nextPiece;
      this.piece.ctx = this.ctx;
      this.piece.setStartingPosition();
      this.getNextPiece();
    }

    return true;
  }

  // 더이상 내려갈 수 없는 곳에 닿았을 때 블록 놓는 함수
  freeze() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.grid[y + this.piece.y][x + this.piece.x] = value;
        }
      });
    });
  }

  // 한 줄이 다 채워질 경우 라인 삭제 함수
  clearLines(time: any, account: any) {
    let lines = 0;
    this.grid.forEach((row, y) => {
      // gird에서 하나의 행이 모두 0 이상의 값으로 채워지면 라인 삭제
      if (row.every((value) => value > 0)) {
        lines++;

        // 행 삭제
        this.grid.splice(y, 1);

        // 삭제한 라인을 상단에 0으로 추가
        this.grid.unshift(Array(COLS).fill(0));
      }
    });

    if (lines > 0) {
      // 지워진 라인 수만큼 점수 추가
      account.score += this.getLinesClearedPoints(lines);
      account.lines += lines;

      // 일정 기준치의 라인을 제거하면 레벨 상승
      if (account.lines >= LINES_PER_LEVEL) {
        account.level++;

        // 다음 레벨을 위하여 기존의 라인을 삭제
        account.lines -= LINES_PER_LEVEL;

        // 레벨이 오르면 속도도 상승
        time.level = LEVEL[account.level];
      }
    }
  }

  // 라인별 점수
  getLinesClearedPoints(lines: number) {
    return lines === 1 ? POINTS.SINGLE :
      lines === 2 ? POINTS.DOUBLE :
        lines === 3 ? POINTS.TRIPLE :
          lines === 4 ? POINTS.TETRIS :
            0;
  }
}

export default Board;