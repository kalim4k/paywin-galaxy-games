
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

interface UserSearchResult {
  id: string;
  email: string;
  full_name: string | null;
}

export const useMoneyTransfer = () => {
  const { refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchUsers = async (query: string) => {
    if (!query.trim() || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .or(`email.ilike.%${query}%,full_name.ilike.%${query}%`)
        .limit(5);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast.error('Erreur lors de la recherche d\'utilisateurs');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const transferMoney = async (receiverEmail: string, amount: number, description: string = 'Transfert d\'argent') => {
    setLoading(true);
    try {
      console.log('Début du transfert:', { receiverEmail, amount, description });
      
      const { data, error } = await supabase.rpc('transfer_money', {
        p_receiver_email: receiverEmail,
        p_amount: amount,
        p_description: description
      });

      if (error) {
        console.error('Erreur RPC:', error);
        throw error;
      }

      console.log('Résultat du transfert:', data);

      const result = data as { success: boolean; error?: string; message?: string };
      
      if (!result.success) {
        toast.error(result.error || 'Erreur lors du transfert');
        return false;
      }

      toast.success(result.message || 'Transfert effectué avec succès');
      await refreshProfile();
      return true;
    } catch (error) {
      console.error('Erreur lors du transfert:', error);
      toast.error('Erreur lors du transfert d\'argent');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    searchResults,
    searchLoading,
    searchUsers,
    transferMoney,
    clearSearch: () => setSearchResults([])
  };
};
