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

  // Algorithme ultra-biaisé pour 83% de probabilité de perdre
  const initializeBoard = () => {
    const newBoard: ('hidden' | 'star' | 'bomb')[] = Array(25).fill('star');
    
    // Positions les plus susceptibles d'être cliquées (83% de chance de perdre)
    // Stratégie: placer des bombes dans les positions les plus attractives
    const ultraDangerousPositions = [
      // Coins (très souvent cliqués en premier)
      0, 4, 20, 24,
      // Centre et positions adjacentes (zone de confort)
      11, 12, 13, 6, 7, 8, 16, 17, 18,
      // Bords centraux (deuxième choix commun)
      2, 10, 14, 22,
      // Positions "sûres" en apparence mais piégées
      1, 3, 5, 9, 15, 19, 21, 23
    ];
    
    // Positions moins dangereuses (pour laisser quelques étoiles)
    const moderatePositions = [
      // Positions moins attractives
      6, 7, 8, 16, 17, 18
    ];
    
    // Calculer le nombre de bombes à placer selon le pourcentage de 83%
    const totalPositionsToTarget = Math.floor(25 * 0.83); // 83% des 25 cases
    let bombsToPlace = Math.min(bombs, totalPositionsToTarget);
    
    // Forcer un placement agressif même avec peu de bombes
    const minDangerousBombs = Math.max(bombs, Math.floor(bombs * 1.5));
    bombsToPlace = Math.min(minDangerousBombs, 24);
    
    const weightedPositions = [];
    
    // Placer 90% des bombes dans les positions ultra-dangereuses
    const ultraDangerousBombCount = Math.floor(bombsToPlace * 0.9);
    const shuffledUltraDangerous = [...ultraDangerousPositions].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < ultraDangerousBombCount && i < shuffledUltraDangerous.length; i++) {
      if (!weightedPositions.includes(shuffledUltraDangerous[i])) {
        weightedPositions.push(shuffledUltraDangerous[i]);
      }
    }
    
    // Compléter avec des positions modérément dangereuses
    const shuffledModerate = [...moderatePositions].sort(() => Math.random() - 0.5);
    for (let i = 0; i < shuffledModerate.length && weightedPositions.length < bombsToPlace; i++) {
      if (!weightedPositions.includes(shuffledModerate[i])) {
        weightedPositions.push(shuffledModerate[i]);
      }
    }
    
    // Si on n'a pas assez de bombes, remplir avec des positions aléatoires biaisées
    while (weightedPositions.length < bombsToPlace) {
      // Favoriser les positions centrales et les coins
      const biasedPosition = Math.random() < 0.7 
        ? ultraDangerousPositions[Math.floor(Math.random() * ultraDangerousPositions.length)]
        : Math.floor(Math.random() * 25);
        
      if (!weightedPositions.includes(biasedPosition)) {
        weightedPositions.push(biasedPosition);
      }
    }
    
    // Placer les bombes aux positions sélectionnées
    weightedPositions.forEach(pos => {
      newBoard[pos] = 'bomb';
    });
    
    console.log(`Bombes placées (83% lose rate): ${weightedPositions.length}/${bombs} aux positions:`, weightedPositions);
    
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
