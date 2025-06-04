import { Piece } from '../types/chess';

export const getInitialBoard = (
  rows: number,
  cols: number
): (Piece | null)[][] => {
  const board: (Piece | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  );

  board[0][cols - 1] = {
    type: 'product-owner',
    player: 'black',
    row: 0,
    col: cols - 1,
    captured: false,
  };
  board[0][cols - 2] = {
    type: 'developer',
    player: 'black',
    row: 0,
    col: cols - 2,
    captured: false,
  };
  board[0][cols - 3] = {
    type: 'designer',
    player: 'black',
    row: 0,
    col: cols - 3,
    captured: false,
  };

  board[rows - 1][0] = {
    type: 'product-owner',
    player: 'white',
    row: rows - 1,
    col: 0,
    captured: false,
  };
  board[rows - 1][1] = {
    type: 'developer',
    player: 'white',
    row: rows - 1,
    col: 1,
    captured: false,
  };
  board[rows - 1][2] = {
    type: 'designer',
    player: 'white',
    row: rows - 1,
    col: 2,
    captured: false,
  };

  return board;
};
