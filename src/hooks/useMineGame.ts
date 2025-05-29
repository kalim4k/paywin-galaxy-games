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

  const calculateMultiplier = (starsFound: number, bombCount: number) => {
    if (starsFound === 0) return 1;
    
    const bombMultiplier = 1 + (bombCount * 0.05);
    const starMultiplier = 1 + (starsFound * 0.15);
    const finalMultiplier = bombMultiplier * starMultiplier;
    
    return Math.max(1, Number(finalMultiplier.toFixed(3)));
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
      // Use update instead of upsert for better performance and correct typing
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          balance: newBalance, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      // Fire and forget transaction logging to improve UI responsiveness
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

  // Algorithme biaisé pour augmenter la probabilité de perdre
  const initializeBoard = () => {
    const newBoard: ('hidden' | 'star' | 'bomb')[] = Array(25).fill('star');
    
    // Positions "dangereuses" (plus susceptibles d'être cliquées en premier)
    // Coins et bords sont souvent cliqués en premier
    const dangerousPositions = [
      0, 1, 2, 3, 4,     // première ligne
      5, 9,              // côtés première ligne du milieu
      10, 14,            // côtés deuxième ligne du milieu  
      15, 19,            // côtés troisième ligne du milieu
      20, 21, 22, 23, 24 // dernière ligne
    ];
    
    // Centre (souvent cliqué après les bords)
    const centerPositions = [6, 7, 8, 11, 12, 13, 16, 17, 18];
    
    // Mélanger les positions dangereuses et leur donner plus de poids
    const weightedPositions = [];
    
    // Ajouter les positions dangereuses avec un poids de 70%
    for (let i = 0; i < Math.floor(bombs * 0.7); i++) {
      const randomDangerous = dangerousPositions[Math.floor(Math.random() * dangerousPositions.length)];
      if (!weightedPositions.includes(randomDangerous)) {
        weightedPositions.push(randomDangerous);
      }
    }
    
    // Compléter avec des positions aléatoires pour le reste des bombes
    while (weightedPositions.length < bombs) {
      const randomPos = Math.floor(Math.random() * 25);
      if (!weightedPositions.includes(randomPos)) {
        weightedPositions.push(randomPos);
      }
    }
    
    // Placer les bombes aux positions sélectionnées
    weightedPositions.forEach(pos => {
      newBoard[pos] = 'bomb';
    });
    
    console.log(`Bombes placées (biaisé): ${bombs}/${bombs} aux positions:`, weightedPositions);
    
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
      // Initialize board immediately for better UX
      setIsPlaying(true);
      initializeBoard();
      
      // Update balance in background
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
    }
  }, [isPlaying, revealedCells, gameEnded, gameBoard, revealedStars, bombs, bet]);

  const cashOut = async () => {
    if (!isPlaying || revealedStars === 0 || !profile || isProcessing) return;

    setIsProcessing(true);
    
    try {
      // Update UI immediately for better responsiveness
      const winnings = Math.floor(bet * currentMultiplier);
      const netGain = winnings - bet;
      
      setGameEnded(true);
      setWon(true);
      setIsPlaying(false);
      
      // Reveal all cells
      const allRevealed = gameBoard.map(() => true);
      setRevealedCells(allRevealed);
      
      // Show success message immediately
      toast.success(`🎉 Félicitations ! Vous avez gagné ${winnings.toLocaleString()} FCFA !`, {
        description: `Gain net: +${netGain.toLocaleString()} FCFA`,
        duration: 5000,
      });
      
      // Update balance in background
      const newBalance = profile.balance + winnings;
      await updateBalance(
        newBalance,
        'game_win',
        netGain,
        `Gain au jeu Mine - ${revealedStars} étoiles trouvées`
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
