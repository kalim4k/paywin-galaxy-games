
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
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
        <div className="text-xl">Chargement du classement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-2 text-2xl text-center justify-center">
              <Trophy className="w-7 h-7 text-yellow-500" />
              Top 10 des Joueurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="text-left font-semibold text-gray-700">Rang</TableHead>
                    <TableHead className="text-left font-semibold text-gray-700">Joueur</TableHead>
                    <TableHead className="text-left font-semibold text-gray-700">Jeu Favori</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700">Solde</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700">Retiré</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.map((player, index) => {
                    const rank = index + 1;
                    return (
                      <TableRow
                        key={player.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
                        }`}
                      >
                        {/* Rang */}
                        <TableCell className="py-4">
                          <div className="flex items-center justify-center w-8">
                            {getRankIcon(rank)}
                          </div>
                        </TableCell>

                        {/* Joueur (Avatar + Nom) */}
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={player.avatar_url || undefined} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm">
                                {player.full_name?.charAt(0)?.toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900">
                                {player.full_name || 'Utilisateur Anonyme'}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Jeu Favori */}
                        <TableCell className="py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {getGameDisplayName(player.favorite_game || 'mine')}
                          </span>
                        </TableCell>

                        {/* Solde */}
                        <TableCell className="py-4 text-right">
                          <div className="flex items-center justify-end gap-1 text-lg font-bold text-green-600">
                            <Coins className="w-4 h-4" />
                            {formatAmount(player.balance)} FCFA
                          </div>
                        </TableCell>

                        {/* Montant Retiré */}
                        <TableCell className="py-4 text-right">
                          <div className="flex items-center justify-end gap-1 text-sm text-gray-600">
                            <TrendingUp className="w-4 h-4" />
                            {formatAmount(player.total_withdrawn || 0)} FCFA
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {leaderboard.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucun joueur trouvé dans le classement
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
