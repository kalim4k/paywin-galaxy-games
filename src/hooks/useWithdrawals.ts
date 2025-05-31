
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Withdrawal {
  id: string;
  amount: number;
  payment_method: string;
  payment_address: string;
  status: string;
  created_at: string;
}

export const useWithdrawals = () => {
  const { profile } = useAuth();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWithdrawals = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWithdrawals(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des retraits:', error);
    } finally {
      setLoading(false);
    }
  };

  const createWithdrawal = async (amount: number, paymentMethod: string, paymentAddress: string) => {
    if (!profile) return false;

    try {
      const { error } = await supabase
        .from('withdrawals')
        .insert({
          user_id: profile.id,
          amount,
          payment_method: paymentMethod,
          payment_address: paymentAddress,
          status: 'Envoyé'
        });

      if (error) throw error;
      await fetchWithdrawals();
      return true;
    } catch (error) {
      console.error('Erreur lors de la création du retrait:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [profile]);

  return {
    withdrawals,
    loading,
    createWithdrawal,
    refreshWithdrawals: fetchWithdrawals
  };
};
