import React from 'react';

function ButtonOptions({ handleKeybindPopup, handleShowVideo }) {
  return (
    <div>
      <button onClick={handleKeybindPopup}>Score Freestyle</button>
      <button onClick={handleShowVideo}>Replay Clicks</button>
    </div>
  );
}

export default ButtonOptions;
