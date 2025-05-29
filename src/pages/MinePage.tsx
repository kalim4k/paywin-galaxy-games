
import React from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { MineGame } from '@/components/MineGame';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { usePageTransition } from '@/hooks/usePageTransition';

const MinePage = () => {
  const { isLoading } = usePageTransition();

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <MineGame />
      <Navigation />
    </div>
  );
};

export default MinePage;
