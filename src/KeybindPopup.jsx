import React, { useState, useEffect } from 'react';

function KeybindPopup({ keybinds, setKeybinds, handlePopupClose, judgeName, setJudgeName }) {
  const [newKeybinds, setNewKeybinds] = useState(keybinds);
  const [newJudgeName, setNewJudgeName] = useState(judgeName);

  useEffect(() => {
    setNewKeybinds(keybinds);
  }, [keybinds]);

  useEffect(() => {
    setNewJudgeName(judgeName);
  }, [judgeName]);

  const handleSave = () => {
    setKeybinds(newKeybinds);
    setJudgeName(newJudgeName);
    handlePopupClose();
  };

  return (
    <div className="popup">
      <h2>Settings</h2>
      <label>Judge Name:
        <input
          type="text"
          value={newJudgeName}
          onChange={(e) => setNewJudgeName(e.target.value)}
        />
      </label>
      <label>+1:
        <input
          type="text"
          value={newKeybinds.plusOne}
          onChange={(e) => setNewKeybinds({ ...newKeybinds, plusOne: e.target.value })}
        />
      </label>
      <label>+2:
        <input
          type="text"
          value={newKeybinds.plusTwo}
          onChange={(e) => setNewKeybinds({ ...newKeybinds, plusTwo: e.target.value })}
        />
      </label>
      <label>-1:
        <input
          type="text"
          value={newKeybinds.minusOne}
          onChange={(e) => setNewKeybinds({ ...newKeybinds, minusOne: e.target.value })}
        />
      </label>
      <label>Save Score:
        <input
          type="text"
          value={newKeybinds.saveScore}
          onChange={(e) => setNewKeybinds({ ...newKeybinds, saveScore: e.target.value })}
        />
      </label>
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default KeybindPopup;
