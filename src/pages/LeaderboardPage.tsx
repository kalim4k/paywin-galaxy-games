
import React from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { Leaderboard } from '@/components/Leaderboard';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <Leaderboard />
      <Navigation />
      <PWAInstallPrompt />
    </div>
  );
};

export default LeaderboardPage;
