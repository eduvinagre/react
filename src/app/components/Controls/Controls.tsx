import React, { useState } from 'react';
import { MIN_BOARD_SIZE, MAX_BOARD_SIZE } from '@/lib/gameLogic';
import styles from './Controls.module.scss';

interface ControlsProps {
  defaultRows: number;
  defaultCols: number;
  onStartGame: (rows: number, cols: number) => void;
}

const Controls: React.FC<ControlsProps> = ({
  defaultRows,
  defaultCols,
  onStartGame,
}) => {
  const [rows, setRows] = useState(defaultRows);
  const [cols, setCols] = useState(defaultCols);

  const handleStart = () => {
    if (
      rows >= MIN_BOARD_SIZE &&
      rows <= MAX_BOARD_SIZE &&
      cols >= MIN_BOARD_SIZE &&
      cols <= MAX_BOARD_SIZE
    ) {
      onStartGame(rows, cols);
    } else {
      alert(
        `Board dimensions must be between ${MIN_BOARD_SIZE}x${MIN_BOARD_SIZE} and ${MAX_BOARD_SIZE}x${MAX_BOARD_SIZE}.`
      );
    }
  };

  return (
    <div className={styles.controls}>
      <h3>Game Setup</h3>
      <div>
        <label htmlFor="rows">
          Rows ({MIN_BOARD_SIZE}-{MAX_BOARD_SIZE}):{' '}
        </label>
        <input
          type="number"
          id="rows"
          value={rows}
          min={MIN_BOARD_SIZE}
          max={MAX_BOARD_SIZE}
          onChange={(e) => setRows(parseInt(e.target.value, 10))}
        />
      </div>
      <div>
        <label htmlFor="cols">
          Columns ({MIN_BOARD_SIZE}-{MAX_BOARD_SIZE}):{' '}
        </label>
        <input
          type="number"
          id="cols"
          value={cols}
          min={MIN_BOARD_SIZE}
          max={MAX_BOARD_SIZE}
          onChange={(e) => setCols(parseInt(e.target.value, 10))}
        />
      </div>
      <button onClick={handleStart}>Start Game / Reset Board</button>
      <p className={styles.note}>
        As per instructions: "To start a match, the player has to click on the
        'play' button." This button serves that purpose.
      </p>
    </div>
  );
};

export default Controls;
