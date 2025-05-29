
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
}

export const GameControls = ({ 
  bet, 
  bombs, 
  isPlaying, 
  isProcessing, 
  maxBalance, 
  onAdjustBet, 
  onAdjustBombs 
}: GameControlsProps) => {
  if (isPlaying) return null;

  return (
    <div className="bg-gray-800/50 rounded-2xl p-4 mb-3">
      {/* Bombes */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-white text-lg font-medium">Bombes</span>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onAdjustBombs(-1)}
            disabled={bombs <= 1 || isProcessing}
            className="bg-gray-700/80 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl p-3 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <span className="text-white text-2xl font-bold min-w-[2rem] text-center">{bombs}</span>
          <button
            onClick={() => onAdjustBombs(1)}
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
            onClick={() => onAdjustBet(-100)}
            disabled={bet <= 200 || isProcessing}
            className="bg-gray-700/80 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl p-3 transition-colors"
          >
            <Minus className="w-5 h-5 text-white" />
          </button>
          <span className="text-white text-2xl font-bold min-w-[4rem] text-center">{bet} FCFA</span>
          <button
            onClick={() => onAdjustBet(100)}
            disabled={bet > maxBalance || isProcessing}
            className="bg-gray-700/80 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl p-3 transition-colors"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
