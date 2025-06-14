
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useRechargeCodes = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();

  const validateRechargeCode = async (code: string) => {
    if (!profile) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour utiliser un code de recharge",
        variant: "destructive"
      });
      return false;
    }

    setIsLoading(true);

    try {
      // Vérifier si le code existe et n'est pas déjà utilisé
      const { data: rechargeCode, error: fetchError } = await supabase
        .from('recharge_codes')
        .select('*')
        .eq('code', code.trim().toUpperCase())
        .eq('is_used', false)
        .single();

      if (fetchError || !rechargeCode) {
        toast({
          title: "Code invalide",
          description: "Ce code de recharge n'existe pas ou a déjà été utilisé",
          variant: "destructive"
        });
        return false;
      }

      // Marquer le code comme utilisé
      const { error: updateError } = await supabase
        .from('recharge_codes')
        .update({
          is_used: true,
          used_by: profile.id,
          used_at: new Date().toISOString()
        })
        .eq('id', rechargeCode.id);

      if (updateError) {
        console.error('Erreur lors de la mise à jour du code:', updateError);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'utilisation du code",
          variant: "destructive"
        });
        return false;
      }

      // Mettre à jour le solde de l'utilisateur
      const newBalance = profile.balance + rechargeCode.amount;
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ 
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (balanceError) {
        console.error('Erreur lors de la mise à jour du solde:', balanceError);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la mise à jour du solde",
          variant: "destructive"
        });
        return false;
      }

      // Créer une transaction pour l'historique
      await supabase
        .from('transactions')
        .insert({
          user_id: profile.id,
          type: 'recharge_code',
          amount: rechargeCode.amount,
          description: `Code de recharge utilisé: ${code}`,
          status: 'completed'
        });

      // Rafraîchir le profil
      await refreshProfile();

      toast({
        title: "Code validé !",
        description: `Votre solde a été crédité de ${new Intl.NumberFormat('fr-FR').format(rechargeCode.amount)} FCFA`,
      });

      return true;
    } catch (error) {
      console.error('Erreur lors de la validation du code:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la validation du code",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    validateRechargeCode,
    isLoading
  };
};
