export enum PlayerColor {
  White = 'white',
  Black = 'black',
}

export enum PieceType {
  ProductOwner = 'ProductOwner',
  Developer = 'Developer',
  Designer = 'Designer',
}

export interface GamePiece {
  id: string; // Unique ID for each piece instance
  type: PieceType;
  color: PlayerColor;
  // Add position later if needed directly on the piece, or manage via board state
}

export interface SquareState {
  piece: GamePiece | null;
  // Add other square properties if needed, e.g., highlight, valid move indicator
}

export type BoardState = SquareState[][]; // A 2D array representing the board

export interface Position {
  row: number;
  col: number;
}

export interface GameContextType {
  boardState: BoardState;
  setBoardState: React.Dispatch<React.SetStateAction<BoardState>>;
  currentPlayer: PlayerColor;
  setCurrentPlayer: React.Dispatch<React.SetStateAction<PlayerColor>>;
  selectedPiece: { piece: GamePiece; position: Position } | null;
  setSelectedPiece: React.Dispatch<
    React.SetStateAction<{ piece: GamePiece; position: Position } | null>
  >;
  gameDimensions: { rows: number; cols: number };
  setGameDimensions: React.Dispatch<
    React.SetStateAction<{ rows: number; cols: number }>
  >;
  // Add more game state and functions as needed: movePiece, checkWin, etc.
}
