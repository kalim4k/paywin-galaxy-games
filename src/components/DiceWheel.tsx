
import React, { useState, useEffect } from 'react';

interface DiceWheelProps {
  isSpinning: boolean;
  result: 'red' | 'black' | 'blue' | null;
}

export const DiceWheel = ({ isSpinning, result }: DiceWheelProps) => {
  const [currentSegments, setCurrentSegments] = useState([
    { color: 'red', number: 4, bgColor: 'bg-red-500' },
    { color: 'black', number: 0, bgColor: 'bg-gray-800' },
    { color: 'blue', number: 11, bgColor: 'bg-blue-500' },
    { color: 'red', number: 5, bgColor: 'bg-red-500' },
    { color: 'black', number: 0, bgColor: 'bg-gray-800' },
    { color: 'red', number: 6, bgColor: 'bg-red-500' },
    { color: 'blue', number: 11, bgColor: 'bg-blue-500' }
  ]);

  const allSegments = [
    { color: 'red', number: 1, bgColor: 'bg-red-500' },
    { color: 'black', number: 0, bgColor: 'bg-gray-800' },
    { color: 'red', number: 2, bgColor: 'bg-red-500' },
    { color: 'blue', number: 11, bgColor: 'bg-blue-500' },
    { color: 'red', number: 3, bgColor: 'bg-red-500' },
    { color: 'black', number: 0, bgColor: 'bg-gray-800' },
    { color: 'red', number: 4, bgColor: 'bg-red-500' },
    { color: 'blue', number: 11, bgColor: 'bg-blue-500' },
    { color: 'red', number: 5, bgColor: 'bg-red-500' },
    { color: 'black', number: 0, bgColor: 'bg-gray-800' },
    { color: 'red', number: 6, bgColor: 'bg-red-500' },
    { color: 'blue', number: 11, bgColor: 'bg-blue-500' },
    { color: 'red', number: 7, bgColor: 'bg-red-500' },
    { color: 'black', number: 0, bgColor: 'bg-gray-800' },
    { color: 'red', number: 8, bgColor: 'bg-red-500' },
    { color: 'blue', number: 11, bgColor: 'bg-blue-500' }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isSpinning) {
      interval = setInterval(() => {
        setCurrentSegments(() => {
          const randomStart = Math.floor(Math.random() * (allSegments.length - 7));
          return allSegments.slice(randomStart, randomStart + 7);
        });
      }, 50);
    } else if (result) {
      // Positionner le résultat au centre (case du milieu)
      const resultSegments = [
        { color: 'red', number: 2, bgColor: 'bg-red-500' },
        { color: 'black', number: 0, bgColor: 'bg-gray-800' },
        { color: 'red', number: 1, bgColor: 'bg-red-500' },
        { color: result, number: result === 'red' ? Math.floor(Math.random() * 8) + 1 : result === 'black' ? 0 : 11, bgColor: result === 'red' ? 'bg-red-500' : result === 'black' ? 'bg-gray-800' : 'bg-blue-500' },
        { color: 'red', number: 7, bgColor: 'bg-red-500' },
        { color: 'blue', number: 11, bgColor: 'bg-blue-500' },
        { color: 'red', number: 3, bgColor: 'bg-red-500' }
      ];
      setCurrentSegments(resultSegments);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSpinning, result]);

  const getWinningSegment = () => {
    return currentSegments[3]; // Case du milieu (index 3)
  };

  return (
    <div className="w-full px-0">
      <div className="relative w-full">
        {/* Wheel container - étendu jusqu'aux bords */}
        <div className="w-full h-20 bg-gray-800/50 backdrop-blur-sm border-y border-white/10 overflow-hidden">
          <div className={`flex h-full transition-transform duration-75 ${isSpinning ? 'animate-pulse' : ''}`}>
            {currentSegments.map((segment, index) => (
              <div
                key={`${segment.color}-${segment.number}-${index}`}
                className={`flex-1 ${segment.bgColor} flex items-center justify-center border-r-2 border-white/20 last:border-r-0 transition-all duration-75 ${
                  !isSpinning && result && index === 3 ? 'ring-4 ring-yellow-400 ring-opacity-70' : ''
                }`}
              >
                <span className={`text-white text-2xl font-bold transition-all duration-75 ${
                  isSpinning ? 'blur-sm' : ''
                }`}>
                  {segment.number}
                </span>
              </div>
            ))}
          </div>
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
