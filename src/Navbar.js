import React, { useState } from 'react';
import KeybindPopup from './KeybindPopup';

function Navbar({ keybinds, setKeybinds, judgeName, setJudgeName }) {
    const [isKeybindPopupVisible, setKeybindPopupVisible] = useState(false);

    const handleSettingsClick = () => {
        setKeybindPopupVisible(true);
    };

    const closeKeybindPopup = () => {
        setKeybindPopupVisible(false);
    };

    return (
        <nav>
            <ul>
                <li>
                    <button onClick={handleSettingsClick}>Settings</button>
                </li>
            </ul>
            {isKeybindPopupVisible && (
                <KeybindPopup keybinds={keybinds}
                    setKeybinds={setKeybinds}
                    judgeName={judgeName}
                    setJudgeName={setJudgeName}
                    handlePopupClose={closeKeybindPopup} />
            )}
        </nav>
    );
};

export default Navbar;
