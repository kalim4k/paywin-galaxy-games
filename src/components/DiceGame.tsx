import React, { useState } from 'react';
import { DiceWheel } from './DiceWheel';
import { DiceBetOptions } from './DiceBetOptions';
import { DiceBetControls } from './DiceBetControls';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const DiceGame = () => {
  const { profile, refreshProfile } = useAuth();
  const [selectedColor, setSelectedColor] = useState<'red' | 'black' | 'blue' | null>(null);
  const [betAmount, setBetAmount] = useState(200);
  const [isSpinning, setIsSpinning] = useState(false);
  const [gameResult, setGameResult] = useState<{color: 'red' | 'black' | 'blue', number: number} | null>(null);

  const colorMultipliers = {
    red: 2,
    black: 2,
    blue: 14
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

  const handleSpin = async () => {
    if (!selectedColor || isSpinning || !profile) return;

    if (betAmount > profile.balance) {
      toast.error('Solde insuffisant pour cette mise');
      return;
    }

    setIsSpinning(true);
    setGameResult(null);

    // Simuler le spin (2 secondes)
    setTimeout(async () => {
      // PROBABILITÉS MODIFIÉES - Plus difficile de gagner
      const random = Math.random();
      let resultColor: 'red' | 'black' | 'blue';
      let resultNumber: number;
      
      // Nouvelles probabilités favorisant les pertes
      if (random < 0.35) { // 35% pour rouge (était 45%)
        resultColor = 'red';
        resultNumber = Math.floor(Math.random() * 8) + 1; // 1-8 pour rouge
      } else if (random < 0.85) { // 50% pour noir (était 45%)
        resultColor = 'black';
        resultNumber = 0; // 0 pour noir
      } else { // 15% pour bleu (était 10%)
        resultColor = 'blue';
        resultNumber = 11; // 11 pour bleu
      }

      const result = { color: resultColor, number: resultNumber };
      setGameResult(result);
      setIsSpinning(false);

      // Calculer le nouveau solde et mettre à jour la base de données
      if (result.color === selectedColor) {
        const winnings = betAmount * colorMultipliers[result.color];
        const newBalance = profile.balance - betAmount + winnings;
        
        await updateBalance(
          newBalance,
          'game_win',
          winnings - betAmount, // Gain net
          `Gain au jeu de dés - ${result.color === 'red' ? 'Rouge' : result.color === 'black' ? 'Noir' : 'Bleu'} ${result.number}`
        );
        
        toast.success(`🎉 Félicitations ! Vous avez gagné ${winnings.toLocaleString()} FCFA !`, {
          description: `Résultat: ${result.color === 'red' ? 'Rouge' : result.color === 'black' ? 'Noir' : 'Bleu'} - ${result.number}`,
          duration: 5000,
        });
      } else {
        const newBalance = profile.balance - betAmount;
        
        await updateBalance(
          newBalance,
          'game_loss',
          betAmount,
          `Perte au jeu de dés - ${result.color === 'red' ? 'Rouge' : result.color === 'black' ? 'Noir' : 'Bleu'} ${result.number}`
        );
        
        toast.error(`😢 Dommage ! Vous avez perdu ${betAmount.toLocaleString()} FCFA`, {
          description: `Résultat: ${result.color === 'red' ? 'Rouge' : result.color === 'black' ? 'Noir' : 'Bleu'} - ${result.number}`,
          duration: 5000,
        });
      }
    }, 2000);
  };

  if (!profile) {
    return (
      <div className="px-4 py-6 text-center">
        <p className="text-white">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Game Title */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">DICE GAME</h1>
        <p className="text-white/70">Choisissez votre couleur et tentez votre chance</p>
      </div>

      {/* Dice Wheel */}
      <DiceWheel 
        isSpinning={isSpinning} 
        result={gameResult?.color || null}
      />

      {/* Bet Options */}
      <DiceBetOptions 
        selectedColor={selectedColor}
        onColorSelect={setSelectedColor}
        multipliers={colorMultipliers}
        isDisabled={isSpinning}
      />

      {/* Bet Controls */}
      <DiceBetControls 
        betAmount={betAmount}
        onBetChange={setBetAmount}
        balance={profile.balance}
        isDisabled={isSpinning}
      />

      {/* Play Button */}
      <div className="space-y-4">
        <Button 
          onClick={handleSpin}
          disabled={!selectedColor || isSpinning || betAmount > profile.balance}
          className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-lg font-bold rounded-xl disabled:opacity-50"
        >
          {isSpinning ? 'Rotation en cours...' : 'JOUER'}
        </Button>
      </div>
    </div>
  );
};
