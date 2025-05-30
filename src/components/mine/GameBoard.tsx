
import React from 'react';
import { Bomb, Star } from 'lucide-react';

interface GameBoardProps {
  gameBoard: ('hidden' | 'star' | 'bomb')[];
  revealedCells: boolean[];
  isPlaying: boolean;
  gameEnded: boolean;
  onCellClick: (index: number) => void;
  showingBombs?: boolean;
  bombPositions?: number[];
}

export const GameBoard = ({ 
  gameBoard, 
  revealedCells, 
  isPlaying, 
  gameEnded, 
  onCellClick,
  showingBombs = false,
  bombPositions = []
}: GameBoardProps) => {
  return (
    <div className="bg-gray-800/50 rounded-2xl p-3 mb-3">
      <div className="grid grid-cols-5 gap-2">
        {gameBoard.map((cell, index) => {
          const isRevealed = revealedCells[index];
          const isBombPosition = bombPositions.includes(index);
          const shouldShowBomb = showingBombs && isBombPosition;
          
          return (
            <button
              key={index}
              onClick={() => onCellClick(index)}
              disabled={!isPlaying || isRevealed || gameEnded}
              className={`
                aspect-square rounded-xl border-2 transition-all duration-75 text-lg font-bold
                ${isRevealed 
                  ? cell === 'bomb' 
                    ? 'bg-red-500 border-red-400 shadow-lg shadow-red-500/30' 
                    : 'bg-yellow-500 border-yellow-400 shadow-lg shadow-yellow-500/30'
                  : shouldShowBomb
                    ? 'bg-red-500/80 border-red-400/60 animate-pulse shadow-lg shadow-red-500/50'
                    : 'bg-blue-500/80 border-blue-400/60 hover:bg-blue-400 hover:border-blue-300 active:scale-95 transform will-change-transform'
                }
                ${!isPlaying || gameEnded ? 'opacity-50' : 'hover:shadow-lg hover:shadow-blue-500/20'}
                flex items-center justify-center select-none touch-manipulation
              `}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {(isRevealed || shouldShowBomb) && (
                <>
                  {(cell === 'bomb' || shouldShowBomb) ? (
                    <Bomb className="w-6 h-6 text-white" />
                  ) : (
                    <Star className="w-6 h-6 text-white fill-current" />
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
