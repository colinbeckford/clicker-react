import React from 'react';

function LoginScreen({ judgeName, setJudgeName, videoLink, setVideoLink, handleKeybindPopup, handleShowVideo }) {
  return (
    <div>
      <h1>Judge Login</h1>
      <input
        type="text"
        placeholder="Enter judge name"
        value={judgeName}
        onChange={(e) => setJudgeName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter YouTube video link"
        value={videoLink}
        onChange={(e) => setVideoLink(e.target.value)}
      />
      <button onClick={handleKeybindPopup}>Score Freestyle</button>
      <button onClick={handleShowVideo}>Replay Clicks</button>
    </div>
  );
}

export default LoginScreen;
