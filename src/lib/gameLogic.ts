import {
  BoardState,
  PieceType,
  PlayerColor,
  GamePiece,
  Position,
  SquareState,
} from '@/types';

export const MIN_BOARD_SIZE = 6;
export const MAX_BOARD_SIZE = 12;
export const DEFAULT_BOARD_SIZE = 6;

let pieceIdCounter = 0;
const createPiece = (type: PieceType, color: PlayerColor): GamePiece => ({
  id: `piece-${pieceIdCounter++}`,
  type,
  color,
});

export const initializeBoard = (rows: number, cols: number): BoardState => {
  if (
    rows < MIN_BOARD_SIZE ||
    rows > MAX_BOARD_SIZE ||
    cols < MIN_BOARD_SIZE ||
    cols > MAX_BOARD_SIZE
  ) {
    throw new Error(
      `Board dimensions must be between ${MIN_BOARD_SIZE} and ${MAX_BOARD_SIZE}`
    );
  }

  const newBoard: BoardState = Array(rows)
    .fill(null)
    .map(() =>
      Array(cols)
        .fill(null)
        .map(() => ({ piece: null }))
    );

  // Reset piece ID counter for consistent IDs on re-initialization (if needed)
  pieceIdCounter = 0;

  // Place Black pieces
  if (cols > 2) {
    // Ensure enough space for all pieces
    newBoard[0][cols - 1].piece = createPiece(
      PieceType.ProductOwner,
      PlayerColor.Black
    );
    newBoard[0][cols - 2].piece = createPiece(
      PieceType.Developer,
      PlayerColor.Black
    );
    newBoard[0][cols - 3].piece = createPiece(
      PieceType.Designer,
      PlayerColor.Black
    );
  }

  // Place White pieces
  if (cols > 2) {
    newBoard[rows - 1][0].piece = createPiece(
      PieceType.ProductOwner,
      PlayerColor.White
    );
    newBoard[rows - 1][1].piece = createPiece(
      PieceType.Developer,
      PlayerColor.White
    );
    newBoard[rows - 1][2].piece = createPiece(
      PieceType.Designer,
      PlayerColor.White
    );
  }

  return newBoard;
};

// Basic placeholder for movement validation
export const isValidMove = (
  board: BoardState,
  from: Position,
  to: Position,
  piece: GamePiece
): boolean => {
  const { rows, cols } = { rows: board.length, cols: board[0].length };
  const targetPiece = board[to.row][to.col].piece;

  // Prevent moving to the same square
  if (from.row === to.row && from.col === to.col) return false;

  // Prevent moving outside board boundaries
  if (to.row < 0 || to.row >= rows || to.col < 0 || to.col >= cols)
    return false;

  // Prevent capturing own piece
  if (targetPiece && targetPiece.color === piece.color) return false;

  // Piece-specific logic
  switch (piece.type) {
    case PieceType.ProductOwner:
      // Can move one square in any direction
      const dRowPO = Math.abs(to.row - from.row);
      const dColPO = Math.abs(to.col - from.col);
      return dRowPO <= 1 && dColPO <= 1 && (dRowPO !== 0 || dColPO !== 0);

    case PieceType.Developer:
      // Can jump up to 3 squares in any direction (vertical, horizontal, or diagonal)
      // "Can NOT jump to squares that are already occupied" - this usually refers to the landing square.
      // "Captures other pieces by jumping above them"
      const dRowDev = Math.abs(to.row - from.row);
      const dColDev = Math.abs(to.col - from.col);
      const isDiagonal = dRowDev === dColDev;
      const isStraight =
        (dRowDev === 0 && dColDev > 0) || (dColDev === 0 && dRowDev > 0);

      if (!isDiagonal && !isStraight) return false; // Must be straight or diagonal
      if (dRowDev > 3 || dColDev > 3) return false; // Max 3 squares jump

      // Capture logic: if it's a jump of 2 squares over an opponent piece
      if ((dRowDev === 2 || dColDev === 2) && dRowDev <= 2 && dColDev <= 2) {
        // A jump of 2 units in any allowed direction
        const jumpedRow = from.row + (to.row - from.row) / 2;
        const jumpedCol = from.col + (to.col - from.col) / 2;
        if (Number.isInteger(jumpedRow) && Number.isInteger(jumpedCol)) {
          const jumpedSquare = board[jumpedRow][jumpedCol];
          if (jumpedSquare.piece && jumpedSquare.piece.color !== piece.color) {
            // This is a capture by jumping, landing square must be empty
            return !targetPiece;
          }
        }
      }
      // Normal move (not capturing by jumping over) - landing square can be empty or opponent for capture
      // If it's a 1-square move, or a longer move not capturing by jumping.
      // It can't land on an occupied square IF THE INTENTION IS A NON-CAPTURE JUMP
      // The rule "Can NOT jump to squares that are already occupied" combined with
      // "Captures other pieces by jumping above them" is a bit tricky.
      // Let's assume:
      // 1. It can move 1-3 squares to an EMPTY square.
      // 2. It can capture by JUMPING EXACTLY ONE piece (distance of 2 squares) landing on an EMPTY square beyond.
      // 3. It cannot make a non-capture jump (1 or 3 squares) to an already occupied square.
      // The provided diagram shows capturing by jumping an adjacent piece.
      if (targetPiece && (dRowDev > 1 || dColDev > 1)) return false; // Cannot make a long jump onto an occupied square

      return true; // Simplified for now, needs path checking if it can't jump over non-target pieces

    case PieceType.Designer:
      // L-shape: 2 squares in one cardinal direction, then 1 square perpendicular
      const dRowDes = Math.abs(to.row - from.row);
      const dColDes = Math.abs(to.col - from.col);
      return (
        (dRowDes === 2 && dColDes === 1) || (dRowDes === 1 && dColDes === 2)
      );

    default:
      return false;
  }
};

export const attemptMove = (
  board: BoardState,
  from: Position,
  to: Position,
  piece: GamePiece
): { newBoard: BoardState; capturedPiece: GamePiece | null } | null => {
  if (!isValidMove(board, from, to, piece)) {
    return null;
  }

  const newBoard = board.map((row) => row.map((square) => ({ ...square }))); // Deep copy
  let capturedPiece: GamePiece | null = null;

  if (piece.type === PieceType.Developer) {
    const dRow = Math.abs(to.row - from.row);
    const dCol = Math.abs(to.col - from.col);
    // Check for capture by jumping (Developer)
    if ((dRow === 2 || dCol === 2) && dRow <= 2 && dCol <= 2) {
      // Jump of 2
      const jumpedRow = from.row + (to.row - from.row) / 2;
      const jumpedCol = from.col + (to.col - from.col) / 2;
      if (Number.isInteger(jumpedRow) && Number.isInteger(jumpedCol)) {
        const jumpedSquarePiece = newBoard[jumpedRow][jumpedCol].piece;
        if (jumpedSquarePiece && jumpedSquarePiece.color !== piece.color) {
          capturedPiece = jumpedSquarePiece;
          newBoard[jumpedRow][jumpedCol].piece = null; // Remove the jumped piece
        }
      }
    } else {
      // Normal move/capture for Developer (landing on target)
      capturedPiece = newBoard[to.row][to.col].piece;
    }
  } else {
    // Designer and Product Owner capture by moving on top
    capturedPiece = newBoard[to.row][to.col].piece;
  }

  newBoard[to.row][to.col].piece = piece;
  newBoard[from.row][from.col].piece = null;

  return { newBoard, capturedPiece };
};

export const checkWinCondition = (
  board: BoardState,
  opponentColor: PlayerColor
): boolean => {
  // Win condition: capture the opponent's Product Owner
  for (const row of board) {
    for (const square of row) {
      if (
        square.piece &&
        square.piece.type === PieceType.ProductOwner &&
        square.piece.color === opponentColor
      ) {
        return false; // Opponent's Product Owner still on board
      }
    }
  }
  return true; // Opponent's Product Owner is captured
};
