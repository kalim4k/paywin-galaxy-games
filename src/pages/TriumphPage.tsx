import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useGameBalance } from '@/hooks/useGameBalance';
import TriumphGame from '@/components/TriumphGame';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Lock } from 'lucide-react';

const ALLOWED_USER = 'SAINT';

const TriumphPage = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const { updateBalance } = useGameBalance();

  const handleBalanceUpdate = async (amount: number) => {
    if (profile) {
      const newBalance = profile.balance + amount;
      await updateBalance(newBalance, 'game_win', amount, 'Gains Triumph');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Check if user is allowed (SAINT only)
  const isAllowed = profile?.full_name?.toUpperCase() === ALLOWED_USER;

  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
        <Lock className="w-20 h-20 text-red-500 mb-6" />
        <h1 className="text-2xl font-bold mb-2">Accès Restreint</h1>
        <p className="text-gray-400 mb-6 text-center">Ce jeu est réservé aux utilisateurs autorisés.</p>
        <button 
          onClick={handleBack}
          className="px-8 py-3 bg-white text-black font-bold rounded-full"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <TriumphGame
      onBack={handleBack}
      balance={profile?.balance || 0}
      updateBalance={handleBalanceUpdate}
    />
  );
};

export default TriumphPage;
