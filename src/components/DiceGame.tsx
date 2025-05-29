
import React, { useState } from 'react';
import { DiceWheel } from './DiceWheel';
import { DiceBetOptions } from './DiceBetOptions';
import { DiceBetControls } from './DiceBetControls';
import { Button } from '@/components/ui/button';

export const DiceGame = () => {
  const [selectedColor, setSelectedColor] = useState<'red' | 'black' | 'blue' | null>(null);
  const [betAmount, setBetAmount] = useState(200);
  const [isSpinning, setIsSpinning] = useState(false);
  const [gameResult, setGameResult] = useState<{color: 'red' | 'black' | 'blue', number: number} | null>(null);
  const [balance, setBalance] = useState(25750);

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
      let result: 'red' | 'black' | 'blue';
      
      if (random < 0.45) {
        result = 'red';
      } else if (random < 0.9) {
        result = 'black';
      } else {
        result = 'blue';
      }

      setIsSpinning(false);
      // Le résultat sera défini par le callback de DiceWheel
    }, 2000);
  };

  const handleResult = (color: 'red' | 'black' | 'blue', number: number) => {
    setGameResult({ color, number });

    // Calculer les gains si le joueur a gagné (couleur correspond)
    if (color === selectedColor) {
      const winnings = betAmount * number;
      setBalance(prev => prev + winnings);
    }
  };

  const resetGame = () => {
    setSelectedColor(null);
    setGameResult(null);
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
        onResult={handleResult}
      />

      {/* Bet Options */}
      <DiceBetOptions 
        selectedColor={selectedColor}
        onColorSelect={setSelectedColor}
      />

      {/* Bet Controls */}
      <DiceBetControls 
        betAmount={betAmount}
        onBetChange={setBetAmount}
        balance={balance}
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

        {gameResult && (
          <div className="text-center space-y-2">
            <p className="text-white">
              Résultat: <span className={`font-bold ${gameResult.color === 'red' ? 'text-red-400' : gameResult.color === 'black' ? 'text-gray-300' : 'text-blue-400'}`}>
                {gameResult.color === 'red' ? 'Rouge' : gameResult.color === 'black' ? 'Noir' : 'Bleu'} - {gameResult.number}
              </span>
            </p>
            {gameResult.color === selectedColor ? (
              <p className="text-green-400 font-bold">
                Vous avez gagné {betAmount * gameResult.number} FCFA ! 🎉
              </p>
            ) : (
              <p className="text-red-400 font-bold">
                Vous avez perdu {betAmount} FCFA 😢
              </p>
            )}
            <Button 
              onClick={resetGame}
              variant="outline"
              className="mt-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Rejouer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
