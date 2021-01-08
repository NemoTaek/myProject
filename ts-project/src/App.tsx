import React, { useEffect } from 'react';
import './App.css';

let location: { x: number, y: number } = {
  x: 50,
  y: 50
}

function App() {
  const speed: number = 5;
  const size: number = 50;
  const keyPress: object = {}


  useEffect(() => {
    const character: any = document.querySelector('#character');

    window.addEventListener('keydown', (e: any) => {
      // keyPress[e.code] = true;
      if (e.code === 'ArrowRight') {
        if (location.x >= Math.floor(window.innerWidth - size * 2)) {
          location.x = Math.floor(window.innerWidth - size * 2);
        }
        else {
          setInterval(() => {
            location.x += size;
            location.y += 0;
            character.style.transform = `translate(${location.x}px, ${location.y}px)`;
          }, 500)

        }
      }
      else if (e.code === 'ArrowLeft') {
        if (location.x <= 50) {
          location.x = 50;
        }
        else {
          setInterval(() => {
            location.x -= size;
            location.y += 0;
            character.style.transform = `translate(${location.x}px, ${location.y}px)`;
          }, 500)
        }
      }
      else if (e.code === 'ArrowUp') {
        if (location.y <= 50) {
          location.y = 50;
        }
        else {
          setInterval(() => {
            location.x += 0;
            location.y -= size;
            character.style.transform = `translate(${location.x}px, ${location.y}px)`;
          }, 500)
        }
      }
      else if (e.code === 'ArrowDown') {
        if (location.y >= Math.floor(window.innerHeight - size * 2)) {
          location.y = Math.floor(window.innerHeight - size * 2);
        }
        else {
          setInterval(() => {
            location.x += 0;
            location.y += size;
            character.style.transform = `translate(${location.x}px, ${location.y}px)`;
          }, 500)
        }
      }
      console.log(location)
    })
  })


  // window.addEventListener('keyup', (e: any) => {
  //   keyPress[e.code] = false;
  // })

  return (
    <div id="background">
      <div id="character"></div>
    </div>
  );
}

export default App;
