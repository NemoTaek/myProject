import React, { useEffect, useRef } from 'react';
import './App.css';
import { COLS, ROWS, BLOCK_SIZE } from './component/constant'
import Board from './component/board'
import Piece from './component/piece'

function App() {
  let mapRef = useRef(null);
  let nextRef = useRef(null);

  useEffect(() => {
    let map = mapRef.current;
    let next = nextRef.current
    let mapContext = map.getContext('2d');
    let nextContext = next.getContext('2d');

    // 맵 크기 세팅
    mapContext.canvas.width = COLS * BLOCK_SIZE;
    mapContext.canvas.height = ROWS * BLOCK_SIZE;
    // mapContext.scale(BLOCK_SIZE * BLOCK_SIZE);
    nextContext.canvas.width = 100;
    nextContext.canvas.height = 100;

    let board = new Board(mapContext);
    const play = () => {
      board.getEmptyBoard();
      // console.table(board.grid);
      board.makePiece();
      // let piece = new Piece(mapContext);
      // piece.spawn();
      // piece.draw();
      // board.piece = piece;
    }

    play();
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
