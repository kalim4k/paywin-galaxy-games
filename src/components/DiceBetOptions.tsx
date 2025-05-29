
import React from 'react';

interface DiceBetOptionsProps {
  selectedColor: 'red' | 'black' | 'blue' | null;
  onColorSelect: (color: 'red' | 'black' | 'blue') => void;
}

export const DiceBetOptions = ({ selectedColor, onColorSelect }: DiceBetOptionsProps) => {
  const options = [
    { 
      color: 'red' as const, 
      label: 'Rouge', 
      bgColor: 'bg-red-500', 
      hoverColor: 'hover:bg-red-600'
    },
    { 
      color: 'blue' as const, 
      label: 'Bleu', 
      bgColor: 'bg-blue-500', 
      hoverColor: 'hover:bg-blue-600'
    },
    { 
      color: 'black' as const, 
      label: 'Noir', 
      bgColor: 'bg-gray-800', 
      hoverColor: 'hover:bg-gray-700'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-white text-lg font-semibold text-center">Choisissez votre couleur</h3>
      <div className="grid grid-cols-3 gap-3">
        {options.map((option) => (
          <button
            key={option.color}
            onClick={() => onColorSelect(option.color)}
            className={`
              ${option.bgColor} ${option.hoverColor}
              text-white p-6 rounded-xl font-bold text-lg
              border-2 transition-all duration-200
              ${selectedColor === option.color 
                ? 'border-yellow-400 ring-2 ring-yellow-400/50 scale-105' 
                : 'border-white/20 hover:border-white/40'
              }
            `}
          >
            <div className="text-center">
              <div className="text-xl font-bold">{option.label}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
