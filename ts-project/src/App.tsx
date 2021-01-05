import React from 'react';
import './App.css';

import Greetings from './component/greet';

function App() {
  const onClick = (name: string) => {
    console.log(`${name} says hello`);
  };
  return <Greetings name="React" click={onClick} />;
}

export default App;
