import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import TriumphGame from '@/components/TriumphGame';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Lock } from 'lucide-react';

const ALLOWED_USER = 'SAINT';
const STORAGE_KEY = 'triumph_balance';

const TriumphPage = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  
  // Local balance stored in browser
  const [localBalance, setLocalBalance] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });

  // Save to localStorage whenever balance changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, localBalance.toString());
  }, [localBalance]);

  const handleBalanceUpdate = useCallback((amount: number) => {
    setLocalBalance(prev => prev + amount);
  }, []);

  const handleBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

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
          onClick={() => navigate('/')}
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
      balance={localBalance}
      updateBalance={handleBalanceUpdate}
    />
  );
};

export default TriumphPage;
