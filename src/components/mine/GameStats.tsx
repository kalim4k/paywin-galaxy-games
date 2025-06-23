
import React from 'react';
import { Star, TrendingUp, Target } from 'lucide-react';

interface GameStatsProps {
  isPlaying: boolean;
  gameEnded: boolean;
  bet: number;
  revealedStars: number;
  bombs: number;
  nextMultipliers: number[];
  calculateMultiplier: (starsFound: number, bombCount: number) => number;
  isDesktop?: boolean;
}

export const GameStats = ({ 
  isPlaying, 
  gameEnded, 
  bet, 
  revealedStars, 
  bombs, 
  nextMultipliers, 
  calculateMultiplier,
  isDesktop = false
}: GameStatsProps) => {
  if (!isPlaying || gameEnded) return null;

  if (isDesktop) {
    return (
      <div className="bg-gray-800/50 rounded-2xl p-6 space-y-6">
        <h3 className="text-white text-xl font-semibold mb-4">Statistiques</h3>
        
        {/* Gain actuel */}
        <div className="bg-gray-700/50 rounded-xl p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-gray-300 text-base font-medium">Gain actuel</span>
          </div>
          <div className="text-white text-2xl font-bold">
            {(bet * calculateMultiplier(revealedStars, bombs)).toFixed(0)} FCFA
          </div>
        </div>

        {/* Prochain gain */}
        <div className="bg-gray-700/50 rounded-xl p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="text-gray-300 text-base font-medium">Prochain gain</span>
          </div>
          <div className="text-white text-xl font-bold">
            {(bet * calculateMultiplier(revealedStars + 1, bombs)).toFixed(0)} FCFA
          </div>
        </div>

        {/* Multiplicateurs suivants */}
        <div className="bg-gray-700/50 rounded-xl p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300 text-base font-medium">Multiplicateurs</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {nextMultipliers.slice(0, 4).map((mult, index) => (
              <span
                key={index}
                className="bg-gray-600/50 text-gray-300 text-sm font-medium px-3 py-1 rounded-lg"
              >
                x{mult.toFixed(2)}
              </span>
            ))}
          </div>
        </div>

        {/* Étoiles trouvées */}
        <div className="bg-gray-700/50 rounded-xl p-4 space-y-3">
          <span className="text-gray-300 text-base font-medium">Étoiles trouvées</span>
          <div className="text-white text-xl font-bold">{revealedStars}</div>
        </div>
      </div>
    );
  }

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
