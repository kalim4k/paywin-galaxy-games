
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/LoadingSpinner';

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
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
        <Card className="bg-black/20 backdrop-blur-md border border-white/10 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl text-center justify-center text-white">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Top 10 des Joueurs
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <div className="w-full">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 px-2 text-xs font-semibold text-white/70">Rang</th>
                    <th className="text-left py-2 px-2 text-xs font-semibold text-white/70">Joueur</th>
                    <th className="text-right py-2 px-2 text-xs font-semibold text-white/70">Solde</th>
                    <th className="text-right py-2 px-2 text-xs font-semibold text-white/70">Retiré</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((player, index) => {
                    const rank = index + 1;
                    return (
                      <tr
                        key={player.id}
                        className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                          rank <= 3 ? 'bg-gradient-to-r from-yellow-400/10 to-orange-500/10' : ''
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
                            <div className="text-xs font-medium text-white truncate max-w-20">
                              {player.full_name || 'Anonyme'}
                            </div>
                          </div>
                        </td>

                        {/* Solde */}
                        <td className="py-2 px-2 text-right">
                          <div className="text-xs font-bold text-green-400 truncate">
                            {formatAmount(player.balance)}
                          </div>
                        </td>

                        {/* Montant Retiré */}
                        <td className="py-2 px-2 text-right">
                          <div className="text-xs text-white/60 truncate">
                            {formatAmount(player.total_withdrawn || 0)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {leaderboard.length === 0 && (
                <div className="text-center py-8 text-white/60 text-sm">
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
