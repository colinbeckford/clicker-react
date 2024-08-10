import React, { useState } from 'react';
import KeybindPopup from './KeybindPopup';
import VideoList from './VideoList';

function Navbar({ keybinds, setKeybinds, judgeName, setJudgeName, videoLink, setVideoLink, handleKeybindPopup, handleShowVideo }) {
    const [isKeybindPopupVisible, setKeybindPopupVisible] = useState(false);
    const [isVideoListVisible, setVideoListVisible] = useState(false);

    const handleSettingsClick = () => {
        setKeybindPopupVisible(true);
    };

    const closeKeybindPopup = () => {
        setKeybindPopupVisible(false);
    };

    const handleVideoListClick = () => {
        setVideoListVisible(true);
    }

    const closeVideoList = () => {
        setVideoListVisible(false);
    }
    return (
        <nav>
            <ul>
                <li>
                    <button onClick={handleSettingsClick}>Settings</button>
                </li>
                <li>
                    <button onClick={handleVideoListClick}>Video List</button>
                </li>
            </ul>
            {isKeybindPopupVisible && (
                <KeybindPopup keybinds={keybinds}
                    setKeybinds={setKeybinds}
                    judgeName={judgeName}
                    setJudgeName={setJudgeName}
                    handlePopupClose={closeKeybindPopup} />
            )}
            {isVideoListVisible && (
                <VideoList closeVideoList={closeVideoList} handleKeybindPopup={handleKeybindPopup}
                handleShowVideo={handleShowVideo} videoLink={videoLink} setVideoLink={setVideoLink} />
            )}
        </nav>
    );
};

export default Navbar;
