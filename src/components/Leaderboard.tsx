
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Award, Coins } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LeaderboardEntry {
  id: string;
  full_name: string;
  avatar_url: string | null;
  balance: number;
  total_withdrawn: number;
  favorite_game: string;
}

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, balance, total_withdrawn, favorite_game')
        .order('balance', { ascending: false })
        .limit(10);

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement du classement:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 2:
        return <Medal className="w-4 h-4 text-gray-400" />;
      case 3:
        return <Award className="w-4 h-4 text-amber-600" />;
      default:
        return (
          <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-600">{rank}</span>
          </div>
        );
    }
  };

  const getGameDisplayName = (gameName: string) => {
    const gameNames: { [key: string]: string } = {
      'mine': 'Mine',
      'dice': 'Dice',
      'crash': 'Crash',
      'roulette': 'Roulette'
    };
    return gameNames[gameName] || gameName;
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl text-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Top 10 des Joueurs
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <div className="w-full">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 text-xs font-semibold text-gray-700">Rang</th>
                    <th className="text-left py-2 px-2 text-xs font-semibold text-gray-700">Joueur</th>
                    <th className="text-left py-2 px-2 text-xs font-semibold text-gray-700">Jeu</th>
                    <th className="text-right py-2 px-2 text-xs font-semibold text-gray-700">Solde</th>
                    <th className="text-right py-2 px-2 text-xs font-semibold text-gray-700">Retiré</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((player, index) => {
                    const rank = index + 1;
                    return (
                      <tr
                        key={player.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
                        }`}
                      >
                        {/* Rang */}
                        <td className="py-2 px-2">
                          <div className="flex items-center justify-start">
                            {getRankIcon(rank)}
                          </div>
                        </td>

                        {/* Joueur */}
                        <td className="py-2 px-2">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={player.avatar_url || undefined} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                                {player.full_name?.charAt(0)?.toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-xs font-medium text-gray-900 truncate max-w-20">
                              {player.full_name || 'Anonyme'}
                            </div>
                          </div>
                        </td>

                        {/* Jeu Favori */}
                        <td className="py-2 px-2">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {getGameDisplayName(player.favorite_game || 'mine')}
                          </span>
                        </td>

                        {/* Solde */}
                        <td className="py-2 px-2 text-right">
                          <div className="flex items-center justify-end gap-1 text-xs font-bold text-green-600">
                            <Coins className="w-3 h-3" />
                            <span className="truncate">{formatAmount(player.balance)}</span>
                          </div>
                        </td>

                        {/* Montant Retiré */}
                        <td className="py-2 px-2 text-right">
                          <div className="text-xs text-gray-600 truncate">
                            {formatAmount(player.total_withdrawn || 0)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {leaderboard.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Aucun joueur trouvé
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
