import React, { useEffect, useState } from "react";
import ButtonOptions from './ButtonOptions';

function VideoList({ closeVideoList, handleKeybindPopup, handleShowVideo, videoLink, setVideoLink }) {
  const [freestyleList, setFreestyleList] = useState([]);
  const [featuredList, setFeaturedList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch('/getLinks')
      .then(response => response.json())
      .then(data => setFreestyleList(data))
      .catch(error => console.error('Error:', error));
  }, []);

  useEffect(() => {
    if (freestyleList.length > 0) {
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
          setFeaturedList(data.slice(0, 15)); 
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [freestyleList]);

  const handleSearch = () => {
    const requestData = {
      query: searchQuery,
    };
    fetch('/api/search', {
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
        setFeaturedList(data.slice(0, 15)); 
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleSetFreestyle = (link) => {
    closeVideoList();
    setVideoLink(link);
  }

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search YouTube"
      />
      <button onClick={handleSearch}>Search</button>
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
