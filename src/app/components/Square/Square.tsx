import React from 'react';
import { SquareState, Position } from '@/types';
import PieceDisplay from '../Piece/Piece'; // Updated import
import styles from './Square.module.scss';

interface SquareProps {
  squareData: SquareState;
  position: Position;
  isSelected: boolean;
  isValidTarget: boolean; // New prop to indicate if this square is a valid move target
  onClick: (position: Position) => void;
}

const Square: React.FC<SquareProps> = ({
  squareData,
  position,
  isSelected,
  isValidTarget,
  onClick,
}) => {
  const squareClasses = [
    styles.square,
    (position.row + position.col) % 2 === 0 ? styles.light : styles.dark,
    isSelected ? styles.selected : '',
    isValidTarget ? styles.validTarget : '',
  ]
    .join(' ')
    .trim();

  return (
    <div className={squareClasses} onClick={() => onClick(position)}>
      {squareData.piece && <PieceDisplay piece={squareData.piece} />}
    </div>
  );
};

export default Square;
