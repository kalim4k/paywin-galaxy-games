
import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  isPlaying: boolean;
  gameEnded: boolean;
  won: boolean;
  isProcessing: boolean;
  bet: number;
  maxBalance: number;
  potentialWin: number;
  revealedStars: number;
  onStartGame: () => void;
  onCashOut: () => void;
  onResetGame: () => void;
}

export const ActionButtons = ({
  isPlaying,
  gameEnded,
  won,
  isProcessing,
  bet,
  maxBalance,
  potentialWin,
  revealedStars,
  onStartGame,
  onCashOut,
  onResetGame
}: ActionButtonsProps) => {
  return (
    <div className="space-y-3">
      {!isPlaying ? (
        <Button
          onClick={onStartGame}
          disabled={bet > maxBalance || isProcessing}
          className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold py-4 text-lg rounded-2xl disabled:opacity-50"
        >
          {isProcessing ? 'Chargement...' : bet > maxBalance ? 'Solde insuffisant' : 'Jouer'}
        </Button>
      ) : (
        <>
          {revealedStars > 0 && !gameEnded && (
            <Button
              onClick={onCashOut}
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
            onClick={onResetGame}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 text-lg rounded-2xl disabled:opacity-50"
          >
            {isProcessing ? 'Chargement...' : 'Rejouer'}
          </Button>
        </div>
      )}
    </div>
  );
};
