
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Award, Coins, TrendingUp } from 'lucide-react';
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
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-600">{rank}</span>
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
        <div className="text-xl">Chargement du classement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-2xl text-center justify-center">
              <Trophy className="w-7 h-7 text-yellow-500" />
              Top 10 des Joueurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboard.map((player, index) => {
                const rank = index + 1;
                return (
                  <div
                    key={player.id}
                    className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200 ${
                      rank <= 3
                        ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {/* Rang */}
                    <div className="flex-shrink-0">
                      {getRankIcon(rank)}
                    </div>

                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={player.avatar_url || undefined} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                          {player.full_name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Informations du joueur */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {player.full_name || 'Utilisateur Anonyme'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Jeu favori: {getGameDisplayName(player.favorite_game || 'mine')}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                            <Coins className="w-5 h-5" />
                            {formatAmount(player.balance)} FCFA
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <TrendingUp className="w-4 h-4" />
                            Retiré: {formatAmount(player.total_withdrawn || 0)} FCFA
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {leaderboard.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucun joueur trouvé dans le classement
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
