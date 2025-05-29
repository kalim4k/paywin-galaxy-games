
import React from 'react';
import { Star, AlertTriangle } from 'lucide-react';

interface GameStatsProps {
  isPlaying: boolean;
  gameEnded: boolean;
  bet: number;
  revealedStars: number;
  bombs: number;
  nextMultipliers: number[];
  currentLoseProbability: number;
  calculateMultiplier: (starsFound: number, bombCount: number) => number;
}

export const GameStats = ({ 
  isPlaying, 
  gameEnded, 
  bet, 
  revealedStars, 
  bombs, 
  nextMultipliers, 
  currentLoseProbability,
  calculateMultiplier 
}: GameStatsProps) => {
  if (!isPlaying || gameEnded) return null;

  const nextGain = bet * calculateMultiplier(revealedStars + 1, bombs);
  const riskLevel = currentLoseProbability;
  
  const getRiskColor = () => {
    if (riskLevel < 0.3) return 'text-green-400';
    if (riskLevel < 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskText = () => {
    if (riskLevel < 0.3) return 'Faible';
    if (riskLevel < 0.6) return 'Moyen';
    return 'Élevé';
  };

  return (
    <div className="bg-gray-800/50 rounded-2xl p-4 mb-3 space-y-3">
      {/* Prochains gains */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <span className="text-white text-sm font-medium">
            Prochain gain: {nextGain.toFixed(0)} FCFA
          </span>
        </div>
        <div className="flex space-x-2">
          {nextMultipliers.slice(0, 2).map((mult, index) => (
            <span
              key={index}
              className="text-gray-400 text-sm font-medium bg-gray-700/50 px-2 py-1 rounded"
            >
              x{mult.toFixed(2)}
            </span>
          ))}
        </div>
      </div>

      {/* Indicateur de risque */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className={`w-5 h-5 ${getRiskColor()}`} />
          <span className="text-white text-sm font-medium">
            Risque: <span className={getRiskColor()}>{getRiskText()}</span>
          </span>
        </div>
        <span className={`text-sm font-bold ${getRiskColor()}`}>
          {(riskLevel * 100).toFixed(1)}%
        </span>
      </div>

      {/* Statistiques du jeu */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-gray-700/30 rounded-lg p-2">
          <div className="text-yellow-400 text-lg font-bold">{revealedStars}</div>
          <div className="text-gray-400 text-xs">Étoiles</div>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-2">
          <div className="text-red-400 text-lg font-bold">{bombs}</div>
          <div className="text-gray-400 text-xs">Bombes</div>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-2">
          <div className="text-blue-400 text-lg font-bold">{25 - bombs - revealedStars}</div>
          <div className="text-gray-400 text-xs">Restantes</div>
        </div>
      </div>
    </div>
  );
};
