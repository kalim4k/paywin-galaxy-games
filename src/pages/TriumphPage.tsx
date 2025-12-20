import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useGameBalance } from '@/hooks/useGameBalance';
import TriumphGame from '@/components/TriumphGame';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const DAILY_TIME_LIMIT = 300; // 5 minutes per day

const TriumphPage = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const { updateBalance } = useGameBalance();
  const [timeRemaining, setTimeRemaining] = useState(DAILY_TIME_LIMIT);

  useEffect(() => {
    // Load saved time from localStorage
    const today = new Date().toDateString();
    const savedData = localStorage.getItem('triumph_time_data');
    
    if (savedData) {
      const { date, timeUsed } = JSON.parse(savedData);
      if (date === today) {
        setTimeRemaining(Math.max(0, DAILY_TIME_LIMIT - timeUsed));
      } else {
        // New day, reset time
        localStorage.setItem('triumph_time_data', JSON.stringify({ date: today, timeUsed: 0 }));
        setTimeRemaining(DAILY_TIME_LIMIT);
      }
    } else {
      localStorage.setItem('triumph_time_data', JSON.stringify({ date: today, timeUsed: 0 }));
    }
  }, []);

  const handleTimeUpdate = (secondsUsed: number) => {
    const today = new Date().toDateString();
    const savedData = localStorage.getItem('triumph_time_data');
    let totalUsed = secondsUsed;
    
    if (savedData) {
      const { date, timeUsed } = JSON.parse(savedData);
      if (date === today) {
        totalUsed = timeUsed + secondsUsed;
      }
    }
    
    localStorage.setItem('triumph_time_data', JSON.stringify({ date: today, timeUsed: totalUsed }));
    setTimeRemaining(Math.max(0, DAILY_TIME_LIMIT - totalUsed));
  };

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

  if (timeRemaining <= 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
        <div className="text-6xl mb-4">⏰</div>
        <h1 className="text-2xl font-bold mb-2">Temps écoulé pour aujourd'hui</h1>
        <p className="text-gray-400 mb-6 text-center">Revenez demain pour jouer à nouveau!</p>
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
      initialTime={timeRemaining}
      onTimeUpdate={handleTimeUpdate}
    />
  );
};

export default TriumphPage;
