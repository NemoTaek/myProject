import React, { useEffect, useRef } from 'react';
import './App.css';
import { KEY, POINTS, LEVEL } from './component/constant'
import Board from './component/board'
import ReactAudioPlayer from 'react-audio-player';

function App() {
  let mapRef = useRef(null);
  let nextRef = useRef(null);

  useEffect(() => {
    let map = mapRef.current;
    let next = nextRef.current;
    let mapContext = map.getContext('2d');
    let nextContext = next.getContext('2d');

    let requestId: any;
    let time: any;

    // 다 만들고 나중에 redux로 저장하자
    let accountValues = {
      score: 0,
      lines: 0,
      level: 0
    }

    // 사용자 정보 출력
    function updateAccount(key, value) {
      let element = document.getElementById(key);
      if (element) {
        element.textContent = value;
      }
    }

    // Proxy인 account 변수에서 속성들을 호출할 때 마다 updateAccount()를 호출하여 DOM을 업데이트
    let account = new Proxy(accountValues, {
      set: (target, key, value) => {
        target[key] = value;
        updateAccount(key, value);
        return true;
      }
    });

    // 블럭 이동 세팅
    const moves = {
      [KEY.LEFT]: (p: any) => ({ ...p, x: p.x - 1 }),
      [KEY.RIGHT]: (p: any) => ({ ...p, x: p.x + 1 }),
      [KEY.DOWN]: (p: any) => ({ ...p, y: p.y + 1 }),
      [KEY.SPACE]: (p: any) => ({ ...p, y: p.y + 1 }),
      [KEY.UP]: (p: any) => board.rotate(p)
    }

    let soundPlaying = false;
    // let sound = new Sound(document.querySelector("#sound_wrap"));
    // sound.muteToggle();
    // sound.soundSetting();
    document.querySelector('#sound_speaker').textContent = "\u{1F507}";
    document.querySelector("#sound_description").innerHTML = "off";
    // let backgroundSound = sound.create("asset/sounds/Dungeon_Theme.mp3", "background_sound", true);
    // let movesSound = sound.create("asset/sounds/moves.mp3", "moves_sound");
    // let dropSound = sound.create("asset/sounds/drop.mp3", "drop_sound");
    // let pointsSound = sound.create("asset/sounds/points.mp3", "points_sound");
    // let finishSound = sound.create("asset/sounds/finish.mp3", "finish_sound");
    let bgmArray = [
      "asset/sounds/Dungeon_Theme.mp3",
      "asset/sounds/drop.mp3",
      "asset/sounds/finish.mp3",
      "asset/sounds/moves.mp3",
      "asset/sounds/multimove.mp3",
      "asset/sounds/points.mp3",
    ]
    // let randomSound = sound.create(bgmArray[Math.floor(Math.random() * bgmArray.length)], "a");
    let bgm = new Audio("/asset/sounds/Dungeon_Theme.mp3");
    let bgmElement = document.querySelector("#sound_wrap");
    bgmElement.addEventListener("click", () => {
      if (!soundPlaying) {
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
      account.score = 0;
      account.lines = 0;
      account.level = 0;
      board.reset();
      time = { start: performance.now(), elapsed: 0, level: LEVEL[account.level] };
    }

    // 게임 시작 버튼 클릭
    document.querySelector('.play-button').addEventListener("click", (e) => {
      play();
      soundPlaying = true;
      bgmOn();
    }, false);

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
            account.score += POINTS.HARD_DROP;
          }
          board.piece.hardDrop();
        }

        else if (board.valid(p)) {
          // 이동이 가능한 상태라면 이동
          board.piece.move(p);
          if (event.code === KEY.DOWN) {
            account.score += POINTS.SOFT_DROP;
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
      // 경과시간 초기화
      time.elapsed = now - time.start;

      // 몇초마다 내려올건지 설정
      if (time.elapsed > time.level) {
        // 시작시간 0으로 초기화
        time.start = now;

        if (!board.drop(moves, time, account)) {
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
      cancelAnimationFrame(requestId);
      mapContext.fillStyle = 'white';
      mapContext.fillRect(1, 3, 8, 1.2);
      mapContext.font = '1px Arial';
      mapContext.fillStyle = 'red';
      mapContext.fillText('GAME OVER', 1.8, 4);
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

      // document.addEventListener('keydown', event => {
      //   if (event.code === 'ArrowUp' || event.code === 'ArrowDown' || event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
      //     console.log('화살표')
      //     return false;
      //   }
      // }, false);
      // sound.pause();
    }

    const bgmOn = () => {
      document.querySelector('#sound_speaker').textContent = "\u{1F509}";
      document.querySelector("#sound_description").innerHTML = "ON";
      // bgm.src = bgmArray[Math.floor(Math.random() * bgmArray.length)];
      // bgm.loop = true; // 반복 재생
      // bgm.volume = 1; // 음량 설정
      // console.log(document.querySelector('#bgm'));
      // document.querySelector('#bgm').play();
      // bgm.play();

    }
    const bgmOff = () => {
      document.querySelector('#sound_speaker').textContent = "\u{1F507}";
      document.querySelector("#sound_description").innerHTML = "OFF";
      bgm.pause(); // sound1.mp3 재생
      // sound.pause();
    }
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
            <p>Level: <span id="level">0</span></p>
            <div className="next">
              <p>NEXT</p>
              <canvas id="next" ref={nextRef} style={{ backgroundColor: "black" }}></canvas>
            </div>
            <div id="sound_wrap">
              <span className="sound_item" id="sound_speaker"></span>
              <span className="sound_item" id="sound_description"></span>
              <audio id="bgm" src="./asset/sounds/Dungeon_Theme.mp3"></audio>
              {/* <ReactAudioPlayer
                id="bgm"
                src="/asset/sounds/Dungeon_Theme.mp3"
                controls
                ref={(element) => { this.rap = element; }}
              /> */}
            </div>
          </div>
          <button className="play-button">Play</button>
        </div>
      </div>
    </div>
  );
}

export default App;
