import React, { useEffect } from 'react';
import './App.css';

function App() {
  const speed: number = 5;
  const size: number = 10;
  const keyPress: Object = {}
  let x_position: number = 0;
  let y_position: number = 0;

  useEffect(() => {
    const character: any = document.querySelector('#character');
    console.log(x_position, y_position)

    setInterval(function (e: any) {
      if (keyPress['ArrowRight']) {
        if (x_position >= Math.floor(window.innerWidth - window.innerWidth / (100 / size))) {
          x_position = Math.floor(window.innerWidth - window.innerWidth / (100 / size));
        }
        else {
          x_position += speed;
        }
      }
      else if (keyPress['ArrowLeft']) {
        if (x_position <= 0) {
          x_position = 0;
        }
        else {
          x_position -= speed;
        }
      }
      else if (keyPress['ArrowUp']) {
        if (y_position <= 0) {
          y_position = 0;
        }
        else {
          y_position -= speed;
        }
      }
      else if (keyPress['ArrowDown']) {
        if (y_position >= Math.floor(window.innerHeight - window.innerWidth / (100 / size))) {
          y_position = Math.floor(window.innerHeight - window.innerWidth / (100 / size));
        }
        else {
          y_position += speed;
        }
      }

      character.style.transform = `translate(${x_position}px, ${y_position}px)`;
    }, 10)
  })

  window.addEventListener('keydown', (e: any) => {
    keyPress[e.code] = true;
  })
  window.addEventListener('keyup', (e: any) => {
    keyPress[e.code] = false;
  })

  return (
    <div id="background">
      <div id="character"></div>
    </div>
  );
}

export default App;
