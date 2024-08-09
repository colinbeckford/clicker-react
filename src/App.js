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
    plusOne: '1',
    plusTwo: '2',
    minusOne: '3',
    saveScore: '4',
  });

  const [showVideo, setShowVideo] = useState(false);
  const [initiateVideo, setInitiateVideo] = useState(false);

  useEffect(() => {
    fetch('/getLinks')
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const handlePopupClose = () => {
    setKeybindPopup(false);
    if (initiateVideo) {
      setShowVideo(true);
    }
  };

  const handleKeybindPopup = () => {
    setKeybindPopup(true);
    setInitiateVideo(true);
  };

  const handleShowVideo = () => {
    setShowVideo(true);
  };



  return (
    <div>
      <Navbar keybinds={keybinds} setKeybinds={setKeybinds} judgeName={judgeName}
        setJudgeName={setJudgeName} />
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
          setJudgeName={setJudgeName}
          keybinds={keybinds}
          setKeybinds={setKeybinds}
          setKeybindPopup={setKeybindPopup}
        />
      )}
    </div>
  );
}

export default App;
