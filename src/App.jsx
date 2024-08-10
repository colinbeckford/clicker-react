import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginScreen from './LoginScreen';
import KeybindPopup from './KeybindPopup';
import VideoView from './VideoView';
import Navbar from './Navbar';

function App() {
  const [keybindPopup, setKeybindPopup] = useState(false);
  const [judgeName, setJudgeName] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [keybinds, setKeybinds] = useState({
    plusOne: 'k',
    plusTwo: '2',
    minusOne: 'j',
    saveScore: '0',
  });
  const [replayMode, setReplayMode] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [initiateVideo, setInitiateVideo] = useState(false);

  useEffect(() => {
    if (videoLink) {
      setShowVideo(true);
    }
  }, [videoLink]);
  
  const handlePopupClose = () => {
    setKeybindPopup(false);
    if (initiateVideo) {
      setShowVideo(true);
    }
  };

  const handleKeybindPopup = () => {
    setKeybindPopup(true);
    setReplayMode(false);
    setInitiateVideo(true);
  };

  const handleShowVideo = () => {
    setReplayMode(true);
    setShowVideo(true);
  };



  return (
    <div>
      <Navbar keybinds={keybinds} setKeybinds={setKeybinds} judgeName={judgeName}
        setJudgeName={setJudgeName} videoLink={videoLink} setVideoLink={setVideoLink} handleKeybindPopup={handleKeybindPopup} handleShowVideo={handleShowVideo} />
      {!showVideo && !keybindPopup && (
        <LoginScreen
          videoLink={videoLink}
          setVideoLink={setVideoLink}
          handleKeybindPopup={handleKeybindPopup}
          handleShowVideo={handleShowVideo}
        />
      )}
      {keybindPopup && (
        <KeybindPopup
          judgeName={judgeName}
          setJudgeName={setJudgeName}
          keybinds={keybinds}
          setKeybinds={setKeybinds}
          handlePopupClose={handlePopupClose}
        />
      )}
      {showVideo && (
        <VideoView
          videoLink={videoLink}
          judgeName={judgeName}
          keybinds={keybinds}
          replayMode={replayMode}
        />
      )}
    </div>
  );
}

export default App;
