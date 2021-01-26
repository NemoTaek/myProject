import React, { useEffect, useRef } from 'react';
import './App.css';
import { COLS, ROWS, BLOCK_SIZE, KEY, POINTS, LEVEL } from './component/constant'
import { map_standard, map_cliff, map_hi, map_egyptian } from './component/map'
import Board from './component/board'

function App() {
  let mapRef = useRef<HTMLCanvasElement>(null);
  let nextRef = useRef<HTMLCanvasElement>(null);

  // 판 선언
  let board: Board;

  // 맵 인덱스
  let mapIndex: number = 0;

  // 맵 배열
  let mapGrid: number[][][] = [map_standard(), map_cliff(), map_hi(), map_egyptian()];

  // 맵도 깊은 복사를 하여 기존의 맵에 영향을 주지 않도록 설계
  // 블록 회전과 같은 원리
  let selectMap: number[][][] = [];
  for (let i = 0; i < mapGrid.length; i++) {
    selectMap[i] = JSON.parse(JSON.stringify(mapGrid[i]));
  }

  // 게임 내 점수, 라인 수, 레벨 정보
  let accountValues = {
    score: 0,
    lines: 0,
    level: 0
  }

  useEffect(() => {
    let map = mapRef.current;
    let next = nextRef.current;
    let mapContext = map.getContext('2d');
    let nextContext = next.getContext('2d');

    let requestId: any;
    let time: any;

    // 블럭 이동 세팅
    const moves = {
      [KEY.LEFT]: (p: any) => ({ ...p, x: p.x - 1 }),
      [KEY.RIGHT]: (p: any) => ({ ...p, x: p.x + 1 }),
      [KEY.DOWN]: (p: any) => ({ ...p, y: p.y + 1 }),
      [KEY.SPACE]: (p: any) => ({ ...p, y: p.y + 1 }),
      [KEY.UP]: (p: any) => board.rotate(p)
    }

    // bgm 및 기타 오디오 설정
    let soundPlaying = false;
    document.querySelector('#sound_speaker').textContent = "\u{1F507}";
    document.querySelector("#sound_description").textContent = "off";
    let bgmArray = [
      "asset/sounds/BRADINSKY.mp3",
      "asset/sounds/KARINKA.mp3",
      "asset/sounds/LOGINSKA.mp3",
      "asset/sounds/TROIKA.mp3",
      "asset/sounds/tetris_elec.mp3"
    ]

    let opening: HTMLAudioElement = document.querySelector("#opening");
    let bgm: HTMLAudioElement = document.querySelector("#bgm");
    let gameoverSound: HTMLAudioElement = document.querySelector("#gameover");
    let dropSound: HTMLAudioElement = document.querySelector("#drop");
    let bgmElement: HTMLElement = document.querySelector("#sound_wrap");
    // bgm ON/OFF 클릭 시 소리 재생/중지
    bgmElement.addEventListener("click", () => {
      if (!soundPlaying) {
        opening.pause();
        bgmOn();
        soundPlaying = true;
      }
      else {
        bgmOff();
        soundPlaying = false;
      }
    });

    // bgm 시작
    const bgmOn = () => {
      document.querySelector('#sound_speaker').textContent = "\u{1F509}";
      document.querySelector("#sound_description").textContent = "ON";

      // 위에서 선언한 src 배열중 랜덤으로 하나 선택 후 재생
      bgm.src = bgmArray[Math.floor(Math.random() * bgmArray.length)];
      bgm.load();
      bgm.play();
    }
    // bgm 정지
    const bgmOff = () => {
      document.querySelector('#sound_speaker').textContent = "\u{1F507}";
      document.querySelector("#sound_description").textContent = "OFF";
      bgm.pause();
    }

    // bgm 랜덤재생
    // bgm의 한 곡이 끝났을 때 다시 bgm을 시작하여 랜덤의 곡으로 재생
    bgm.addEventListener("ended", () => {
      bgmOn();
    })

    // 레벨 커스텀
    let levelUp: HTMLButtonElement = document.querySelector('.level_up');
    levelUp.addEventListener("click", () => {
      levelDown.disabled = false;
      // 최고 레벨은 10까지로 제한
      if (accountValues.level >= 9) {
        levelUp.disabled = true;
      }
      else {
        levelUp.disabled = false;
      }
      accountValues.level++;
      document.querySelector("#level").textContent = accountValues.level.toString();
    });

    let levelDown: HTMLButtonElement = document.querySelector('.level_down');
    // 처음 세팅은 level down을 할 수 없으므로 disabled
    levelDown.disabled = true;
    levelDown.addEventListener("click", () => {
      if (accountValues.level <= 1) {
        levelDown.disabled = true;
      }
      // 10레벨에서 level down 버튼 클릭하면 다시 levelup 버튼 활성화
      else if (accountValues.level >= 9) {
        levelUp.disabled = false;
      }
      else {
        levelDown.disabled = false;
      }
      accountValues.level--;
      document.querySelector("#level").textContent = accountValues.level.toString();
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 맵 크기 설정
    mapContext.canvas.width = COLS * BLOCK_SIZE;
    mapContext.canvas.height = ROWS * BLOCK_SIZE;
    mapContext.scale(BLOCK_SIZE, BLOCK_SIZE);

    // 맵 선택
    let mapLeft: HTMLButtonElement = document.querySelector('.left');
    let mapRight: HTMLButtonElement = document.querySelector('.right');

    const rightOff = () => {
      mapRight.disabled = true;
      mapRight.style.borderLeftColor = "grey";
      mapLeft.disabled = false;
      mapLeft.style.borderRightColor = "greenyellow";
    }
    const leftOff = () => {
      mapLeft.disabled = true;
      mapLeft.style.borderRightColor = "grey";
      mapRight.disabled = false;
      mapRight.style.borderLeftColor = "greenyellow";
    }
    const bothOn = () => {
      mapLeft.disabled = false;
      mapLeft.style.borderRightColor = "greenyellow";
      mapRight.disabled = false;
      mapRight.style.borderLeftColor = "greenyellow";
    }

    // 첫 번째 맵이면 왼쪽 클릭 비활성화
    if (mapIndex === 0) {
      leftOff();
    }

    // 두 번째 맵 ~ 마지막에서 두번째 맵 이면 모두 활성화
    else if (mapIndex > 0 && mapIndex < (mapGrid.length - 1)) {
      bothOn();
    }

    // 마지막 맵이면 오른쪽 클릭 바활성화
    if (mapIndex === (mapGrid.length - 1)) {
      rightOff();
    }

    // 맵 변경 클릭 이벤트
    mapLeft.addEventListener("click", () => {
      if (mapIndex > 0 && mapIndex < mapGrid.length) {
        bothOn();
        mapIndex--;
        mapContext.clearRect(0, 0, mapContext.canvas.width, mapContext.canvas.height);
        board = new Board(mapContext, nextContext, mapGrid[mapIndex]);
        board.drawBoard();
        console.table(selectMap[mapIndex]);

        // 클릭 하고 첫번째 맵이 되면 왼쪽 클릭 비활성화
        if (mapIndex === 0) {
          leftOff();
        }
      }
    });

    mapRight.addEventListener("click", () => {
      if (0 <= mapIndex && mapIndex < (mapGrid.length - 1)) {
        bothOn();
        mapIndex++;
        mapContext.clearRect(0, 0, mapContext.canvas.width, mapContext.canvas.height);
        board = new Board(mapContext, nextContext, mapGrid[mapIndex]);
        board.drawBoard();
        console.table(selectMap[mapIndex]);

        // 클릭 하고 마지막 맵이 되면 오른쪽 클릭 비활성화
        if (mapIndex === (mapGrid.length - 1)) {
          rightOff();
        }
      }
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 게임 시작 버튼 클릭 후 로직

    // 게임 시작 버튼 클릭
    document.querySelector('.play-button').addEventListener("click", (e) => {
      // 시작 시마다 맵 초기화
      for (let i = 0; i < mapGrid.length; i++) {
        selectMap[i] = JSON.parse(JSON.stringify(mapGrid[i]));
      }

      // 선택한 맵 그리기
      mapContext.clearRect(0, 0, mapContext.canvas.width, mapContext.canvas.height);
      board = new Board(mapContext, nextContext, selectMap[mapIndex]);

      // 오프닝 bgm 중지
      opening.pause();

      // 점수, 라인 수 초기화
      accountValues.score = 0;
      accountValues.lines = 0;

      // 레벨 커스텀 중지
      levelUp.style.display = "none";
      levelDown.style.display = "none";

      // 맵 선택 중지
      mapLeft.style.display = "none";
      mapRight.style.display = "none";

      // 게임 시작
      play();

      // bgm 온
      soundPlaying = true;
      bgmOn();
    }, true);

    // 게임 시작
    const play = (): void => {
      addEventListener();
      if (requestId) {
        cancelAnimationFrame(requestId);
      }
      resetGame();
      animate();
    }

    // 게임 설정 초기화
    const resetGame = (): void => {
      document.querySelector("#level").textContent = accountValues.level.toString();
      board.reset();
      // 시작 시간, 경과 시간, 해당 레벨의 낙하 속도를 가지는 타이머 객체
      time = { start: performance.now(), elapsed: 0, level: LEVEL[accountValues.level] };
    }

    const animate = (now: number = 0): void => {
      // 점수, 라인 수, 레벨 출력
      document.querySelector("#score").textContent = accountValues.score.toString();
      document.querySelector("#lines").textContent = accountValues.lines.toString();
      document.querySelector("#level").textContent = accountValues.level.toString();

      // 경과시간 업데이트
      time.elapsed = now - time.start;

      // 경과시간이 현재 레벨의 시간을 넘었다면
      // 시작시간을 0으로 초기화 하고 하강시킴
      if (time.elapsed > time.level) {
        time.start = now;

        // 시작시간을 초기화 하자마자 충돌이 나면 게임오버
        if (!board.drop(moves, time, accountValues)) {
          gameOver();
          return;
        }
      }

      // 맵 초기화 후 그리기
      mapContext.clearRect(0, 0, mapContext.canvas.width, mapContext.canvas.height);
      board.drawPiece();

      // 애니메이션 변수에 담아 flag 설정
      requestId = requestAnimationFrame(animate);
    }

    // 키보드 이벤트(블록 움직임, 하드 드롭, 일시정지)
    const addEventListener = () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.addEventListener('keydown', handleKeyPress);
    }

    const handleKeyPress = (event: any) => {
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
            accountValues.score += POINTS.HARD_DROP;
          }
          board.piece.hardDrop();
          dropSound.src = "asset/sounds/drop.mp3";
          dropSound.load();
          dropSound.play();
        }

        // 이동이 가능한 상태라면 이동
        else if (board.valid(p)) {
          board.piece.move(p);
          if (event.code === KEY.DOWN) {
            accountValues.score += POINTS.SOFT_DROP;
          }
        }
      }

      // p 키를 눌러 일시정지
      else if (event.code === KEY.P) {
        pause();
      }
    };

    // 게임오버
    const gameOver = () => {
      bgmOff();
      cancelAnimationFrame(requestId);

      // game over 창 띄우기
      mapContext.fillStyle = 'white';
      mapContext.fillRect(1, 3, 8, 1.2);
      mapContext.font = '1px Arial';
      mapContext.fillStyle = 'red';
      mapContext.fillText('GAME OVER', 1.8, 4);

      gameoverSound.src = "asset/sounds/gameover.mp3";
      gameoverSound.load();
      gameoverSound.play();

      // 레벨 커스텀 활성화
      levelUp.style.display = "inline-block";
      levelDown.style.display = "inline-block";

      // 맵 선택 활성화
      mapLeft.style.display = "inline-block";
      mapRight.style.display = "inline-block";
    }

    // 일시정지
    const pause = () => {
      // 일시정지 중이었다면 다시 실행
      if (!requestId) {
        animate();
        bgmOn();
        return;
      }

      // 진행중이었다면 일시정지
      cancelAnimationFrame(requestId);
      requestId = null;

      mapContext.fillStyle = 'white';
      mapContext.fillRect(1, 3, 8, 1.2);
      mapContext.font = '1px Arial';
      mapContext.fillStyle = 'red';
      mapContext.fillText('PAUSED', 3, 4);

      bgmOff();
    }
  })

  return (
    <div id="background">
      <div className="wrap">
        <div className="tetris_map_wrap">
          <div className="arrow_wrap">
            <button className="triangle left"></button>
          </div>
          <canvas id="tetris_map" ref={mapRef}></canvas>
          <div className="arrow_wrap">
            <button className="triangle right"></button>
          </div>
        </div>
        <div className="next_wrap">
          <div className="next_wrap_info">
            <h1>TETRIS</h1>
            <p>Score: <span id="score">0</span></p>
            <p>Lines: <span id="lines">0</span></p>
            <div>
              <p style={{ display: "inline-block" }}>Level: <span id="level">{accountValues.level}</span></p>
              <div className="level_wrap">
                <button className="level_up">↑</button>
                <button className="level_down">↓</button>
              </div>
            </div>
            <div className="next">
              <p>NEXT</p>
              <canvas id="next" ref={nextRef} style={{ backgroundColor: "black" }}></canvas>
            </div>
            <div id="sound_wrap">
              <span className="sound_item" id="sound_speaker"></span>
              <span className="sound_item" id="sound_description"></span>
              {/* <iframe title="a" id="openingIframe" src="asset/sounds/drop.mp3" allow="autoplay" style={{ display: "none" }}></iframe> */}
              <audio id="opening" autoPlay>
                <source src="asset/sounds/opening.mp3" type="audio/mp3"></source>
              </audio>
              <audio id="bgm"></audio>
              <audio id="line"></audio>
              <audio id="drop"></audio>
              <audio id="gameover"></audio>
            </div>
          </div>
          <button className="play-button">Play</button>
        </div>
      </div>
    </div>
  );
}

export default App;
