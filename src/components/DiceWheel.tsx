
import React, { useState, useEffect } from 'react';

interface DiceWheelProps {
  isSpinning: boolean;
  result: 'red' | 'black' | 'blue' | null;
  onResult?: (color: 'red' | 'black' | 'blue', number: number) => void;
}

export const DiceWheel = ({ isSpinning, result, onResult }: DiceWheelProps) => {
  const [currentSegments, setCurrentSegments] = useState([
    { color: 'red', number: 4, bgColor: 'bg-red-500' },
    { color: 'black', number: 0, bgColor: 'bg-gray-800' },
    { color: 'blue', number: 11, bgColor: 'bg-blue-500' },
    { color: 'red', number: 5, bgColor: 'bg-red-500' }
  ]);

  const [winningSegment, setWinningSegment] = useState<{color: 'red' | 'black' | 'blue', number: number} | null>(null);

  const allSegments = [
    { color: 'red', number: 2, bgColor: 'bg-red-500' },
    { color: 'black', number: 0, bgColor: 'bg-gray-800' },
    { color: 'red', number: 3, bgColor: 'bg-red-500' },
    { color: 'blue', number: 11, bgColor: 'bg-blue-500' },
    { color: 'red', number: 4, bgColor: 'bg-red-500' },
    { color: 'black', number: 0, bgColor: 'bg-gray-800' },
    { color: 'red', number: 5, bgColor: 'bg-red-500' },
    { color: 'blue', number: 12, bgColor: 'bg-blue-500' },
    { color: 'red', number: 6, bgColor: 'bg-red-500' },
    { color: 'black', number: 0, bgColor: 'bg-gray-800' },
    { color: 'red', number: 7, bgColor: 'bg-red-500' },
    { color: 'blue', number: 13, bgColor: 'bg-blue-500' },
    { color: 'red', number: 8, bgColor: 'bg-red-500' },
    { color: 'black', number: 0, bgColor: 'bg-gray-800' },
    { color: 'blue', number: 14, bgColor: 'bg-blue-500' },
    { color: 'red', number: 2, bgColor: 'bg-red-500' }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isSpinning) {
      setWinningSegment(null);
      interval = setInterval(() => {
        setCurrentSegments(() => {
          const randomStart = Math.floor(Math.random() * (allSegments.length - 4));
          return allSegments.slice(randomStart, randomStart + 4);
        });
      }, 50);
    } else if (result) {
      // Générer le segment gagnant basé sur la couleur résultat
      let winningNumber: number;
      if (result === 'red') {
        winningNumber = [2, 3, 4, 5, 6, 7, 8][Math.floor(Math.random() * 7)];
      } else if (result === 'black') {
        winningNumber = 0;
      } else {
        winningNumber = [11, 12, 13, 14][Math.floor(Math.random() * 4)];
      }

      const winningSegmentData = { color: result, number: winningNumber };
      setWinningSegment(winningSegmentData);

      // Définir les segments finaux avec le segment gagnant au centre
      const finalSegments = [
        { color: 'red', number: 3, bgColor: 'bg-red-500' },
        { color: 'black', number: 0, bgColor: 'bg-gray-800' },
        winningSegmentData,
        { color: 'red', number: 6, bgColor: 'bg-red-500' }
      ];
      
      setCurrentSegments(finalSegments.map(seg => ({
        ...seg,
        bgColor: seg.color === 'red' ? 'bg-red-500' : seg.color === 'black' ? 'bg-gray-800' : 'bg-blue-500'
      })));

      // Notifier le parent du résultat
      if (onResult) {
        onResult(result, winningNumber);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSpinning, result, onResult]);

  return (
    <div className="flex justify-center">
      <div className="relative">
        {/* Wheel container */}
        <div className="w-96 h-24 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
          <div className={`flex h-full transition-transform duration-75 ${isSpinning ? 'animate-pulse' : ''}`}>
            {currentSegments.map((segment, index) => (
              <div
                key={`${segment.color}-${segment.number}-${index}`}
                className={`flex-1 ${segment.bgColor} flex items-center justify-center border-r-2 border-white/20 last:border-r-0 transition-all duration-75 ${
                  !isSpinning && winningSegment && index === 2 ? 'ring-4 ring-yellow-400 ring-opacity-90 scale-110 z-10' : ''
                }`}
              >
                <span className={`text-white text-3xl font-bold transition-all duration-75 ${
                  isSpinning ? 'blur-sm' : ''
                }`}>
                  {segment.number}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Zone gagnante - centrée sur le segment du milieu */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-full pointer-events-none">
          <div className="w-full h-full border-l-4 border-r-4 border-yellow-400 bg-yellow-400/20"></div>
        </div>

        {/* Pointer pointant vers la zone gagnante */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3">
          <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-l-transparent border-r-transparent border-b-yellow-400 drop-shadow-lg"></div>
        </div>

        {/* Spinning indicator */}
        {isSpinning && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white font-bold animate-pulse">Rotation...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
