import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import Navbar from './Navbar';

function VideoView({ videoLink, keybinds, setKeybinds, judgeName, setJudgeName }) {
  const [score, setScore] = useState(0);
  const [positiveScore, setPositiveScore] = useState(0);
  const [negativeScore, setNegativeScore] = useState(0);
  const [doubleClicks, setDoubleClicks] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [scoreList, setScoreList] = useState([]);
  const [videoId, setVideoId] = useState("");

  const handleKeyPress = (event) => {
    switch (event.key) {
      case keybinds.plusOne:
        setPositiveScore(positiveScore + 1);
        setScore(score + 1);
        break;
      case keybinds.plusTwo:
        setPositiveScore(positiveScore + 2);
        setScore(score + 2);
        setDoubleClicks(doubleClicks + 2);
        break;
      case keybinds.minusOne:
        setNegativeScore(negativeScore + 1);
        setScore(score - 1);
        break;
      case keybinds.saveScore:
        console.log(scoreList);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (score !== 0 || scoreList.length > 0) {
      setScoreList((prevScores) => [
        ...prevScores,
        { judge: judgeName, link: videoId, second: Number(currentTime.toFixed(1)), score: score },
      ]);
    }
  }, [score]);

  useEffect(() => {
    setVideoId(getVideoId(videoLink));
  }, [videoLink]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [score, keybinds, currentTime]);

  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds);
  };

  const getVideoId = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  return (
    <div>
      <Navbar keybinds={keybinds} setKeybinds={setKeybinds} judgeName={judgeName}
        setJudgeName={setJudgeName} />
      <div>
        Score: +{positiveScore} -{negativeScore}
      </div>
      <ReactPlayer
        url={videoLink}
        controls
        onProgress={handleProgress}
        progressInterval={7}
      />
    </div>
  );
}

export default VideoView;
