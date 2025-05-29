
import React from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('fr-FR').format(balance);
  };

  const handleDepositClick = () => {
    navigate('/withdrawal');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
          <span className="text-black font-bold text-lg">P</span>
        </div>
        <h1 className="text-white font-bold text-xl">PAYWIN</h1>
      </div>
      
      <div className="flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-full">
        <span className="text-white font-semibold">
          {profile ? `${formatBalance(profile.balance)} FCFA` : '0 FCFA'}
        </span>
        <button 
          onClick={handleDepositClick}
          className="bg-white/20 p-1 rounded-full hover:bg-white/30 transition-all duration-200"
        >
          <Plus className="w-4 h-4 text-white" />
        </button>
      </div>
    </header>
  );
};
