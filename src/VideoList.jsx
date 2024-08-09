import React, { useEffect, useState } from "react";
import ButtonOptions from './ButtonOptions';

function VideoList({ handleKeybindPopup, handleShowVideo }) {

    const [freestyleList, setFreestyleList] = useState([]);

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
                  console.log('Success:', data);
                })
                .catch((error) => {
                  console.error('Error:', error); 
                });
        }
      }, [freestyleList]);

      


  return (
    <div>
    </div>
  );
}

export default VideoList;
