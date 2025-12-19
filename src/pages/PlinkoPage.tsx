import React from 'react';
import { Navigation } from '../components/Navigation';
import { PlinkoGame } from '../components/PlinkoGame';

const PlinkoPage = () => {
  return (
    <div className="min-h-screen bg-[#130026] flex flex-col">
      <main className="flex-1 pb-20">
        <PlinkoGame />
      </main>
      <Navigation />
    </div>
  );
};

export default PlinkoPage;
