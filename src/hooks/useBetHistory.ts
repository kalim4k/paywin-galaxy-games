
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface BetHistoryEntry {
  id: string;
  game_name: string;
  bet_amount: number;
  win_amount: number;
  multiplier: number;
  result: string;
  created_at: string;
}

export const useBetHistory = (gameFilter?: string) => {
  const { profile } = useAuth();
  const [betHistory, setBetHistory] = useState<BetHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBetHistory = async () => {
    if (!profile) return;

    try {
      let query = supabase
        .from('bet_history')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(7);

      if (gameFilter) {
        query = query.eq('game_name', gameFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBetHistory(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique des paris:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBetEntry = async (gameData: {
    game_name: string;
    bet_amount: number;
    win_amount: number;
    multiplier: number;
    result: string;
  }) => {
    if (!profile) return false;

    try {
      const { error } = await supabase
        .from('bet_history')
        .insert({
          user_id: profile.id,
          ...gameData
        });

      if (error) throw error;
      await fetchBetHistory();
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'entrée:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchBetHistory();
  }, [profile, gameFilter]);

  return {
    betHistory,
    loading,
    addBetEntry,
    refreshBetHistory: fetchBetHistory
  };
};
