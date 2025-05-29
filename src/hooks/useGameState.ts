
import { useState } from 'react';

export const useGameState = () => {
  const [bet, setBet] = useState(200);
  const [bombs, setBombs] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameBoard, setGameBoard] = useState<('hidden' | 'star' | 'bomb')[]>(Array(25).fill('hidden'));
  const [revealedCells, setRevealedCells] = useState<boolean[]>(Array(25).fill(false));
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [gameEnded, setGameEnded] = useState(false);
  const [won, setWon] = useState(false);
  const [revealedStars, setRevealedStars] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  // Nouveau: Compteur de bombes placées dynamiquement
  const [bombsPlaced, setBombsPlaced] = useState(0);

  const adjustBet = (amount: number) => {
    if (!isPlaying && !isProcessing) {
      setBet(Math.max(200, bet + amount));
    }
  };

  const adjustBombs = (amount: number) => {
    if (!isPlaying && !isProcessing) {
      setBombs(Math.max(1, Math.min(24, bombs + amount)));
    }
  };

  const resetGame = () => {
    if (isProcessing) return;
    setIsPlaying(false);
    setGameBoard(Array(25).fill('hidden'));
    setRevealedCells(Array(25).fill(false));
    setCurrentMultiplier(1);
    setGameEnded(false);
    setWon(false);
    setRevealedStars(0);
    setBombsPlaced(0);
  };

  return {
    // State
    bet,
    bombs,
    isPlaying,
    gameBoard,
    revealedCells,
    currentMultiplier,
    gameEnded,
    won,
    revealedStars,
    isProcessing,
    bombsPlaced,
    
    // Setters
    setBet,
    setBombs,
    setIsPlaying,
    setGameBoard,
    setRevealedCells,
    setCurrentMultiplier,
    setGameEnded,
    setWon,
    setRevealedStars,
    setIsProcessing,
    setBombsPlaced,
    
    // Actions
    adjustBet,
    adjustBombs,
    resetGame
  };
};
