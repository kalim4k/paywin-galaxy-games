
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export const useGameBalance = () => {
  const { profile, refreshProfile } = useAuth();

  const updateBalance = async (newBalance: number, transactionType: 'game_win' | 'game_loss', amount: number, description: string) => {
    if (!profile) return;

    try {
      // Use update instead of upsert for better performance and correct typing
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          balance: newBalance, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      // Fire and forget transaction logging to improve UI responsiveness
      supabase
        .from('transactions')
        .insert({
          user_id: profile.id,
          type: transactionType,
          amount: amount,
          description: description,
          status: 'completed'
        })
        .then(({ error }) => {
          if (error) console.error('Transaction logging error:', error);
        });

      await refreshProfile();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du solde:', error);
      toast.error('Erreur lors de la mise à jour du solde');
    }
  };

  return {
    profile,
    updateBalance,
    refreshProfile
  };
};
