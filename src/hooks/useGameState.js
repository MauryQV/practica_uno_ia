// hooks/useGameState.js

import { useState } from 'react';
import { gameUtils } from '../utils/GameUtils';

export const useGameState = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [gamesPlayed, setGamesPlayed] = useState({ x: 0, o: 0, draw: 0 });

  const makeMove = (index, player) => {
    if (board[index] || gameOver) return false;

    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);
    setLastMove(index);

    const winResult = gameUtils.calculateWinner(newBoard);
    if (winResult) {
      setWinner(winResult);
      setGameOver(true);
      setGamesPlayed(prev => ({ 
        ...prev, 
        [player.toLowerCase()]: prev[player.toLowerCase()] + 1 
      }));
    } else if (gameUtils.isDraw(newBoard)) {
      setGameOver(true);
      setGamesPlayed(prev => ({ ...prev, draw: prev.draw + 1 }));
    }

    return true;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
    setWinner(null);
    setLastMove(null);
  };

  return {
    board,
    isXNext,
    setIsXNext,
    gameOver,
    winner,
    lastMove,
    gamesPlayed,
    makeMove,
    resetGame
  };
};