import React from 'react';
import Image from 'next/image';
import { GamePiece, PieceType, PlayerColor } from '@/types';
import styles from './Piece.module.scss'; // We'll create this SASS module

interface PieceProps {
  piece: GamePiece;
}

const PieceDisplay: React.FC<PieceProps> = ({ piece }) => {
  // Later, you'll map PieceType and PlayerColor to actual SVG filenames
  const getPieceImage = () => {
    const typeToFilename = {
      [PieceType.ProductOwner]: 'product-owner',
      [PieceType.Developer]: 'developer',
      [PieceType.Designer]: 'designer',
    };
    const type = typeToFilename[piece.type];
    const color = piece.color.toLowerCase();
    return `/pieces/${type}-${color}.svg`;
  };

  return (
    <div
      className={`${styles.piece} ${styles[piece.color]} ${
        styles[piece.type.toLowerCase()]
      }`}
    >
      <Image
        src={getPieceImage()}
        alt={`${piece.color} ${piece.type}`}
        width={44}
        height={44}
      />
      {/* You can add more sophisticated rendering here */}
    </div>
  );
};

export default PieceDisplay; // Renamed to avoid conflict with GamePiece type
