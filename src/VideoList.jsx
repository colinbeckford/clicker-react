import React, { useEffect, useState } from "react";
import ButtonOptions from './ButtonOptions';

function VideoList({ closeVideoList, handleKeybindPopup, handleShowVideo, videoLink, setVideoLink }) {

  const [freestyleList, setFreestyleList] = useState([]);
  const [featuredList, setFeaturedList] = useState([]);

  useEffect(() => {
    fetch('/getLinks')
      .then(response => response.json())
      .then(data => setFreestyleList(data))
      .catch(error => console.error('Error:', error));
  }, []);

  useEffect(() => {
    console.log(videoLink);
  }, [videoLink]);

  useEffect(() => {
    if (freestyleList.length > 0) {
      console.log(freestyleList);
      const requestData = {
        links: freestyleList.map(item => item.link),
      };
      fetch('/api/getVideoTitles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          setFeaturedList(data);
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [freestyleList]);

  const handleSetFreestyle = (link) => {
    closeVideoList();
    setVideoLink(link);
  }



  return (
    <div>
      <ul>
        {
          featuredList.map(item => (
            <div key={item.link}>
              <li onClick={() => handleSetFreestyle('https://www.youtube.com/watch?v=' + item.link)}>
                {item.title}
                <ButtonOptions handleKeybindPopup={handleKeybindPopup} handleShowVideo={handleShowVideo} />
              </li>
            </div>
          ))
        }
      </ul>
    </div>
  );
}

export default VideoList;
