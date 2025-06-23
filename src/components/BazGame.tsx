
import React from 'react';
import { useBazGame } from '@/hooks/useBazGame';
import { GameBoard } from './mine/GameBoard';
import { GameControls } from './mine/GameControls';
import { GameStats } from './mine/GameStats';
import { ActionButtons } from './mine/ActionButtons';
import { useIsMobile } from '@/hooks/use-mobile';

export const BazGame = () => {
  const {
    bet,
    bombs,
    isPlaying,
    gameBoard,
    revealedCells,
    currentMultiplier,
    gameEnded,
    won,
    revealedStars,
    isProcessing,
    profile,
    potentialWin,
    nextMultipliers,
    startGame,
    handleCellClick,
    cashOut,
    resetGame,
    adjustBet,
    adjustBombs,
    calculateMultiplier
  } = useBazGame();

  const isMobile = useIsMobile();

  if (!profile) {
    return (
      <div className="px-4 py-6 text-center">
        <p className="text-white">Chargement du profil...</p>
      </div>
    );
  }

  // Version mobile (layout actuel)
  if (isMobile) {
    return (
      <div className="px-4 py-2">
        <GameBoard
          gameBoard={gameBoard}
          revealedCells={revealedCells}
          isPlaying={isPlaying}
          gameEnded={gameEnded}
          onCellClick={handleCellClick}
        />

        <GameStats
          isPlaying={isPlaying}
          gameEnded={gameEnded}
          bet={bet}
          revealedStars={revealedStars}
          bombs={bombs}
          nextMultipliers={nextMultipliers}
          calculateMultiplier={calculateMultiplier}
        />

        <GameControls
          bet={bet}
          bombs={bombs}
          isPlaying={isPlaying}
          isProcessing={isProcessing}
          maxBalance={profile.balance}
          onAdjustBet={adjustBet}
          onAdjustBombs={adjustBombs}
        />

        <ActionButtons
          isPlaying={isPlaying}
          gameEnded={gameEnded}
          won={won}
          isProcessing={isProcessing}
          bet={bet}
          maxBalance={profile.balance}
          potentialWin={potentialWin}
          revealedStars={revealedStars}
          onStartGame={startGame}
          onCashOut={cashOut}
          onResetGame={resetGame}
        />
      </div>
    );
  }

  // Version PC (nouveau layout)
  return (
    <div className="max-w-6xl mx-auto px-6 py-4">
      <div className="grid grid-cols-3 gap-6">
        {/* Colonne gauche - Contrôles */}
        <div className="space-y-4">
          <GameControls
            bet={bet}
            bombs={bombs}
            isPlaying={isPlaying}
            isProcessing={isProcessing}
            maxBalance={profile.balance}
            onAdjustBet={adjustBet}
            onAdjustBombs={adjustBombs}
            isDesktop={true}
          />
          
          <ActionButtons
            isPlaying={isPlaying}
            gameEnded={gameEnded}
            won={won}
            isProcessing={isProcessing}
            bet={bet}
            maxBalance={profile.balance}
            potentialWin={potentialWin}
            revealedStars={revealedStars}
            onStartGame={startGame}
            onCashOut={cashOut}
            onResetGame={resetGame}
            isDesktop={true}
          />
        </div>

        {/* Colonne centrale - Plateau de jeu */}
        <div className="flex justify-center">
          <GameBoard
            gameBoard={gameBoard}
            revealedCells={revealedCells}
            isPlaying={isPlaying}
            gameEnded={gameEnded}
            onCellClick={handleCellClick}
            isDesktop={true}
          />
        </div>

        {/* Colonne droite - Statistiques */}
        <div>
          <GameStats
            isPlaying={isPlaying}
            gameEnded={gameEnded}
            bet={bet}
            revealedStars={revealedStars}
            bombs={bombs}
            nextMultipliers={nextMultipliers}
            calculateMultiplier={calculateMultiplier}
            isDesktop={true}
          />
        </div>
      </div>
    </div>
  );
};
