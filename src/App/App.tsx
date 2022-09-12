import React, { ChangeEvent, useState } from 'react';
import './App.css';
import Field from './Field';

export default function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [{ sizeX, sizeY, bombs }, setSettings] = useState({
    sizeX: 0,
    sizeY: 0,
    bombs: 0,
  });

  const handleSettingChange = (type: string, value: string) => {
    setSettings((settings) => ({ ...settings, [type]: +value }));
    setIsGameStarted(false);
  };

  const handleStart = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    if (sizeX && sizeY && bombs) {
      setIsGameStarted(true);
    }
  };

  const handleClear = () => {
    setIsGameStarted(false);
  };

  return (
    <div className="wrapper">
      <form className="form">
        <label htmlFor="x" className="formField">
          Select X
          <input
              id="x"
              type="number"
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleSettingChange('sizeX', e.target.value)}
          />
        </label>
        <label htmlFor="x" className="formField">
          Select Y
          <input
              id="y"
              type="number"
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleSettingChange('sizeY', e.target.value)}
          />
        </label>
        <label htmlFor="x" className="formField">
          Bombs
          <input
              id="y"
              type="number"
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleSettingChange('bombs', e.target.value)}
          />
        </label>
        <button type="submit" onClick={handleStart}>Start</button>
        <button type="button" onClick={handleClear}>Clear</button>
      </form>

      {isGameStarted && <Field sizeX={sizeX} sizeY={sizeY} bombs={bombs} />}
    </div>
  );
}
