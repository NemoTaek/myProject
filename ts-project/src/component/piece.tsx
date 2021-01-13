import { COLORS, SHAPES } from "./constant";

interface piece {
  x: number;  // x좌표
  y: number;  // y좌표
  color: string;  // 블럭 색
  typeId: number; // 블럭 고유 아이디 값
  shape: Array<Array<number>>;  // 블럭 모양 배열
  ctx: any; // 맵
  hardDropped: boolean; // 하드드롭 유무 변수

  spawn(): void;  // 블럭 생성 함수
  setStartingPosition(): void;  // 맵에서 시작 위치 설정
  setNextPosition(): void;  // Next 맵에서 시작 위치 설정
  draw(): void; // 블럭 그리는 함수
  move(p: any): void; // 블럭 이동 함수
  hardDrop(): void;  // 하드드롭 설정하는 함수
}
class Piece implements piece {
  public x: number;
  public y: number;
  public color: string;
  public typeId: number;
  public shape: Array<Array<number>>;
  public hardDropped: boolean

  constructor(public ctx: any) {
    this.ctx = ctx;
    this.spawn();
  }

  // 블럭 생성 함수
  spawn() {
    this.typeId = Math.floor((Math.random() * (COLORS.length - 1)) + 1);
    this.color = COLORS[this.typeId];
    this.shape = SHAPES[this.typeId];
    this.x = 0;
    this.y = 0;
    this.hardDropped = false;
  }

  // 맵에서 시작 위치 설정
  setStartingPosition() {
    this.x = this.typeId === 4 ? 4 : 3;
    this.y = 0;
  }

  // Next 맵에서 시작 위치 설정
  setNextPosition() {
    if (this.typeId === 1) {
      this.x = 0.5;
      this.y = 0.5;
    }
    else if (this.typeId === 4) {
      this.x = 1.5;
      this.y = 1;
    }
    else {
      this.x = 1;
      this.y = 1;
    }
  }

  // 블럭 그리는 함수
  draw() {
    this.ctx.fillStyle = this.color;
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        // this.x, this.y는 shape의 상단 왼쪽 좌표이다
        // shape 안에 있는 블록 좌표에 x, y를 더한다.
        // 보드에서 블록의 좌표는 this.x + x가 된다.
        if (value > 0) {
          this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
        }
      });
    });
  }

  // 블럭 이동 함수
  move(p: any) {
    // 스페이스바 누르면 움직이는 것은 안되게
    if (!this.hardDropped) {
      this.x = p.x;
      this.y = p.y;
    }
    this.shape = p.shape;
  }

  // 하드드롭 설정하는 함수
  hardDrop() {
    this.hardDropped = true;
  }
}

export default Piece;