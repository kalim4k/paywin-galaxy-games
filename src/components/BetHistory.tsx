
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Clock, Gamepad2 } from 'lucide-react';
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGameDisplayName = (gameName: string) => {
    const games: { [key: string]: string } = {
      'mine': 'Mine',
      'dice': 'Dice',
      'rob': 'Rob',
      'baz': 'Baz'
    };
    return games[gameName] || gameName;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Card className="bg-black/20 backdrop-blur-md border border-white/10 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <Gamepad2 className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {betHistory.length === 0 ? (
          <div className="text-center py-8 text-white/60 text-sm">
            Aucun pari effectué
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  {!gameFilter && <TableHead className="text-white/70">Jeu</TableHead>}
                  <TableHead className="text-white/70">Mise</TableHead>
                  <TableHead className="text-white/70">Gain/Perte</TableHead>
                  <TableHead className="text-white/70">Multiplicateur</TableHead>
                  <TableHead className="text-white/70">Date</TableHead>
                  <TableHead className="text-white/70">Résultat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {betHistory.map((bet) => (
                  <TableRow key={bet.id} className="border-white/10 hover:bg-white/5">
                    {!gameFilter && (
                      <TableCell className="text-white/80 font-medium">
                        {getGameDisplayName(bet.game_name)}
                      </TableCell>
                    )}
                    <TableCell className="text-orange-400 font-semibold">
                      {formatAmount(bet.bet_amount)}
                    </TableCell>
                    <TableCell className={`font-semibold ${bet.result === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                      {bet.result === 'win' ? '+' : '-'}{formatAmount(bet.result === 'win' ? bet.win_amount : bet.bet_amount)}
                    </TableCell>
                    <TableCell className="text-purple-400 font-medium">
                      x{bet.multiplier}
                    </TableCell>
                    <TableCell className="text-white/80 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(bet.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1 ${bet.result === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                        {bet.result === 'win' ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span className="text-sm font-medium capitalize">{bet.result === 'win' ? 'Gagné' : 'Perdu'}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
