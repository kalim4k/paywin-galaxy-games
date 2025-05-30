
import { useCallback, useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { useGameBalance } from './useGameBalance';
import { useGameState } from './useGameState';
import { 
  calculateMultiplier, 
  getNextMultipliers, 
  initializeGameBoard,
  shouldPlaceBomb,
  fillRemainingBombs
} from '@/utils/mineGameUtils';

export const useRobGame = () => {
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

  // États spécifiques au jeu Rob
  const [countdown, setCountdown] = useState(0);
  const [showingBombs, setShowingBombs] = useState(false);
  const [bombPositions, setBombPositions] = useState<number[]>([]);

  const initializeBoard = () => {
    // Générer les positions des bombes à l'avance pour Rob
    const positions: number[] = [];
    while (positions.length < bombs) {
      const randomPos = Math.floor(Math.random() * 25);
      if (!positions.includes(randomPos)) {
        positions.push(randomPos);
      }
    }
    setBombPositions(positions);

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
      
      // Démarrer le compte à rebours de 3 secondes
      setCountdown(3);
      
      const newBalance = profile.balance - bet;
      await updateBalance(
        newBalance,
        'game_loss',
        bet,
        `Mise au jeu Rob - ${bombs} bombes`
      );
    } catch (error) {
      setIsPlaying(false);
      console.error('Erreur lors du démarrage:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Effet pour gérer le compte à rebours et la révélation des bombes
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isPlaying && !gameEnded) {
      // Révéler les bombes pendant 1 seconde
      setShowingBombs(true);
      const flashTimer = setTimeout(() => {
        setShowingBombs(false);
      }, 1000);
      return () => clearTimeout(flashTimer);
    }
  }, [countdown, isPlaying, gameEnded]);

  const handleCellClick = useCallback((index: number) => {
    if (!isPlaying || revealedCells[index] || gameEnded || countdown > 0 || showingBombs) return;

    const newRevealedCells = [...revealedCells];
    newRevealedCells[index] = true;
    setRevealedCells(newRevealedCells);

    // Vérifier si cette position contient une bombe (positions prédéfinies)
    const isBomb = bombPositions.includes(index);
    
    const newBoard = [...gameBoard];
    
    if (isBomb) {
      newBoard[index] = 'bomb';
      setGameBoard(newBoard);
      setBombsPlaced(bombsPlaced + 1);
      
      // Révéler toutes les bombes restantes
      bombPositions.forEach(pos => {
        if (newBoard[pos] !== 'bomb') {
          newBoard[pos] = 'bomb';
        }
      });
      setGameBoard(newBoard);
      
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
      
      console.log(`Étoile trouvée ! Total: ${newStarsFound}, Bombes placées: ${bombsPlaced}/${bombs}`);
    }
  }, [isPlaying, revealedCells, gameEnded, gameBoard, revealedStars, bombs, bet, bombsPlaced, countdown, showingBombs, bombPositions]);

  const cashOut = async () => {
    if (!isPlaying || revealedStars === 0 || !profile || isProcessing) return;

    setIsProcessing(true);
    
    try {
      const winnings = Math.floor(bet * currentMultiplier);
      const netGain = winnings - bet;
      
      setGameEnded(true);
      setWon(true);
      setIsPlaying(false);
      
      // Révéler toutes les bombes restantes
      const finalBoard = [...gameBoard];
      bombPositions.forEach(pos => {
        if (!revealedCells[pos]) {
          finalBoard[pos] = 'bomb';
        }
      });
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
        `Gain au jeu Rob - ${revealedStars} étoiles trouvées`
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
    countdown,
    showingBombs,
    bombPositions,
    startGame,
    handleCellClick,
    cashOut,
    resetGame,
    adjustBet,
    adjustBombs,
    calculateMultiplier
  };
};
