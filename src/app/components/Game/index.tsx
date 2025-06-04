'use client'; // This component will use client-side React features like useState

import React, { useState, useEffect, useCallback } from 'react';
import {
  BoardState,
  PlayerColor,
  Position,
  GamePiece,
  PieceType,
} from '@/types';
import {
  initializeBoard,
  attemptMove,
  checkWinCondition,
  DEFAULT_BOARD_SIZE,
} from '@/lib/gameLogic';
import Board from '@/app/components/Board';
import Controls from '@/app/components/Controls/Controls';
import styles from './Game.module.scss';

const Game: React.FC = () => {
  const [gameDimensions, setGameDimensions] = useState({
    rows: DEFAULT_BOARD_SIZE,
    cols: DEFAULT_BOARD_SIZE,
  });
  const [boardState, setBoardState] = useState<BoardState>(() =>
    initializeBoard(gameDimensions.rows, gameDimensions.cols)
  );
  const [currentPlayer, setCurrentPlayer] = useState<PlayerColor>(
    PlayerColor.White
  );
  const [selectedPiece, setSelectedPiece] = useState<{
    piece: GamePiece;
    position: Position;
  } | null>(null);
  const [winner, setWinner] = useState<PlayerColor | null>(null);
  const [message, setMessage] = useState<string>(`White's turn`);

  const startGame = useCallback((rows: number, cols: number) => {
    setGameDimensions({ rows, cols });
    setBoardState(initializeBoard(rows, cols));
    setCurrentPlayer(PlayerColor.White);
    setSelectedPiece(null);
    setWinner(null);
    setMessage(`${PlayerColor.White}'s turn`);
  }, []);

  useEffect(() => {
    // Initialize board on first load with default dimensions
    startGame(DEFAULT_BOARD_SIZE, DEFAULT_BOARD_SIZE);
  }, [startGame]);

  const handleSquareClick = (position: Position) => {
    if (winner) return; // Game over

    const clickedSquare = boardState[position.row][position.col];

    if (selectedPiece) {
      // Attempt to move the selected piece
      if (selectedPiece.piece.color !== currentPlayer) {
        setMessage(
          `Not your turn, ${selectedPiece.piece.color}. It's ${currentPlayer}'s turn.`
        );
        return;
      }

      const moveResult = attemptMove(
        boardState,
        selectedPiece.position,
        position,
        selectedPiece.piece
      );

      if (moveResult) {
        const { newBoard, capturedPiece } = moveResult;
        setBoardState(newBoard);

        if (capturedPiece) {
          setMessage(
            `${selectedPiece.piece.type} captured ${capturedPiece.type}!`
          );
          // Check win condition
          if (capturedPiece.type === PieceType.ProductOwner) {
            setWinner(currentPlayer);
            setMessage(`${currentPlayer} wins by capturing the Product Owner!`);
            return; // End turn processing
          }
        } else {
          setMessage(''); // Clear previous message if move was successful without capture
        }

        // Switch turns
        const nextPlayer =
          currentPlayer === PlayerColor.White
            ? PlayerColor.Black
            : PlayerColor.White;
        setCurrentPlayer(nextPlayer);
        setSelectedPiece(null);
        if (!winner) {
          // ensure winner message isn't overwritten
          setMessage(`${nextPlayer}'s turn`);
        }
      } else {
        // Invalid move, deselect or allow reselection
        setMessage('Invalid move. Try again.');
        setSelectedPiece(null); // Deselect on invalid move
      }
    } else {
      // Select a piece
      if (clickedSquare.piece && clickedSquare.piece.color === currentPlayer) {
        setSelectedPiece({ piece: clickedSquare.piece, position });
        setMessage(
          `${currentPlayer}'s turn: ${clickedSquare.piece.type} selected.`
        );
      } else if (clickedSquare.piece) {
        setMessage(`Not your piece! It's ${currentPlayer}'s turn.`);
      } else {
        setMessage(
          `Empty square. Select one of your pieces. It's ${currentPlayer}'s turn.`
        );
      }
    }
  };

  return (
    <div className={styles.gameContainer}>
      <Controls
        defaultRows={gameDimensions.rows}
        defaultCols={gameDimensions.cols}
        onStartGame={startGame}
      />
      {winner && <h2 className={styles.winnerText}>{`${winner} Wins!`}</h2>}
      {!winner && (
        <p className={styles.turnIndicator}>
          {message || `${currentPlayer}'s Turn`}
        </p>
      )}
      <Board
        boardState={boardState}
        onSquareClick={handleSquareClick}
        selectedPieceInfo={selectedPiece}
        gameDimensions={gameDimensions}
      />
      {/* Add game status, captured pieces display, etc. later */}
    </div>
  );
};

export default Game;
