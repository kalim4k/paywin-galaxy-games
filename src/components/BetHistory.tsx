
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBetHistory } from '@/hooks/useBetHistory';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface BetHistoryProps {
  gameFilter?: string;
  title?: string;
}

export const BetHistory: React.FC<BetHistoryProps> = ({ gameFilter, title = "Historique des paris" }) => {
  const { betHistory, loading } = useBetHistory(gameFilter);

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M FCFA`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}k FCFA`;
    }
    return `${amount} FCFA`;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Card className="bg-black/20 backdrop-blur-md border border-white/10 shadow-xl mx-4 mb-4">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {betHistory.length === 0 ? (
          <div className="text-center py-8 text-white/60 text-sm">
            Aucun pari effectué
          </div>
        ) : (
          <div className="space-y-3">
            {/* En-têtes */}
            <div className="grid grid-cols-4 gap-4 pb-2 border-b border-white/10">
              <div className="text-white/60 text-sm font-medium">Joueur</div>
              <div className="text-white/60 text-sm font-medium text-center">Mise</div>
              <div className="text-white/60 text-sm font-medium text-center">Coef</div>
              <div className="text-white/60 text-sm font-medium text-center">Gain</div>
            </div>
            
            {/* Données */}
            {betHistory.map((bet) => (
              <div key={bet.id} className="grid grid-cols-4 gap-4 py-2 hover:bg-white/5 rounded-lg transition-colors">
                <div className="text-blue-400 text-sm font-medium">Moi</div>
                <div className="text-white text-sm text-center">
                  {formatAmount(bet.bet_amount)}
                </div>
                <div className="text-white text-sm text-center">
                  x{bet.multiplier}
                </div>
                <div className={`text-sm text-center font-medium ${
                  bet.result === 'win' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {bet.result === 'win' ? formatAmount(bet.win_amount) : '0 FCFA'}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
