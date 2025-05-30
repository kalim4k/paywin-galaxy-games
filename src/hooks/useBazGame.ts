
import { useCallback } from 'react';
import { toast } from '@/components/ui/sonner';
import { useGameBalance } from './useGameBalance';
import { useGameState } from './useGameState';
import { 
  calculateMultiplier, 
  getNextMultipliers, 
  initializeGameBoard,
  shouldPlaceBazBomb,
  fillRemainingBombs
} from '@/utils/bazGameUtils';

export const useBazGame = () => {
  const { profile, updateBalance } = useGameBalance();
  const {
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
    setIsPlaying,
    setGameBoard,
    setRevealedCells,
    setCurrentMultiplier,
    setGameEnded,
    setWon,
    setRevealedStars,
    setIsProcessing,
    setBombsPlaced,
    adjustBet,
    adjustBombs,
    resetGame
  } = useGameState();

  const initializeBoard = () => {
    const newBoard = initializeGameBoard(bombs);
    setGameBoard(newBoard);
    setRevealedCells(Array(25).fill(false));
    setCurrentMultiplier(1);
    setGameEnded(false);
    setWon(false);
    setRevealedStars(0);
    setBombsPlaced(0);
  };

  const startGame = async () => {
    if (!profile || isProcessing) return;

    if (bet > profile.balance) {
      toast.error('Solde insuffisant pour cette mise');
      return;
    }

    setIsProcessing(true);

    try {
      setIsPlaying(true);
      initializeBoard();
      
      const newBalance = profile.balance - bet;
      await updateBalance(
        newBalance,
        'game_loss',
        bet,
        `Mise au jeu Baz - ${bombs} bombes`
      );
    } catch (error) {
      setIsPlaying(false);
      console.error('Erreur lors du démarrage:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCellClick = useCallback((index: number) => {
    if (!isPlaying || revealedCells[index] || gameEnded) return;

    const newRevealedCells = [...revealedCells];
    newRevealedCells[index] = true;
    setRevealedCells(newRevealedCells);

    // Utiliser la logique Baz avec probabilités très favorables
    const shouldBeBomb = shouldPlaceBazBomb(revealedStars, bombsPlaced, bombs, revealedCells);
    
    const newBoard = [...gameBoard];
    
    if (shouldBeBomb) {
      newBoard[index] = 'bomb';
      setGameBoard(newBoard);
      setBombsPlaced(bombsPlaced + 1);
      
      const finalBoard = fillRemainingBombs(newBoard, newRevealedCells, bombsPlaced + 1, bombs);
      setGameBoard(finalBoard);
      
      const allRevealed = Array(25).fill(true);
      setRevealedCells(allRevealed);
      setGameEnded(true);
      setWon(false);
      setIsPlaying(false);
      
      toast.error(`💥 Boom ! Vous avez touché une bombe !`, {
        description: `Vous avez perdu ${bet.toLocaleString()} FCFA`,
        duration: 5000,
      });
    } else {
      const newStarsFound = revealedStars + 1;
      setRevealedStars(newStarsFound);
      const newMultiplier = calculateMultiplier(newStarsFound, bombs);
      setCurrentMultiplier(newMultiplier);
      
      console.log(`Étoile trouvée dans Baz ! Total: ${newStarsFound}, Bombes placées: ${bombsPlaced}/${bombs}`);
    }
  }, [isPlaying, revealedCells, gameEnded, gameBoard, revealedStars, bombs, bet, bombsPlaced]);

  const cashOut = async () => {
    if (!isPlaying || revealedStars === 0 || !profile || isProcessing) return;

    setIsProcessing(true);
    
    try {
      const winnings = Math.floor(bet * currentMultiplier);
      const netGain = winnings - bet;
      
      setGameEnded(true);
      setWon(true);
      setIsPlaying(false);
      
      const finalBoard = fillRemainingBombs(gameBoard, revealedCells, bombsPlaced, bombs);
      setGameBoard(finalBoard);
      
      const allRevealed = Array(25).fill(true);
      setRevealedCells(allRevealed);
      
      toast.success(`🎉 Félicitations ! Vous avez gagné ${winnings.toLocaleString()} FCFA !`, {
        description: `Gain net: +${netGain.toLocaleString()} FCFA`,
        duration: 5000,
      });
      
      const newBalance = profile.balance + winnings;
      await updateBalance(
        newBalance,
        'game_win',
        netGain,
        `Gain au jeu Baz - ${revealedStars} étoiles trouvées`
      );
    } catch (error) {
      console.error('Erreur lors du retrait:', error);
      toast.error('Erreur lors du retrait des gains');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
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
    profile,
    potentialWin: bet * currentMultiplier,
    nextMultipliers: getNextMultipliers(revealedStars, bombs),
    startGame,
    handleCellClick,
    cashOut,
    resetGame,
    adjustBet,
    adjustBombs,
    calculateMultiplier
  };
};
