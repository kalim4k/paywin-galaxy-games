import React from 'react';
import { Navigation } from '../components/Navigation';
import { DiceGame } from '../components/DiceGame';

const DicePage = () => {
  return (
    <div className="min-h-screen bg-[#130026] flex flex-col">
      <main className="flex-1 pb-20">
        <DiceGame />
      </main>
      <Navigation />
    </div>
  );
};

export default DicePage;
