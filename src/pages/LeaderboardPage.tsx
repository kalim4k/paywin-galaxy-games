
import React from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { Leaderboard } from '@/components/Leaderboard';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { usePageTransition } from '@/hooks/usePageTransition';

const LeaderboardPage = () => {
  const { isLoading } = usePageTransition();

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Leaderboard />
      <Navigation />
    </div>
  );
};

export default LeaderboardPage;
