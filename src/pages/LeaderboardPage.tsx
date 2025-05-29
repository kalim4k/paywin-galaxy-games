
import React from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { Leaderboard } from '@/components/Leaderboard';

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Leaderboard />
      <Navigation />
    </div>
  );
};

export default LeaderboardPage;
