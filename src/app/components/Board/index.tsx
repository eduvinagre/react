import React from 'react';
import { BoardState, Position, GamePiece } from '@/types';
import Square from '../Square';
import styles from './Board.module.scss';
import { isValidMove } from '@/lib/gameLogic';

interface BoardProps {
  boardState: BoardState;
  onSquareClick: (position: Position) => void;
  selectedPieceInfo: { piece: GamePiece; position: Position } | null;
  gameDimensions: { rows: number; cols: number };
}

const Board: React.FC<BoardProps> = ({
  boardState,
  onSquareClick,
  selectedPieceInfo,
  gameDimensions,
}) => {
  const boardStyle = {
    gridTemplateRows: `repeat(${gameDimensions.rows}, 1fr)`,
    gridTemplateColumns: `repeat(${gameDimensions.cols}, 1fr)`,
  };

  return (
    <div className={styles.boardContainer}>
      <div className={styles.board} style={boardStyle}>
        {boardState.map((rowSquares, rowIndex) =>
          rowSquares.map((squareData, colIndex) => {
            const currentPosition = { row: rowIndex, col: colIndex };
            const isSelected =
              selectedPieceInfo?.position.row === rowIndex &&
              selectedPieceInfo?.position.col === colIndex;
            let isValidTarget = false;
            if (selectedPieceInfo) {
              isValidTarget = isValidMove(
                boardState,
                selectedPieceInfo.position,
                currentPosition,
                selectedPieceInfo.piece
              );
            }
            return (
              <Square
                key={`${rowIndex}-${colIndex}`}
                squareData={squareData}
                position={currentPosition}
                isSelected={!!isSelected}
                isValidTarget={isValidTarget}
                onClick={onSquareClick}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Board;
