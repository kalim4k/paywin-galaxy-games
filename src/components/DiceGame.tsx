
import React, { useState } from 'react';
import { DiceWheel } from './DiceWheel';
import { DiceBetOptions } from './DiceBetOptions';
import { DiceBetControls } from './DiceBetControls';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

export const DiceGame = () => {
  const [selectedColor, setSelectedColor] = useState<'red' | 'black' | 'blue' | null>(null);
  const [betAmount, setBetAmount] = useState(200);
  const [isSpinning, setIsSpinning] = useState(false);
  const [gameResult, setGameResult] = useState<{color: 'red' | 'black' | 'blue', number: number} | null>(null);
  const [balance, setBalance] = useState(25750);

  const colorMultipliers = {
    red: 2,
    black: 2,
    blue: 14
  };

  const handleSpin = () => {
    if (!selectedColor || isSpinning) return;

    setIsSpinning(true);
    setGameResult(null);

    // Déduire la mise du solde
    setBalance(prev => prev - betAmount);

    // Simuler le spin (2 secondes)
    setTimeout(() => {
      // Générer un résultat aléatoire avec probabilités réalistes
      const random = Math.random();
      let resultColor: 'red' | 'black' | 'blue';
      let resultNumber: number;
      
      if (random < 0.45) {
        resultColor = 'red';
        resultNumber = Math.floor(Math.random() * 8) + 1; // 1-8 pour rouge
      } else if (random < 0.9) {
        resultColor = 'black';
        resultNumber = 0; // 0 pour noir
      } else {
        resultColor = 'blue';
        resultNumber = 11; // 11 pour bleu
      }

      const result = { color: resultColor, number: resultNumber };
      setGameResult(result);
      setIsSpinning(false);

      // Calculer les gains si le joueur a gagné
      if (result.color === selectedColor) {
        const winnings = betAmount * result.number;
        setBalance(prev => prev + winnings);
        
        // Notification de victoire
        toast.success(`🎉 Félicitations ! Vous avez gagné ${winnings.toLocaleString()} FCFA !`, {
          description: `Résultat: ${result.color === 'red' ? 'Rouge' : result.color === 'black' ? 'Noir' : 'Bleu'} - ${result.number}`,
          duration: 5000,
        });
      } else {
        // Notification de perte
        toast.error(`😢 Dommage ! Vous avez perdu ${betAmount.toLocaleString()} FCFA`, {
          description: `Résultat: ${result.color === 'red' ? 'Rouge' : result.color === 'black' ? 'Noir' : 'Bleu'} - ${result.number}`,
          duration: 5000,
        });
      }
    }, 2000);
  };

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
        balance={balance}
        isDisabled={isSpinning}
      />

      {/* Play Button */}
      <div className="space-y-4">
        <Button 
          onClick={handleSpin}
          disabled={!selectedColor || isSpinning || betAmount > balance}
          className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-lg font-bold rounded-xl disabled:opacity-50"
        >
          {isSpinning ? 'Rotation en cours...' : 'JOUER'}
        </Button>
      </div>
    </div>
  );
};
