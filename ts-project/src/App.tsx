import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { KEY, POINTS, LEVEL } from './component/constant'
import Board from './component/board'

// 더 추가해보고싶은거
// 개임 정보에 콤보 기능 추가
// 커스텀 레벨 설정 (레벨 몇부터 시작하기) => 완료
// redux로 최고 점수, 최고 라인 수, 최고 레벨, 최대 콤보 수 추가
// 기본 맵 말고 처음 세팅되어있는 맵 추가
function App() {
  let mapRef = useRef(null);
  let nextRef = useRef(null);

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

    let board = new Board(mapContext, nextContext);

    // 게임 설정 초기화
    const resetGame = (): void => {
      document.querySelector("#level").textContent = accountValues.level.toString();
      board.reset();
      time = { start: performance.now(), elapsed: 0, level: LEVEL[accountValues.level] };
    }

    // 게임 시작 버튼 클릭
    document.querySelector('.play-button').addEventListener("click", (e) => {
      // 오프닝 bgm 중지
      opening.pause();
      // 레벨 커스텀 중지
      levelUp.style.display = "none";
      levelDown.style.display = "none";
      // 게임 시작
      play();
      // bgm 온
      soundPlaying = true;
      bgmOn();
    }, true);

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
          console.log(accountValues)
        }

        else if (board.valid(p)) {
          // 이동이 가능한 상태라면 이동
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

    // 게임 시작
    const play = (): void => {
      addEventListener();
      if (requestId) {
        cancelAnimationFrame(requestId);
      }
      resetGame();
      animate();
    }

    const animate = (now: number = 0): void => {
      // 점수, 라인 수, 레벨 출력
      document.querySelector("#score").textContent = accountValues.score.toString();
      document.querySelector("#lines").textContent = accountValues.lines.toString();
      document.querySelector("#level").textContent = accountValues.level.toString();

      // 경과시간 초기화
      time.elapsed = now - time.start;

      // 몇초마다 내려올건지 설정
      if (time.elapsed > time.level) {
        // 시작시간 0으로 초기화
        time.start = now;

        if (!board.drop(moves, time, accountValues)) {
          gameOver();
          return;
        }
      }

      // 맵 초기화 후 그리기
      mapContext.clearRect(0, 0, mapContext.canvas.width, mapContext.canvas.height);
      board.drawPiece();

      // 애니메이션 시작
      requestId = requestAnimationFrame(animate);
    }

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

      levelUp.style.display = "inline-block";
      levelDown.style.display = "inline-block";
    }

    //일시정지
    const pause = () => {
      // 일시정지 중이었다면 다시 실행
      if (!requestId) {
        animate();
        bgmOn();
        // backgroundSound.play();
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

    const bgmOn = () => {
      document.querySelector('#sound_speaker').textContent = "\u{1F509}";
      document.querySelector("#sound_description").textContent = "ON";

      bgm.src = bgmArray[Math.floor(Math.random() * bgmArray.length)];
      // bgm.loop = true; // 반복 재생
      bgm.load();
      bgm.play();
    }
    const bgmOff = () => {
      document.querySelector('#sound_speaker').textContent = "\u{1F507}";
      document.querySelector("#sound_description").textContent = "OFF";
      bgm.pause();
    }

    // bgm 랜덤재생
    bgm.addEventListener("ended", () => {
      bgmOn();
    })
  }, [])

  return (
    <div id="background">
      <div className="wrap">
        <canvas id="tetris_map" ref={mapRef}></canvas>
        <div className="next_wrap">
          <div className="next_wrap_info">
            <h1>TETRIS</h1>
            <p>Score: <span id="score">0</span></p>
            <p>Lines: <span id="lines">0</span></p>
            <p>Level: <span id="level">{accountValues.level}</span>
              <div className="level_wrap">
                <button className="level_up">↑</button>
                <button className="level_down">↓</button>
              </div>
            </p>
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
