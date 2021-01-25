import { COLS, ROWS, BLOCK_SIZE, LINES_PER_LEVEL, COLORS, KEY, POINTS, LEVEL } from './constant'
import Piece from './piece'

interface board {
  ctx: any; // CanvasRenderingContext2D { ... }
  grid: any;  // 맵의 격자
  piece: Piece; // 맵에 나오는 블럭
  nextPiece: Piece; // 다음에 나올 블럭

  reset(): void;  // 새 게임이 시작되면 맵 초기화
  getEmptyGrid(): Array<Array<number>>;  // 0으로 채워진 행렬
  getNextPiece(): void;  // NEXT 블럭 정하는 함수
  drawPiece(): void;  // 블럭 그리는 함수
  drawBoard(): void;  // 맵에 블럭 그리는 함수
  valid(p: any): boolean; // 충돌 검사 함수
  isInsideWalls(x: number, y: number): boolean; // 맵 내의 충돌 감지하는 함수
  isDropped(x: number, y: number): boolean; // 놓여질 곳에 블럭이 있는지 검사하는 함수
  rotate(p: any): Array<Array<number>>;  // 블럭 회전 함수
  drop(move: any, time: any, account: any): boolean;  // 블럭을 내리는 함수
  freeze(): void; // 더이상 내려갈 수 없는 곳에 닿았을 때 블럭 놓는 함수
  clearLines(time: any, account: any): void; // 한 줄이 다 채워질 경우 라인 삭제 함수
  getLinesClearedPoints(lines: number); // 라인 별 점수
}

class Board implements board {
  // grid: any;
  piece: Piece;
  nextPiece: Piece;

  constructor(public ctx: any, public nextCtx: any, public grid: any) {
    this.ctx = ctx;
    this.nextCtx = nextCtx;
    this.grid = grid;
    this.init();
  }

  // 맵, 블럭 크기 세팅
  init() {
    this.nextCtx.canvas.width = 5 * BLOCK_SIZE;
    this.nextCtx.canvas.height = 4 * BLOCK_SIZE;
    this.nextCtx.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  // 새 게임이 시작되면 맵 초기화
  reset() {
    this.piece = new Piece(this.ctx);
    this.piece.setStartingPosition();
    this.getNextPiece();
  }

  // 0으로 채워진 행렬
  getEmptyGrid() {
    return Array.from(
      { length: ROWS }, () => Array(COLS).fill(0)
    );
    // return map1();
  }

  // NEXT 블럭 정하는 함수
  getNextPiece() {
    this.nextPiece = new Piece(this.nextCtx);
    this.nextCtx.clearRect(0, 0, this.nextCtx.canvas.width, this.nextCtx.canvas.height);
    this.nextPiece.setNextPosition();
    this.nextPiece.draw();
  }

  // 블럭 그리는 함수
  drawPiece() {
    this.piece.draw();
    this.drawBoard();
  }

  // 맵에 블럭 그리는 함수
  drawBoard() {
    this.grid.forEach((row: Array<number>, y: number) => {
      row.forEach((value: number, x: number) => {
        if (value > 0) {
          this.ctx.strokeStyle = "#964b00";
          this.ctx.lineWidth = 0.025;
          this.ctx.strokeRect(x, y, 1, 1);
          this.ctx.fillStyle = COLORS[value];
          this.ctx.fillRect(x, y, 1, 1);
        }
      });
    });
  }

  // 충돌 검사 함수
  valid(p: any) {
    return p.shape.every((row: Array<number>, dy: number) => {
      return row.every((value: number, dx: number) => {
        let x = p.x + dx;
        let y = p.y + dy;
        return value === 0 || (this.isInsideWalls(x, y) && this.isDropped(x, y));
      });
    });
  }

  // 맵 내의 충돌 감지하는 함수
  isInsideWalls(x: number, y: number) {
    return x >= 0 && x < COLS && y <= ROWS;
  }

  // 놓여질 곳에 블럭이 있는지 검사하는 함수
  isDropped(x: number, y: number) {
    return this.grid[y] && this.grid[y][x] === 0;
  }


  // 블럭 회전 함수
  rotate(piece: any) {
    // JSON.stringify(arg): arg를 JSON 문자열로 변환
    // JSON.parse(json): json 문자열을 javascript에서 사용하는 값으로 변환
    // 변환하지 않고 사용하면 shape 배열이 이전 값을 기억하고 다음 나올 블럭이 변환된 상태로 나오게 됨
    // 불변성을 이용하여 현재 블럭이 다음 나올 블럭에 영향을 주지 않도록 깊은 복사하여 사용
    let p = JSON.parse(JSON.stringify(piece));

    // 행렬을 사용하여 시계방향으로 90도 회전 방법: 
    // 전치행렬로 기존 행렬의 행과 열을 바꾸고,
    // [0,0,1]
    // [0,1,0] 을 곱하여 열 기준 대칭
    // [1,0,0]
    if (!this.piece.hardDropped) {
      for (let y = 0; y < p.shape.length; ++y) {
        for (let x = 0; x < y; ++x) {
          [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
        }
      }
      // 열 기준 대칭
      p.shape.forEach((row: Array<number>) => row.reverse());
    }

    return p;
  }

  // 블럭을 내리는 함수
  drop(moves: any, time: any, account: any) {
    // 내려갈 곳이 있으면 1칸씩 하강
    let p = moves[KEY.DOWN](this.piece);
    if (this.valid(p)) {
      this.piece.move(p);
    }

    // 없으면 멈추고, 라인을 삭제
    // next에 있는 블럭을 맵에 그리기
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

  // 더이상 내려갈 수 없는 곳에 닿았을 때 블럭 놓는 함수
  // grid 격자에 블록이 추가가 된 것이므로 블록에 해당하는 id 값을 grid에 추가
  freeze() {
    this.piece.shape.forEach((row: Array<number>, y: number) => {
      row.forEach((value: number, x: number) => {
        if (value > 0) {
          this.grid[y + this.piece.y][x + this.piece.x] = value;
        }
      });
    });
  }

  // 한 줄이 다 채워질 경우 라인 삭제 함수
  clearLines(time: any, account: any) {
    let lines = 0;
    this.grid.forEach((row: Array<number>, y: number) => {

      // gird에서 하나의 행이 모두 0 이상의 값으로 채워지면 라인 삭제
      if (row.every((value: number) => value > 0)) {
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

      let lineSound = new Audio("asset/sounds/line.mp3");
      lineSound.load();
      lineSound.play();

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

  // 라인 별 점수
  getLinesClearedPoints(lines: number) {
    return lines === 1 ? POINTS.SINGLE :
      lines === 2 ? POINTS.DOUBLE :
        lines === 3 ? POINTS.TRIPLE :
          lines === 4 ? POINTS.TETRIS :
            0;
  }
}

export default Board;