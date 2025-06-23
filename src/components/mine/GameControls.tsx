
import React from 'react';
import { Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';

interface GameControlsProps {
  bet: number;
  bombs: number;
  isPlaying: boolean;
  isProcessing: boolean;
  maxBalance: number;
  onAdjustBet: (amount: number) => void;
  onAdjustBombs: (amount: number) => void;
  isDesktop?: boolean;
}

export const GameControls = ({ 
  bet, 
  bombs, 
  isPlaying, 
  isProcessing, 
  maxBalance, 
  onAdjustBet, 
  onAdjustBombs,
  isDesktop = false
}: GameControlsProps) => {
  if (isPlaying) return null;

  const containerClasses = isDesktop
    ? "bg-gray-800/50 rounded-2xl p-6 space-y-6"
    : "bg-gray-800/50 rounded-2xl p-4 mb-3";

  const titleClasses = isDesktop
    ? "text-white text-xl font-semibold mb-4"
    : "text-white text-lg font-medium";

  const controlRowClasses = isDesktop
    ? "flex flex-col space-y-4"
    : "flex items-center justify-between mb-4";

  const buttonClasses = isDesktop
    ? "bg-gray-700/80 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl p-2 transition-colors"
    : "bg-gray-700/80 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl p-3 transition-colors";

  const valueClasses = isDesktop
    ? "text-white text-xl font-bold text-center py-2"
    : "text-white text-2xl font-bold min-w-[2rem] text-center";

  if (isDesktop) {
    return (
      <div className={containerClasses}>
        <h3 className={titleClasses}>Paramètres de jeu</h3>
        
        {/* Bombes */}
        <div className="space-y-3">
          <span className="text-gray-300 text-base font-medium block">Nombre de bombes</span>
          <div className="flex items-center justify-between bg-gray-700/50 rounded-xl p-3">
            <button
              onClick={() => onAdjustBombs(-1)}
              disabled={bombs <= 1 || isProcessing}
              className={buttonClasses}
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <span className={valueClasses}>{bombs}</span>
            <button
              onClick={() => onAdjustBombs(1)}
              disabled={bombs >= 24 || isProcessing}
              className={buttonClasses}
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Mise */}
        <div className="space-y-3">
          <span className="text-gray-300 text-base font-medium block">Mise (FCFA)</span>
          <div className="flex items-center justify-between bg-gray-700/50 rounded-xl p-3">
            <button
              onClick={() => onAdjustBet(-100)}
              disabled={bet <= 200 || isProcessing}
              className={buttonClasses}
            >
              <Minus className="w-4 h-4 text-white" />
            </button>
            <span className={valueClasses}>{bet}</span>
            <button
              onClick={() => onAdjustBet(100)}
              disabled={bet > maxBalance || isProcessing}
              className={buttonClasses}
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {/* Bombes */}
      <div className={controlRowClasses}>
        <span className={titleClasses}>Bombes</span>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onAdjustBombs(-1)}
            disabled={bombs <= 1 || isProcessing}
            className={buttonClasses}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <span className={valueClasses}>{bombs}</span>
          <button
            onClick={() => onAdjustBombs(1)}
            disabled={bombs >= 24 || isProcessing}
            className={buttonClasses}
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
            onClick={() => onAdjustBet(-100)}
            disabled={bet <= 200 || isProcessing}
            className={buttonClasses}
          >
            <Minus className="w-5 h-5 text-white" />
          </button>
          <span className="text-white text-2xl font-bold min-w-[4rem] text-center">{bet} FCFA</span>
          <button
            onClick={() => onAdjustBet(100)}
            disabled={bet > maxBalance || isProcessing}
            className={buttonClasses}
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
