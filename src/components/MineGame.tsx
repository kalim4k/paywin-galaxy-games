
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
  const [isProcessing, setIsProcessing] = useState(false);

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

  // Algorithme simplifié et plus rapide pour le placement des bombes
  const initializeBoard = () => {
    const newBoard = Array(25).fill('star');
    const bombPositions = [];
    
    // Algorithme simple et rapide : placement aléatoire des bombes
    const totalBombs = bombs;
    const availablePositions = Array.from({ length: 25 }, (_, i) => i);
    
    // Mélanger les positions disponibles une seule fois
    for (let i = availablePositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availablePositions[i], availablePositions[j]] = [availablePositions[j], availablePositions[i]];
    }
    
    // Prendre les premières positions pour les bombes
    for (let i = 0; i < totalBombs; i++) {
      const pos = availablePositions[i];
      bombPositions.push(pos);
      newBoard[pos] = 'bomb';
    }
    
    console.log(`Bombes placées: ${bombPositions.length}/${totalBombs}`);
    
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
    } finally {
      setIsProcessing(false);
    }
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
    if (isPlaying && revealedStars > 0 && profile && !isProcessing) {
      setIsProcessing(true);
      
      try {
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
      } finally {
        setIsProcessing(false);
      }
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
                disabled={bombs <= 1 || isProcessing}
                className="bg-gray-700/80 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl p-3 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <span className="text-white text-2xl font-bold min-w-[2rem] text-center">{bombs}</span>
              <button
                onClick={() => adjustBombs(1)}
                disabled={bombs >= 24 || isProcessing}
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
                disabled={bet <= 200 || isProcessing}
                className="bg-gray-700/80 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl p-3 transition-colors"
              >
                <Minus className="w-5 h-5 text-white" />
              </button>
              <span className="text-white text-2xl font-bold min-w-[4rem] text-center">{bet} FCFA</span>
              <button
                onClick={() => adjustBet(100)}
                disabled={bet > profile.balance || isProcessing}
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
            disabled={bet > profile.balance || isProcessing}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold py-4 text-lg rounded-2xl disabled:opacity-50"
          >
            {isProcessing ? 'Chargement...' : bet > profile.balance ? 'Solde insuffisant' : 'Jouer'}
          </Button>
        ) : (
          <>
            {revealedStars > 0 && !gameEnded && (
              <Button
                onClick={cashOut}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 text-lg rounded-2xl disabled:opacity-50"
              >
                {isProcessing ? 'Récupération...' : `${potentialWin.toFixed(0)} FCFA - Récupérer`}
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
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 text-lg rounded-2xl disabled:opacity-50"
            >
              {isProcessing ? 'Chargement...' : 'Rejouer'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
