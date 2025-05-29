
import React from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { DiceGame } from '@/components/DiceGame';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { usePageTransition } from '@/hooks/usePageTransition';

const DicePage = () => {
  const { isLoading } = usePageTransition();

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <DiceGame />
      <Navigation />
    </div>
  );
};

export default DicePage;
