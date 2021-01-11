import React, { useEffect, useRef } from 'react';
import './App.css';
import { COLS, ROWS, BLOCK_SIZE, KEY } from './component/constant'
import Board from './component/board'

function App() {
  let mapRef = useRef(null);
  let nextRef = useRef(null);
  let requestId: any;
  let time: any;

  useEffect(() => {
    let map = mapRef.current;
    let next = nextRef.current
    let mapContext = map.getContext('2d');
    let nextContext = next.getContext('2d');

    // 맵 크기 세팅
    // mapContext.canvas.width = COLS * BLOCK_SIZE;
    // mapContext.canvas.height = ROWS * BLOCK_SIZE;
    // mapContext.scale(BLOCK_SIZE, BLOCK_SIZE);
    // nextContext.canvas.width = 100;
    // nextContext.canvas.height = 100;

    // 블럭 이동 세팅
    const moves = {
      [KEY.LEFT]: p => ({ ...p, x: p.x - 1 }),
      [KEY.RIGHT]: p => ({ ...p, x: p.x + 1 }),
      [KEY.DOWN]: p => ({ ...p, y: p.y + 1 }),
      [KEY.SPACE]: p => ({ ...p, y: p.y + 1 }),
      [KEY.UP]: p => board.rotate(p)
    }

    let board = new Board(mapContext);

    // 게임 설정 초기화
    const resetGame = (): void => {
      // account.score = 0;
      // account.lines = 0;
      // account.level = 0;
      board.reset();
      // time = { start: 0, elapsed: 0, level: LEVEL[account.level] };
      time = { start: 0, elapsed: 0, level: 1000 };
    }

    // 게임 시작
    const play = (): void => {
      resetGame();
      animate();
    }

    const animate = (now: number = 0): void => {
      // 경과시간 초기화
      time.elapsed = now - time.start;

      // 몇초마다 내려올건지 설정
      if (time.elapsed > time.level) {
        // 시작시간 0으로 초기화
        time.start = now;

        // 1칸씩 하강
        let p = moves[KEY.DOWN](board.piece);
        if (board.valid(p)) {
          board.piece.move(p);
        }
      }

      // 맵 초기화 후 그리기
      mapContext.clearRect(0, 0, mapContext.canvas.width, mapContext.canvas.height);
      board.drawPiece();

      // 애니메이션 시작
      requestId = requestAnimationFrame(animate);
    }

    document.addEventListener('keydown', event => {
      if (moves[event.code]) {
        // 이벤트 버블링 방지
        event.preventDefault();

        // 조각의 상태를 얻음
        let p = moves[event.code](board.piece);

        // space 누르면 수직 강하
        if (event.code === KEY.SPACE) {
          while (board.valid(p)) {
            board.piece.move(p);
            p = moves[KEY.DOWN](board.piece);
          }
        }

        else if (board.valid(p)) {
          // 이동이 가능한 상태라면 이동
          board.piece.move(p);

          // 그리기 전 이전 좌표 초기화
          mapContext.clearRect(0, 0, mapContext.canvas.width, mapContext.canvas.height);
          board.piece.draw();
        }
      }
    });

    // 게임 시작 버튼 클릭
    document.querySelector('.play-button').addEventListener("click", (e) => {
      play();
    }, false);

  }, [])

  return (
    <div id="background">
      <canvas id="tetris_map" ref={mapRef}></canvas>
      <div className="next_wrap">
        <div className="next_wrap_info">
          <h1>TETRIS</h1>
          <p>Score: <span id="score">0</span></p>
          <p>Lines: <span id="lines">0</span></p>
          <p>Level: <span id="level">0</span></p>
          <div className="next">
            <p>NEXT</p>
            <canvas id="next" ref={nextRef} style={{ backgroundColor: "black" }}></canvas>
          </div>
        </div>
        <button className="play-button">Play</button>
      </div>
    </div>
  );
}

export default App;
