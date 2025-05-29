
import React from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { GameGrid } from '@/components/GameGrid';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { usePageTransition } from '@/hooks/usePageTransition';

const Index = () => {
  const { isLoading } = usePageTransition();

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <GameGrid />
      <Navigation />
    </div>
  );
};

export default Index;
