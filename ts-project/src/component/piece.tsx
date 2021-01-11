import { COLORS, SHAPES } from "./constant";

interface piece {
  x: number;
  y: number;
  color: string;
  typeId: number;
  shape: Array<Array<number>>;
  ctx: any;
  spawn(): void;
  draw(): void;
}
class Piece implements piece {
  public x: number;
  public y: number;
  public color: string;
  public typeId: number;
  public shape: Array<Array<number>>;

  constructor(public ctx: any) {
    this.ctx = ctx;
    this.spawn();
  }

  // 시작 위치 설정
  setStartingPosition() {
    this.x = this.typeId === 3 ? 4 : 3;
    this.y = 0;
  }

  // 블럭 생성
  spawn() {
    this.typeId = Math.floor(Math.random() * COLORS.length);
    this.color = COLORS[this.typeId];
    this.shape = SHAPES[this.typeId];
  }

  // 블럭 그리기
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

  // 블럭 이동
  move(p: any) {
    this.x = p.x;
    this.y = p.y;
    this.shape = p.shape;
  }
}

export default Piece;