
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Coins } from 'lucide-react';

interface RechargeCodePurchaseProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RechargeCodePurchase = ({ isOpen, onClose }: RechargeCodePurchaseProps) => {
  const rechargeOptions = [
    {
      amount: 2000,
      coins: 2000,
      paymentLink: '#' // Tu remplaceras par le vrai lien
    },
    {
      amount: 3000,
      coins: 3000,
      paymentLink: '#'
    },
    {
      amount: 5000,
      coins: 5000,
      paymentLink: '#'
    },
    {
      amount: 10000,
      coins: 10000,
      paymentLink: '#'
    }
  ];

  const handlePurchase = (paymentLink: string) => {
    window.open(paymentLink, '_blank');
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border border-purple-500/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white text-center mb-4">
            <div className="flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5 text-purple-400" />
              Acheter un code de recharge
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {rechargeOptions.map((option) => (
            <div 
              key={option.amount}
              className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Coins className="w-6 h-6 text-purple-800" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {formatAmount(option.coins)}
                  </div>
                  <div className="text-purple-200 text-sm">Coins</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-yellow-300 font-bold text-lg mb-2">
                  {formatAmount(option.amount)} FCFA
                </div>
                <Button
                  onClick={() => handlePurchase(option.paymentLink)}
                  className="bg-white text-purple-700 hover:bg-gray-100 font-medium px-4 py-1 h-8 text-sm"
                >
                  + Acheter
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
