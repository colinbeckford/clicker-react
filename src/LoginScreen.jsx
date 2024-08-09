import React from 'react';
import ButtonOptions from './ButtonOptions';

function LoginScreen({ videoLink, setVideoLink, handleKeybindPopup, handleShowVideo }) {
  return (
    <div>
      <h1>Judge Login</h1>
      <input
        type="text"
        placeholder="Enter YouTube video link"
        value={videoLink}
        onChange={(e) => setVideoLink(e.target.value)}
      />
      <ButtonOptions handleKeybindPopup={handleKeybindPopup} handleShowVideo={handleShowVideo} />
    </div>
  );
}

export default LoginScreen;
