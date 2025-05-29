
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export const useMineGame = () => {
  const { profile, refreshProfile } = useAuth();
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
  const [dynamicBombPositions, setDynamicBombPositions] = useState<number[]>([]);

  // Nouveau calcul des multiplicateurs basé sur les probabilités réelles
  const calculateMultiplier = (starsFound: number, bombCount: number) => {
    if (starsFound === 0) return 1;
    
    const totalCells = 25;
    const safeCells = totalCells - bombCount;
    
    // Probabilité de survie jusqu'à ce point
    let survivalProbability = 1;
    for (let i = 0; i < starsFound; i++) {
      const remainingSafeCells = safeCells - i;
      const remainingCells = totalCells - i;
      survivalProbability *= (remainingSafeCells / remainingCells);
    }
    
    // Facteur de risque basé sur le nombre de bombes
    const riskFactor = 1 + (bombCount * 0.15);
    
    // Facteur de progression exponentielle
    const progressionFactor = Math.pow(1.2, starsFound);
    
    // Multiplicateur final
    const baseMultiplier = 1 / survivalProbability;
    const finalMultiplier = baseMultiplier * riskFactor * progressionFactor;
    
    return Math.max(1, Number(finalMultiplier.toFixed(3)));
  };

  // Calcul de la probabilité dynamique de perdre
  const calculateLoseProbability = (starsFound: number, bombCount: number) => {
    const totalCells = 25;
    const remainingCells = totalCells - starsFound;
    const remainingBombs = bombCount;
    
    // Probabilité de base
    const baseProbability = remainingBombs / remainingCells;
    
    // Facteur d'augmentation selon les étoiles trouvées
    const riskMultiplier = 1 + (starsFound * 0.1);
    
    // Facteur selon le nombre de bombes
    const bombFactor = 1 + (bombCount * 0.05);
    
    return Math.min(0.9, baseProbability * riskMultiplier * bombFactor);
  };

  const getNextMultipliers = () => {
    const multipliers = [];
    for (let i = 1; i <= 3; i++) {
      const nextStars = revealedStars + i;
      if (nextStars <= 25 - bombs) {
        const mult = calculateMultiplier(nextStars, bombs);
        multipliers.push(mult);
      }
    }
    return multipliers;
  };

  const updateBalance = async (newBalance: number, transactionType: 'game_win' | 'game_loss', amount: number, description: string) => {
    if (!profile) return;

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          balance: newBalance, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      supabase
        .from('transactions')
        .insert({
          user_id: profile.id,
          type: transactionType,
          amount: amount,
          description: description,
          status: 'completed'
        })
        .then(({ error }) => {
          if (error) console.error('Transaction logging error:', error);
        });

      await refreshProfile();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du solde:', error);
      toast.error('Erreur lors de la mise à jour du solde');
    }
  };

  // Nouveau système de placement dynamique des bombes
  const initializeBoard = () => {
    const newBoard: ('hidden' | 'star' | 'bomb')[] = Array(25).fill('star');
    
    // Positions stratégiques selon le comportement des joueurs
    const edgePositions = [0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24];
    const cornerPositions = [0, 4, 20, 24];
    const centerPositions = [6, 7, 8, 11, 12, 13, 16, 17, 18];
    
    const bombPositions = [];
    
    // Placement intelligent selon le nombre de bombes
    if (bombs <= 3) {
      // Peu de bombes : favoriser les positions dangereuses
      const dangerousPositions = [...cornerPositions, ...edgePositions.slice(0, 8)];
      for (let i = 0; i < bombs && i < dangerousPositions.length; i++) {
        const pos = dangerousPositions[Math.floor(Math.random() * dangerousPositions.length)];
        if (!bombPositions.includes(pos)) {
          bombPositions.push(pos);
        } else {
          i--; // Réessayer
        }
      }
    } else if (bombs <= 7) {
      // Bombes moyennes : mélange stratégique
      const strategicPositions = [...edgePositions];
      for (let i = 0; i < Math.floor(bombs * 0.6); i++) {
        const pos = strategicPositions[Math.floor(Math.random() * strategicPositions.length)];
        if (!bombPositions.includes(pos)) {
          bombPositions.push(pos);
        } else {
          i--;
        }
      }
      
      // Compléter avec des positions aléatoires
      while (bombPositions.length < bombs) {
        const pos = Math.floor(Math.random() * 25);
        if (!bombPositions.includes(pos)) {
          bombPositions.push(pos);
        }
      }
    } else {
      // Beaucoup de bombes : répartition plus équilibrée
      while (bombPositions.length < bombs) {
        const pos = Math.floor(Math.random() * 25);
        if (!bombPositions.includes(pos)) {
          bombPositions.push(pos);
        }
      }
    }
    
    // Placer les bombes
    bombPositions.forEach(pos => {
      newBoard[pos] = 'bomb';
    });
    
    setDynamicBombPositions(bombPositions);
    console.log(`Placement dynamique - ${bombs} bombes aux positions:`, bombPositions);
    console.log(`Probabilité de perdre initiale: ${(calculateLoseProbability(0, bombs) * 100).toFixed(1)}%`);
    
    setGameBoard(newBoard);
    setRevealedCells(Array(25).fill(false));
    setCurrentMultiplier(1);
    setGameEnded(false);
    setWon(false);
    setRevealedStars(0);
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
        `Mise au jeu Mine - ${bombs} bombes`
      );
    } catch (error) {
      setIsPlaying(false);
      console.error('Erreur lors du démarrage:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Logique de placement dynamique des bombes selon les étoiles trouvées
  const adjustBombPlacement = (starsFound: number) => {
    if (starsFound === 0) return;
    
    const loseProbability = calculateLoseProbability(starsFound, bombs);
    
    // Si la probabilité de perdre est trop faible, réajuster subtilement
    if (Math.random() < loseProbability * 0.3) {
      const newBoard = [...gameBoard];
      const revealedPositions = revealedCells.map((revealed, index) => revealed ? index : -1).filter(pos => pos !== -1);
      const hiddenPositions = Array.from({ length: 25 }, (_, i) => i).filter(pos => !revealedPositions.includes(pos));
      
      // Déplacer une bombe vers une position plus susceptible d'être cliquée
      if (hiddenPositions.length > bombs) {
        const currentBombPositions = dynamicBombPositions.filter(pos => !revealedPositions.includes(pos));
        if (currentBombPositions.length > 0) {
          const bombToMove = currentBombPositions[Math.floor(Math.random() * currentBombPositions.length)];
          const preferredPositions = hiddenPositions.filter(pos => 
            pos < 5 || pos > 19 || pos % 5 === 0 || pos % 5 === 4 // Bords et coins
          );
          
          if (preferredPositions.length > 0) {
            const newBombPos = preferredPositions[Math.floor(Math.random() * preferredPositions.length)];
            if (newBoard[newBombPos] === 'star') {
              newBoard[bombToMove] = 'star';
              newBoard[newBombPos] = 'bomb';
              
              const newBombPositions = dynamicBombPositions.map(pos => pos === bombToMove ? newBombPos : pos);
              setDynamicBombPositions(newBombPositions);
              setGameBoard(newBoard);
              
              console.log(`Réajustement: bombe déplacée de ${bombToMove} vers ${newBombPos}`);
            }
          }
        }
      }
    }
  };

  const handleCellClick = useCallback((index: number) => {
    if (!isPlaying || revealedCells[index] || gameEnded) return;

    const newRevealedCells = [...revealedCells];
    newRevealedCells[index] = true;
    setRevealedCells(newRevealedCells);

    if (gameBoard[index] === 'bomb') {
      const allRevealed = gameBoard.map(() => true);
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
      
      // Ajuster dynamiquement le placement des bombes
      adjustBombPlacement(newStarsFound);
      
      const currentLoseProbability = calculateLoseProbability(newStarsFound, bombs);
      console.log(`Étoiles trouvées: ${newStarsFound}, Multiplicateur: ${newMultiplier}x, Probabilité de perdre: ${(currentLoseProbability * 100).toFixed(1)}%`);
    }
  }, [isPlaying, revealedCells, gameEnded, gameBoard, revealedStars, bombs, bet, dynamicBombPositions]);

  const cashOut = async () => {
    if (!isPlaying || revealedStars === 0 || !profile || isProcessing) return;

    setIsProcessing(true);
    
    try {
      const winnings = Math.floor(bet * currentMultiplier);
      const netGain = winnings - bet;
      
      setGameEnded(true);
      setWon(true);
      setIsPlaying(false);
      
      const allRevealed = gameBoard.map(() => true);
      setRevealedCells(allRevealed);
      
      toast.success(`🎉 Félicitations ! Vous avez gagné ${winnings.toLocaleString()} FCFA !`, {
        description: `Gain net: +${netGain.toLocaleString()} FCFA (${revealedStars} étoiles, ${bombs} bombes)`,
        duration: 5000,
      });
      
      const newBalance = profile.balance + winnings;
      await updateBalance(
        newBalance,
        'game_win',
        netGain,
        `Gain au jeu Mine - ${revealedStars} étoiles trouvées (${bombs} bombes)`
      );
    } catch (error) {
      console.error('Erreur lors du retrait:', error);
      toast.error('Erreur lors du retrait des gains');
    } finally {
      setIsProcessing(false);
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
    setDynamicBombPositions([]);
  };

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

  // Calculer la probabilité actuelle de perdre
  const currentLoseProbability = isPlaying ? calculateLoseProbability(revealedStars, bombs) : 0;

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
    profile,
    
    // Computed values
    potentialWin: bet * currentMultiplier,
    nextMultipliers: getNextMultipliers(),
    currentLoseProbability,
    
    // Actions
    startGame,
    handleCellClick,
    cashOut,
    resetGame,
    adjustBet,
    adjustBombs,
    calculateMultiplier
  };
};
