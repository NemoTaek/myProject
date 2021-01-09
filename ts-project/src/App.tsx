import React, { useEffect, useRef } from 'react';
import './App.css';

function App() {
  let canvasRef = useRef(null);

  useEffect(() => {
    let canvas = canvasRef.current;
    let ctx = canvas.getContext('2d');
  }, [])

  return (
    <div id="background">
      <canvas id="tetris_map" ref={canvasRef} width={350} height={700} style={{ backgroundColor: "black" }}></canvas>
    </div>
  );
}

export default App;
