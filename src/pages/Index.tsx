
import React from 'react';
import { Header } from '../components/Header';
import { Navigation } from '../components/Navigation';
import { GameSlider } from '../components/GameSlider';
import { GameGrid } from '../components/GameGrid';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <main className="pb-20">
        <GameSlider />
        <GameGrid />
      </main>
      <Navigation />
    </div>
  );
};

export default Index;
