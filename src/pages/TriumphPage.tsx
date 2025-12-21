import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useGameBalance } from '@/hooks/useGameBalance';
import TriumphGame from '@/components/TriumphGame';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Lock } from 'lucide-react';

const ALLOWED_USER = 'SAINT';
const SYNC_INTERVAL = 2000; // Sync to DB every 2 seconds

const TriumphPage = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const { updateBalance } = useGameBalance();
  
  // Local balance state for immediate UI updates
  const [localBalance, setLocalBalance] = useState(0);
  const pendingEarningsRef = useRef(0);
  const lastSyncRef = useRef(Date.now());
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize local balance from profile
  useEffect(() => {
    if (profile) {
      setLocalBalance(profile.balance);
    }
  }, [profile?.balance]);

  // Sync pending earnings to database
  const syncToDatabase = useCallback(async () => {
    if (pendingEarningsRef.current > 0 && profile) {
      const earnings = pendingEarningsRef.current;
      pendingEarningsRef.current = 0;
      
      const newBalance = profile.balance + earnings;
      await updateBalance(newBalance, 'game_win', earnings, 'Gains Triumph');
    }
  }, [profile, updateBalance]);

  // Cleanup: sync remaining earnings when leaving
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      // Final sync on unmount
      if (pendingEarningsRef.current > 0 && profile) {
        const earnings = pendingEarningsRef.current;
        const newBalance = profile.balance + earnings;
        updateBalance(newBalance, 'game_win', earnings, 'Gains Triumph');
      }
    };
  }, [profile, updateBalance]);

  const handleBalanceUpdate = useCallback((amount: number) => {
    // Update local balance immediately for UI
    setLocalBalance(prev => prev + amount);
    
    // Accumulate earnings
    pendingEarningsRef.current += amount;
    
    // Debounced sync to database
    const now = Date.now();
    if (now - lastSyncRef.current >= SYNC_INTERVAL) {
      lastSyncRef.current = now;
      syncToDatabase();
    } else {
      // Schedule a sync if not already scheduled
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      syncTimeoutRef.current = setTimeout(() => {
        lastSyncRef.current = Date.now();
        syncToDatabase();
      }, SYNC_INTERVAL);
    }
  }, [syncToDatabase]);

  const handleBack = useCallback(async () => {
    // Sync any remaining earnings before leaving
    await syncToDatabase();
    navigate('/');
  }, [navigate, syncToDatabase]);

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
