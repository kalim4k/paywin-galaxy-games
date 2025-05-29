
import React from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { DynamitGame } from '@/components/DynamitGame';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';

const DynamitPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
      <Header />
      
      <div className="max-w-md mx-auto pb-20">
        <div className="text-center py-6 px-4">
          <h1 className="text-2xl font-bold text-white mb-2">💥 Dynamit</h1>
          <p className="text-white/70 text-sm">Jeu VIP - Version explosive du Mine</p>
        </div>
        
        <DynamitGame />
      </div>

      <Navigation />
      <PWAInstallPrompt />
    </div>
  );
};

export default DynamitPage;
