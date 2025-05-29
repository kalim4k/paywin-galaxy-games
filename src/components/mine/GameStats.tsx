
import React from 'react';
import { Star } from 'lucide-react';

interface GameStatsProps {
  isPlaying: boolean;
  gameEnded: boolean;
  bet: number;
  revealedStars: number;
  bombs: number;
  nextMultipliers: number[];
  calculateMultiplier: (starsFound: number, bombCount: number) => number;
}

export const GameStats = ({ 
  isPlaying, 
  gameEnded, 
  bet, 
  revealedStars, 
  bombs, 
  nextMultipliers, 
  calculateMultiplier 
}: GameStatsProps) => {
  if (!isPlaying || gameEnded) return null;

  return (
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
  );
};
