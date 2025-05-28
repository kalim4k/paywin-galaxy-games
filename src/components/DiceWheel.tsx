
import React from 'react';

interface DiceWheelProps {
  isSpinning: boolean;
  result: 'red' | 'black' | 'blue' | null;
}

export const DiceWheel = ({ isSpinning, result }: DiceWheelProps) => {
  const segments = [
    { color: 'red', number: 4, bgColor: 'bg-red-500' },
    { color: 'black', number: 0, bgColor: 'bg-gray-800' },
    { color: 'blue', number: 11, bgColor: 'bg-blue-500' },
    { color: 'red', number: 5, bgColor: 'bg-red-500' }
  ];

  return (
    <div className="flex justify-center">
      <div className="relative">
        {/* Wheel container */}
        <div className="w-80 h-20 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
          <div className="flex h-full">
            {segments.map((segment, index) => (
              <div
                key={index}
                className={`flex-1 ${segment.bgColor} flex items-center justify-center border-r-2 border-white/20 last:border-r-0 transition-all duration-300 ${
                  isSpinning ? 'animate-pulse' : ''
                } ${
                  result && segment.color === result ? 'ring-4 ring-yellow-400 ring-opacity-70' : ''
                }`}
              >
                <span className="text-white text-2xl font-bold">{segment.number}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
        </div>

        {/* Spinning indicator */}
        {isSpinning && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white font-bold">Rotation...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
