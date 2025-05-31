
import React from 'react';
import { Header } from '../components/Header';
import { Navigation } from '../components/Navigation';
import { BazGame } from '../components/BazGame';
import { BetHistory } from '../components/BetHistory';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BazPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      {/* Back button */}
      <div className="px-4 py-2">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>
      </div>

      <main className="pb-20">
        <BazGame />
        <BetHistory gameFilter="baz" title="Mes derniers paris - Baz" />
      </main>
      
      <Navigation />
    </div>
  );
};

export default BazPage;
