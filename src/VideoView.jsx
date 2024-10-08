import React, { useEffect, useState, useRef, useMemo } from "react";
import ReactPlayer from "react-player";
import LineGraph from "./LineGraph";

function VideoView({ videoLink, keybinds, judgeName, replayMode }) {
  const [videoId, setVideoId] = useState("");
  const [rawScore, setRawScore] = useState(0);
  const [positiveScore, setPositiveScore] = useState(0);
  const [negativeScore, setNegativeScore] = useState(0);
  const [formattedScore, setFormattedScore] = useState("");
  const [doubleClicks, setDoubleClicks] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [scoreList, setScoreList] = useState([]);
  const [replayScoreList, setReplayScoreList] = useState([]);
  const [replayJudgeNames, setReplayJudgeNames] = useState([]);
  const [selectedJudge, setSelectedJudge] = useState("");
  const [selectedScores, setSelectedScores] = useState([]);
  const [seeking, setSeeking] = useState(false);
  const [playing, setPlaying] = useState(false); 

  const playerRef = useRef(null);

  const handleKeyPress = (event) => {
    if (!replayMode) {
      switch (event.key) {
        case keybinds.plusOne:
          setPositiveScore(positiveScore + 1);
          setRawScore(rawScore + 1);
          break;
        case keybinds.plusTwo:
          setPositiveScore(positiveScore + 2);
          setRawScore(rawScore + 2);
          setDoubleClicks(doubleClicks + 2);
          break;
        case keybinds.minusOne:
          setNegativeScore(negativeScore - 1);
          setRawScore(rawScore - 1);
          break;
        case keybinds.saveScore:
          saveScores(scoreList);
          break;
        default:
          break;
      }
    }
  };

  const saveScores = (scoreList) => {
    const requestData = {
      scores: scoreList,
    };
    fetch("/appendClicks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    if (videoId && replayMode) {
      fetch(`/getClicks/${videoId}`)
        .then((response) => response.json())
        .then((data) => {
          const groupedScores = data.reduce((acc, item) => {
            const { judge } = item;
            if (!acc[judge]) {
              acc[judge] = [];
            }
            acc[judge].push(item);
            return acc;
          }, {});
          setReplayScoreList(groupedScores);
          const names = Object.keys(groupedScores);
          setReplayJudgeNames(names);
          if (names.length > 0) {
            setSelectedJudge(names[0]);
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [videoId]);

  useEffect(() => {
    if (selectedJudge !== "") {
      setSelectedScores(replayScoreList[selectedJudge]);
    }
  }, [selectedJudge]);

  useEffect(() => {
    if (rawScore !== 0 || scoreList.length > 0) {
      setScoreList((prevScores) => [
        ...prevScores,
        {
          judge: judgeName,
          link: videoId,
          second: Number(currentTime.toFixed(1)),
          score: rawScore,
        },
      ]);
    }
  }, [rawScore]);

  useEffect(() => {
    if (videoLink) {
      setVideoId(getVideoId(videoLink));
    }
  }, [videoLink]);

  const getScoreAtSecond = (second) => {
    let index = 0;
    let cumulativePositiveScore = 0;
    let cumulativeNegativeScore = 0;
    while (
      index < selectedScores.length - 1 &&
      second >= selectedScores[index].second
    ) {
      let difference =
        selectedScores[index + 1].score - selectedScores[index].score;
      if (difference > 0) {
        cumulativePositiveScore += difference;
      } else {
        cumulativeNegativeScore += difference;
      }
      index++;
    }
    setPositiveScore(cumulativePositiveScore);
    setNegativeScore(cumulativeNegativeScore);
  };

  useEffect(() => {
    if (
      replayMode &&
      selectedScores &&
      selectedScores.length > 0 &&
      currentTime > 0
    ) {
      const closestIndex = selectedScores.findIndex(
        (score) => Number(currentTime.toFixed(1)) <= score.second
      );

      if (closestIndex !== -1) {
        if (
          Number(currentTime.toFixed(1)) ===
          selectedScores[closestIndex].second
        ) {
          console.log(Number(currentTime.toFixed(1)));
          getScoreAtSecond(Number(currentTime.toFixed(1)));
        }
      }
    }
  }, [currentTime, selectedScores]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [rawScore, keybinds, currentTime]);

  useEffect(() => {
    console.log("Formatted score use effect hit");
    const formatted = `+${positiveScore} -${Math.abs(negativeScore)}`;
    setFormattedScore(formatted);
  }, [positiveScore, negativeScore]);

  const handleProgress = (state) => {
    if (!seeking) {
      const time = typeof state === "object" ? state.playedSeconds : state;
      setCurrentTime(time);
    }
  };

  const handleSeek = (seconds) => {
    setSeeking(true);
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, "seconds");
      setCurrentTime(seconds);
      setPlaying(true); 
    }
  };

  const handlePlay = () => {
    setSeeking(false);
    setPlaying(true); 
  };

  const handleLineClick = (judge, second) => {
    setSelectedJudge(judge);
    handleSeek(second);
  };

  const getVideoId = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const memoizedLineGraph = useMemo(
    () => (
      <LineGraph data={replayScoreList} onLineClick={handleLineClick} />
    ),
    [replayScoreList]
  );

  return (
    <div>
      {replayMode ? (
        <div>
          <label htmlFor="judgeDropdown">Select Judge: </label>
          <select
            id="judgeDropdown"
            value={selectedJudge}
            onChange={(e) => setSelectedJudge(e.target.value)}
          >
            {replayJudgeNames.map((judge) => (
              <option key={judge} value={judge}>
                {judge}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <></>
      )}
      <div>{formattedScore}</div>
      <ReactPlayer
        ref={playerRef}
        url={videoLink}
        controls
        onProgress={handleProgress}
        onSeek={handleProgress}
        progressInterval={10}
        playing={playing} 
        onPlay={handlePlay}
      />
      {memoizedLineGraph}
    </div>
  );
}

export default VideoView;
