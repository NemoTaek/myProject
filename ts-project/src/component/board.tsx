import { COLS, ROWS, BLOCK_SIZE } from './constant'
import Piece from './piece'

interface board {
  grid: any;
  reset(): void;
  getEmptyBoard(): any;
}

class Board implements board {
  public piece = new Piece(this.grid);
  constructor(
    public grid: any
  ) { }

  // 새 게임이 시작되면 보드를 초기화한다.
  reset() {
    this.grid = this.getEmptyBoard();
  }

  // 0으로 채워진 행렬을 얻는다.
  getEmptyBoard() {
    return Array.from(
      { length: ROWS }, () => Array(COLS).fill(0)
    );
  }

  makePiece() {
    this.piece.spawn();
    this.piece.draw();
  }
}

// class Board {
//   grid;

//   // 새 게임이 시작되면 보드를 초기화한다.
//   reset() {
//     this.grid = this.getEmptyBoard();
//   }

//   // 0으로 채워진 행렬을 얻는다.
//   getEmptyBoard() {
//     return Array.from(
//       { length: ROWS }, () => Array(COLS).fill(0)
//     );
//   }
// }

export default Board;