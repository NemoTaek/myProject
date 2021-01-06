import React from 'react';
import './App.css';


function App() {

  let x_position: number = 100;
  let y_position: number = 100;

  window.addEventListener('keydown', (e: any) => {
    let character: any = document.getElementsByClassName('character')[0];

    if (e.code === 'ArrowRight') {
      x_position += 10;
    }
    else if (e.code === 'ArrowLeft') {
      x_position -= 10;
    }
    else if (e.code === 'ArrowUp') {
      y_position -= 10;
    }
    else if (e.code === 'ArrowDown') {
      y_position += 10;
    }

    character.style.transform = `translate(${x_position}px, ${y_position}px)`;
    console.log(x_position)
    console.log(y_position)
  })
  return (
    <div className="background">
      <div className="character"></div>
    </div>
  );
}

export default App;
