
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

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
  isDesktop?: boolean;
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
  onResetGame,
  isDesktop = false
}: ActionButtonsProps) => {
  const containerClasses = isDesktop ? "space-y-4" : "space-y-3";
  const buttonClasses = isDesktop 
    ? "w-full font-bold py-3 text-base rounded-xl disabled:opacity-50 transition-all duration-200"
    : "w-full font-bold py-4 text-lg rounded-2xl disabled:opacity-50 transition-all duration-200";

  return (
    <div className={containerClasses}>
      {!isPlaying ? (
        <Button
          onClick={onStartGame}
          disabled={bet > maxBalance || isProcessing}
          className={`${buttonClasses} bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white`}
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Démarrage...</span>
            </div>
          ) : bet > maxBalance ? 'Solde insuffisant' : 'Jouer'}
        </Button>
      ) : (
        <>
          {revealedStars > 0 && !gameEnded && (
            <Button
              onClick={onCashOut}
              disabled={isProcessing}
              className={`${buttonClasses} bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white`}
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Récupération...</span>
                </div>
              ) : `${potentialWin.toFixed(0)} FCFA - Récupérer`}
            </Button>
          )}
        </>
      )}

      {gameEnded && (
        <div className={containerClasses}>
          <div className={`text-center p-3 rounded-xl ${isDesktop ? 'text-base' : 'text-sm'} ${won ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {won ? `Félicitations! Vous avez gagné ${potentialWin.toFixed(0)} FCFA!` : 'Boom! Vous avez touché une bombe!'}
          </div>
          <Button
            onClick={onResetGame}
            disabled={isProcessing}
            className={`${buttonClasses} bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white`}
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Chargement...</span>
              </div>
            ) : 'Rejouer'}
          </Button>
        </div>
      )}
    </div>
  );
};
