
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Zap, Star, Crown, Diamond } from 'lucide-react';

interface RechargeCodePurchaseProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RechargeCodePurchase = ({ isOpen, onClose }: RechargeCodePurchaseProps) => {
  const rechargeOptions = [
    {
      amount: 2000,
      icon: Zap,
      color: 'from-blue-500 to-blue-600',
      borderColor: 'border-blue-400/30',
      textColor: 'text-blue-300',
      popular: false,
      paymentLink: '#' // Tu remplaceras par le vrai lien
    },
    {
      amount: 3000,
      icon: Star,
      color: 'from-purple-500 to-purple-600',
      borderColor: 'border-purple-400/30',
      textColor: 'text-purple-300',
      popular: false,
      paymentLink: '#'
    },
    {
      amount: 5000,
      icon: Crown,
      color: 'from-amber-500 to-orange-600',
      borderColor: 'border-amber-400/30',
      textColor: 'text-amber-300',
      popular: true,
      paymentLink: '#'
    },
    {
      amount: 10000,
      icon: Diamond,
      color: 'from-emerald-500 to-emerald-600',
      borderColor: 'border-emerald-400/30',
      textColor: 'text-emerald-300',
      popular: false,
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
      <DialogContent className="bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 border border-white/20 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center mb-6">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              Acheter un code de recharge
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {rechargeOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Card 
                key={option.amount}
                className={`relative bg-black/40 backdrop-blur-md border ${option.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105 group overflow-hidden`}
              >
                {option.popular && (
                  <div className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-violet-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    POPULAIRE
                  </div>
                )}
                
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${option.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {formatAmount(option.amount)} FCFA
                    </h3>
                    <p className={`text-sm ${option.textColor} font-medium`}>
                      Code de recharge
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => handlePurchase(option.paymentLink)}
                    className={`w-full bg-gradient-to-r ${option.color} hover:opacity-90 text-white font-medium py-3 h-auto shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Acheter
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-white/70 text-sm text-center">
            💡 Les codes de recharge sont livrés instantanément après paiement
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
