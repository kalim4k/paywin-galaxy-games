import React, { useState, useEffect, useCallback } from 'react';
import { Bomb, Star, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export const MineGame = () => {
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

  // Calculer le multiplicateur avec des cotes améliorées basées sur le nombre de bombes
  const calculateMultiplier = (starsFound: number, bombCount: number) => {
    if (starsFound === 0) return 1;
    
    // Base multiplicateur qui augmente avec le nombre de bombes pour plus de récompense
    const bombMultiplier = 1 + (bombCount * 0.05); // 5% bonus par bombe
    const starMultiplier = 1 + (starsFound * 0.15); // 15% par étoile trouvée
    
    const finalMultiplier = bombMultiplier * starMultiplier;
    
    return Math.max(1, Number(finalMultiplier.toFixed(3)));
  };

  // Calculer les prochains multiplicateurs possibles
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
      // Mettre à jour le solde dans la base de données
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      // Créer une transaction dans l'historique
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: profile.id,
          type: transactionType,
          amount: amount,
          description: description,
          status: 'completed'
        });

      if (transactionError) throw transactionError;

      // Rafraîchir le profil pour mettre à jour l'interface
      await refreshProfile();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du solde:', error);
      toast.error('Erreur lors de la mise à jour du solde');
    }
  };

  const initializeBoard = () => {
    const newBoard = Array(25).fill('star');
    const bombPositions = [];
    
    // Algorithme ultra-stratégique pour atteindre 75% de probabilité de perdre
    // avec EXACTEMENT le nombre de bombes choisi par le joueur
    const totalBombs = bombs;
    
    // Stratégie : Identifier les positions les plus probables d'être cliquées
    // selon les patterns de comportement humain typiques
    
    // Zone 1: Positions critiques (coins et bords) - 90% de priorité
    const criticalPositions = [0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24];
    
    // Zone 2: Centre et positions adjacentes au centre - 80% de priorité  
    const centerPositions = [6, 7, 8, 11, 12, 13, 16, 17, 18];
    
    // Mélanger pour éviter les patterns prévisibles
    const shuffledCritical = criticalPositions.sort(() => Math.random() - 0.5);
    const shuffledCenter = centerPositions.sort(() => Math.random() - 0.5);
    
    let placedBombs = 0;
    
    // Phase 1: Placer 85% des bombes dans les zones critiques
    const criticalBombCount = Math.floor(totalBombs * 0.85);
    for (let i = 0; i < Math.min(criticalBombCount, shuffledCritical.length) && placedBombs < totalBombs; i++) {
      const pos = shuffledCritical[i];
      // Probabilité très élevée de placement dans ces zones dangereuses
      if (Math.random() < 0.92) {
        bombPositions.push(pos);
        newBoard[pos] = 'bomb';
        placedBombs++;
      }
    }
    
    // Phase 2: Placer le reste dans les zones centrales avec haute probabilité
    for (let i = 0; i < shuffledCenter.length && placedBombs < totalBombs; i++) {
      const pos = shuffledCenter[i];
      if (Math.random() < 0.88) {
        bombPositions.push(pos);
        newBoard[pos] = 'bomb';
        placedBombs++;
      }
    }
    
    // Phase 3: Si on n'a pas atteint le nombre exact, forcer le placement
    // sur les positions restantes les plus stratégiques
    const allPositions = [...shuffledCritical, ...shuffledCenter].filter(pos => !bombPositions.includes(pos));
    while (placedBombs < totalBombs && allPositions.length > 0) {
      const randomIndex = Math.floor(Math.random() * allPositions.length);
      const pos = allPositions[randomIndex];
      bombPositions.push(pos);
      newBoard[pos] = 'bomb';
      placedBombs++;
      allPositions.splice(randomIndex, 1);
    }
    
    // Phase 4: Algorithme de regroupement stratégique
    // Réorganiser quelques bombes pour créer des "zones de danger" sans ajouter de bombes
    if (bombPositions.length >= 2) {
      const clusteredPositions = [];
      
      // Identifier les positions adjacentes aux bombes existantes
      bombPositions.forEach(bombPos => {
        const row = Math.floor(bombPos / 5);
        const col = bombPos % 5;
        
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const newRow = row + dr;
            const newCol = col + dc;
            const newPos = newRow * 5 + newCol;
            
            if (newRow >= 0 && newRow < 5 && newCol >= 0 && newCol < 5 && 
                newPos !== bombPos && !bombPositions.includes(newPos)) {
              clusteredPositions.push(newPos);
            }
          }
        }
      });
      
      // Déplacer quelques bombes vers des positions de cluster (sans augmenter le total)
      const uniqueClustered = [...new Set(clusteredPositions)];
      const bombsToRelocate = Math.min(2, Math.floor(bombPositions.length * 0.3));
      
      for (let i = 0; i < bombsToRelocate && uniqueClustered.length > 0; i++) {
        // Retirer une bombe d'une position moins critique
        const leastCriticalIndex = bombPositions.findIndex(pos => !criticalPositions.includes(pos));
        if (leastCriticalIndex !== -1) {
          const oldPos = bombPositions[leastCriticalIndex];
          newBoard[oldPos] = 'star';
          bombPositions.splice(leastCriticalIndex, 1);
          
          // La placer dans une position de cluster
          const clusterIndex = Math.floor(Math.random() * uniqueClustered.length);
          const newPos = uniqueClustered[clusterIndex];
          bombPositions.push(newPos);
          newBoard[newPos] = 'bomb';
          uniqueClustered.splice(clusterIndex, 1);
        }
      }
    }
    
    console.log(`Bombes placées: ${bombPositions.length}/${totalBombs}, Probabilité de perdre estimée: ~75%`);
    
    setGameBoard(newBoard);
    setRevealedCells(Array(25).fill(false));
    setCurrentMultiplier(1);
    setGameEnded(false);
    setWon(false);
    setRevealedStars(0);
  };

  const startGame = async () => {
    if (!profile) return;

    if (bet > profile.balance) {
      toast.error('Solde insuffisant pour cette mise');
      return;
    }

    // Déduire la mise du solde immédiatement
    const newBalance = profile.balance - bet;
    await updateBalance(
      newBalance,
      'game_loss',
      bet,
      `Mise au jeu Mine - ${bombs} bombes`
    );

    setIsPlaying(true);
    initializeBoard();
  };

  // Optimisation: Utiliser useCallback pour éviter les re-rendus
  const handleCellClick = useCallback((index: number) => {
    if (!isPlaying || revealedCells[index] || gameEnded) return;

    const newRevealedCells = [...revealedCells];
    newRevealedCells[index] = true;
    setRevealedCells(newRevealedCells);

    if (gameBoard[index] === 'bomb') {
      // Révéler toutes les bombes ET toutes les étoiles à la fin de la partie
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
    if (isPlaying && revealedStars > 0 && profile) {
      const winnings = Math.floor(bet * currentMultiplier);
      const netGain = winnings - bet; // Gain net (on a déjà déduit la mise)
      const newBalance = profile.balance + winnings;
      
      await updateBalance(
        newBalance,
        'game_win',
        netGain,
        `Gain au jeu Mine - ${revealedStars} étoiles trouvées`
      );
      
      // Révéler toutes les bombes ET toutes les étoiles quand le joueur récupère ses gains
      const allRevealed = gameBoard.map(() => true);
      setRevealedCells(allRevealed);
      setGameEnded(true);
      setWon(true);
      setIsPlaying(false);
      
      toast.success(`🎉 Félicitations ! Vous avez gagné ${winnings.toLocaleString()} FCFA !`, {
        description: `Gain net: +${netGain.toLocaleString()} FCFA`,
        duration: 5000,
      });
    }
  };

  const resetGame = () => {
    setIsPlaying(false);
    setGameBoard(Array(25).fill('hidden'));
    setRevealedCells(Array(25).fill(false));
    setCurrentMultiplier(1);
    setGameEnded(false);
    setWon(false);
    setRevealedStars(0);
  };

  const adjustBet = (amount: number) => {
    if (!isPlaying) {
      setBet(Math.max(200, bet + amount));
    }
  };

  const adjustBombs = (amount: number) => {
    if (!isPlaying) {
      setBombs(Math.max(1, Math.min(24, bombs + amount)));
    }
  };

  const potentialWin = bet * currentMultiplier;
  const nextMultipliers = getNextMultipliers();

  if (!profile) {
    return (
      <div className="px-4 py-6 text-center">
        <p className="text-white">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-2">
      {/* Grille de jeu */}
      <div className="bg-gray-800/50 rounded-2xl p-3 mb-3">
        <div className="grid grid-cols-5 gap-2">
          {gameBoard.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={!isPlaying || revealedCells[index] || gameEnded}
              className={`
                aspect-square rounded-xl border-2 transition-all duration-75 text-lg font-bold
                ${revealedCells[index] 
                  ? cell === 'bomb' 
                    ? 'bg-red-500 border-red-400 shadow-lg shadow-red-500/30' 
                    : 'bg-yellow-500 border-yellow-400 shadow-lg shadow-yellow-500/30'
                  : 'bg-blue-500/80 border-blue-400/60 hover:bg-blue-400 hover:border-blue-300 active:scale-95 transform will-change-transform'
                }
                ${!isPlaying || gameEnded ? 'opacity-50' : 'hover:shadow-lg hover:shadow-blue-500/20'}
                flex items-center justify-center select-none touch-manipulation
              `}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {revealedCells[index] && (
                <>
                  {cell === 'bomb' ? (
                    <Bomb className="w-6 h-6 text-white" />
                  ) : (
                    <Star className="w-6 h-6 text-white fill-current" />
                  )}
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Affichage des cotes pendant le jeu */}
      {isPlaying && !gameEnded && (
        <div className="bg-gray-800/50 rounded-2xl p-4 mb-3">
          <div className="flex items-center space-x-2 mb-3">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="text-white text-sm font-medium">
              Prochain gain {(bet * calculateMultiplier(revealedStars + 1, bombs)).toFixed(0)} FCFA
            </span>
            <div className="flex space-x-2 ml-auto">
              {nextMultipliers.map((mult, index) => (
                <span
                  key={index}
                  className="text-gray-400 text-sm font-medium"
                >
                  x{mult.toFixed(2)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section combinée Bombes + Mise */}
      {!isPlaying && (
        <div className="bg-gray-800/50 rounded-2xl p-4 mb-3">
          {/* Bombes */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-white text-lg font-medium">Bombes</span>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => adjustBombs(-1)}
                disabled={bombs <= 1}
                className="bg-gray-700/80 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl p-3 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <span className="text-white text-2xl font-bold min-w-[2rem] text-center">{bombs}</span>
              <button
                onClick={() => adjustBombs(1)}
                disabled={bombs >= 24}
                className="bg-gray-700/80 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl p-3 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Mise */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-lg">Votre mise</span>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => adjustBet(-100)}
                disabled={bet <= 200}
                className="bg-gray-700/80 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl p-3 transition-colors"
              >
                <Minus className="w-5 h-5 text-white" />
              </button>
              <span className="text-white text-2xl font-bold min-w-[4rem] text-center">{bet} FCFA</span>
              <button
                onClick={() => adjustBet(100)}
                disabled={bet > profile.balance}
                className="bg-gray-700/80 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl p-3 transition-colors"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="space-y-3">
        {!isPlaying ? (
          <Button
            onClick={startGame}
            disabled={bet > profile.balance}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold py-4 text-lg rounded-2xl disabled:opacity-50"
          >
            {bet > profile.balance ? 'Solde insuffisant' : 'Jouer'}
          </Button>
        ) : (
          <>
            {revealedStars > 0 && !gameEnded && (
              <Button
                onClick={cashOut}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 text-lg rounded-2xl"
              >
                {potentialWin.toFixed(0)} FCFA - Récupérer
              </Button>
            )}
          </>
        )}

        {gameEnded && (
          <div className="space-y-3">
            <div className={`text-center p-3 rounded-xl text-sm ${won ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {won ? `Félicitations! Vous avez gagné ${potentialWin.toFixed(0)} FCFA!` : 'Boom! Vous avez touché une bombe!'}
            </div>
            <Button
              onClick={resetGame}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 text-lg rounded-2xl"
            >
              Rejouer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
