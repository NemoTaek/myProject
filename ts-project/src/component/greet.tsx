import React from 'react';

type GreetingsProps = {
  name: string;
  mark: string;
  click: (name: string) => void;
};

function Greetings({ name, mark, click }: GreetingsProps) {
  return (
    <div>
      Hello, {name} {mark}
      <br></br>
      <button onClick={() => click(name)}>Click Me</button>
    </div>
  );
}

Greetings.defaultProps = {
  mark: '!'
};

export default Greetings;