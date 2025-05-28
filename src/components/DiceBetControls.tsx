
import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DiceBetControlsProps {
  betAmount: number;
  onBetChange: (amount: number) => void;
  balance: number;
}

export const DiceBetControls = ({ betAmount, onBetChange, balance }: DiceBetControlsProps) => {
  const minBet = 200;
  const maxBet = Math.min(balance, 10000);

  const decreaseBet = () => {
    if (betAmount > minBet) {
      onBetChange(Math.max(minBet, betAmount - 100));
    }
  };

  const increaseBet = () => {
    if (betAmount < maxBet) {
      onBetChange(Math.min(maxBet, betAmount + 100));
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-white text-lg font-semibold text-center">Votre mise</h3>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between">
          <Button
            onClick={decreaseBet}
            disabled={betAmount <= minBet}
            variant="outline"
            size="icon"
            className="bg-gray-700/50 border-white/20 text-white hover:bg-gray-600/50 disabled:opacity-30"
          >
            <Minus className="w-4 h-4" />
          </Button>

          <div className="text-center flex-1 mx-4">
            <div className="text-2xl font-bold text-white">{betAmount.toLocaleString()}</div>
            <div className="text-sm text-white/70">FCFA</div>
          </div>

          <Button
            onClick={increaseBet}
            disabled={betAmount >= maxBet}
            variant="outline"
            size="icon"
            className="bg-gray-700/50 border-white/20 text-white hover:bg-gray-600/50 disabled:opacity-30"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="mt-3 text-center">
          <p className="text-white/60 text-sm">
            Solde: {balance.toLocaleString()} FCFA
          </p>
          <p className="text-white/50 text-xs mt-1">
            Mise min: {minBet} FCFA - Mise max: {maxBet.toLocaleString()} FCFA
          </p>
        </div>
      </div>
    </div>
  );
};
