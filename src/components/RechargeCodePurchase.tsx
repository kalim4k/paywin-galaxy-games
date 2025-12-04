import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Coins, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface RechargeCodePurchaseProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RechargeCodePurchase = ({ isOpen, onClose }: RechargeCodePurchaseProps) => {
  const { profile } = useAuth();
  const [loadingAmount, setLoadingAmount] = useState<number | null>(null);

  const rechargeOptions = [
    { amount: 2000 },
    { amount: 3000 },
    { amount: 5000 },
    { amount: 10000 }
  ];

  const handlePurchase = async (amount: number) => {
    if (!profile) {
      toast.error('Vous devez être connecté pour effectuer une recharge');
      return;
    }

    setLoadingAmount(amount);

    try {
      const { data, error } = await supabase.functions.invoke('initiate-payment', {
        body: {
          amount,
          userId: profile.id,
          userEmail: profile.email,
          userName: profile.full_name
        }
      });

      if (error) {
        console.error('Payment error:', error);
        toast.error('Erreur lors de l\'initiation du paiement');
        return;
      }

      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        toast.error('Impossible d\'obtenir le lien de paiement');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Une erreur est survenue');
    } finally {
      setLoadingAmount(null);
    }
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
              Recharger mon compte
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
                    {formatAmount(option.amount)}
                  </div>
                  <div className="text-purple-200 text-sm">FCFA</div>
                </div>
              </div>
              
              <Button
                onClick={() => handlePurchase(option.amount)}
                disabled={loadingAmount !== null}
                className="bg-white text-purple-700 hover:bg-gray-100 font-medium px-4 py-1 h-10 text-sm min-w-[100px]"
              >
                {loadingAmount === option.amount ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  `Payer ${formatAmount(option.amount)} F`
                )}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-xs text-white/60 text-center mt-4">
          Paiement sécurisé via MoneyFusion
        </p>
      </DialogContent>
    </Dialog>
  );
};
