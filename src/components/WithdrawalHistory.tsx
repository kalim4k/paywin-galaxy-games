import React from 'react';
import { Clock, ArrowUpRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useWithdrawals } from '@/hooks/useWithdrawals';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const WithdrawalHistory = () => {
  const { withdrawals, loading } = useWithdrawals();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return "Aujourd'hui";
    } else if (days === 1) {
      return "Hier";
    } else if (days < 7) {
      return `Il y a ${days} jours`;
    }
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const getPaymentMethodName = (method: string) => {
    const methods: { [key: string]: string } = {
      'moov': 'Moov Money',
      'mtn': 'MTN Money',
      'orange': 'Orange Money',
      'wave': 'Wave',
      'mix': 'Mix by Yass',
      'paypal': 'PayPal',
    };
    return methods[method] || method;
  };

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'envoyé':
      case 'sent':
        return { 
          icon: Loader2, 
          color: 'text-amber-400', 
          bg: 'bg-amber-500/10',
          label: 'En cours'
        };
      case 'completed':
      case 'terminé':
        return { 
          icon: CheckCircle2, 
          color: 'text-emerald-400', 
          bg: 'bg-emerald-500/10',
          label: 'Terminé'
        };
      case 'failed':
      case 'échoué':
        return { 
          icon: AlertCircle, 
          color: 'text-red-400', 
          bg: 'bg-red-500/10',
          label: 'Échoué'
        };
      default:
        return { 
          icon: Clock, 
          color: 'text-slate-400', 
          bg: 'bg-slate-500/10',
          label: status
        };
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (withdrawals.length === 0) {
    return (
      <div className="rounded-3xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-700/50 flex items-center justify-center">
          <Clock className="w-8 h-8 text-slate-500" />
        </div>
        <p className="text-slate-400 font-medium">Aucun retrait</p>
        <p className="text-sm text-slate-500 mt-1">Vos retraits apparaîtront ici</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {withdrawals.map((withdrawal) => {
        const statusConfig = getStatusConfig(withdrawal.status);
        const StatusIcon = statusConfig.icon;
        
        return (
          <div 
            key={withdrawal.id}
            className="rounded-2xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-4 hover:bg-slate-800/70 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-slate-300" />
                </div>
                <div>
                  <p className="font-semibold text-white">{getPaymentMethodName(withdrawal.payment_method)}</p>
                  <p className="text-xs text-slate-500 truncate max-w-[140px]">{withdrawal.payment_address}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">{formatAmount(withdrawal.amount)}</p>
                <p className="text-xs text-slate-500">FCFA</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
              <span className="text-xs text-slate-500">{formatDate(withdrawal.created_at)}</span>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${statusConfig.bg}`}>
                <StatusIcon className={`w-3 h-3 ${statusConfig.color} ${statusConfig.icon === Loader2 ? 'animate-spin' : ''}`} />
                <span className={`text-xs font-medium ${statusConfig.color}`}>{statusConfig.label}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
