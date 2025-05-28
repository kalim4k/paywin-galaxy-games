import React, { useState, useEffect } from 'react';
import { Bomb, Star, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';
export const MineGame = () => {
  const [bet, setBet] = useState(200);
  const [bombs, setBombs] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameBoard, setGameBoard] = useState<('hidden' | 'star' | 'bomb')[]>(Array(25).fill('hidden'));
  const [revealedCells, setRevealedCells] = useState<boolean[]>(Array(25).fill(false));
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [gameEnded, setGameEnded] = useState(false);
  const [won, setWon] = useState(false);
  const [revealedStars, setRevealedStars] = useState(0);

  // Calculer le multiplicateur basé sur les bombes et les étoiles trouvées
  const calculateMultiplier = (starsFound: number, bombCount: number) => {
    const totalCells = 25;
    const safeCells = totalCells - bombCount;
    let multiplier = 1;
    for (let i = 0; i < starsFound; i++) {
      const remainingSafe = safeCells - i;
      const remainingTotal = totalCells - i;
      multiplier *= remainingTotal / remainingSafe;
    }
    return Math.max(1, Number(multiplier.toFixed(2)));
  };
  const initializeBoard = () => {
    const newBoard = Array(25).fill('star');
    const bombPositions = [];

    // Placer les bombes aléatoirement
    while (bombPositions.length < bombs) {
      const pos = Math.floor(Math.random() * 25);
      if (!bombPositions.includes(pos)) {
        bombPositions.push(pos);
        newBoard[pos] = 'bomb';
      }
    }
    setGameBoard(newBoard);
    setRevealedCells(Array(25).fill(false));
    setCurrentMultiplier(1);
    setGameEnded(false);
    setWon(false);
    setRevealedStars(0);
  };
  const startGame = () => {
    setIsPlaying(true);
    initializeBoard();
  };
  const handleCellClick = (index: number) => {
    if (!isPlaying || revealedCells[index] || gameEnded) return;
    const newRevealedCells = [...revealedCells];
    newRevealedCells[index] = true;
    setRevealedCells(newRevealedCells);
    if (gameBoard[index] === 'bomb') {
      // Révéler toutes les bombes
      const allRevealed = gameBoard.map((cell, i) => cell === 'bomb' || revealedCells[i]);
      setRevealedCells(allRevealed);
      setGameEnded(true);
      setWon(false);
    } else {
      const newStarsFound = revealedStars + 1;
      setRevealedStars(newStarsFound);
      const newMultiplier = calculateMultiplier(newStarsFound, bombs);
      setCurrentMultiplier(newMultiplier);
    }
  };
  const cashOut = () => {
    if (isPlaying && revealedStars > 0) {
      setGameEnded(true);
      setWon(true);
      setIsPlaying(false);
    }
  };
  const resetGame = () => {
    setIsPlaying(false);
    setGameBoard(Array(25).fill('hidden'));
    setRevealedCells(Array(25).fill(false));
    setCurrentMultiplier(1);
    setGameEnded(false);
    setWon(false);
    setRevealedStars(0);
  };
  const adjustBet = (amount: number) => {
    if (!isPlaying) {
      setBet(Math.max(200, bet + amount));
    }
  };
  const adjustBombs = (amount: number) => {
    if (!isPlaying) {
      setBombs(Math.max(1, Math.min(24, bombs + amount)));
    }
  };
  const potentialWin = bet * currentMultiplier;
  return <div className="px-4 py-6">
      {/* Header du jeu */}
      <div className="text-center mb-6">
        
        
      </div>

      {/* Solde actuel */}
      

      {/* Grille de jeu */}
      <div className="bg-gray-800/30 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-5 gap-2">
          {gameBoard.map((cell, index) => <button key={index} onClick={() => handleCellClick(index)} disabled={!isPlaying || revealedCells[index] || gameEnded} className={`
                aspect-square rounded-lg border-2 transition-all duration-200
                ${revealedCells[index] ? cell === 'bomb' ? 'bg-red-500 border-red-400' : 'bg-green-500 border-green-400' : 'bg-blue-500/70 border-blue-400 hover:bg-blue-400 active:scale-95'}
                ${!isPlaying || gameEnded ? 'opacity-50' : 'hover:border-white/50'}
                flex items-center justify-center
              `}>
              {revealedCells[index] && <>
                  {cell === 'bomb' ? <Bomb className="w-6 h-6 text-white" /> : <Star className="w-6 h-6 text-white fill-current" />}
                </>}
            </button>)}
        </div>
      </div>

      {/* Contrôles de jeu */}
      <div className="space-y-4">
        {/* Sélection du nombre de bombes */}
        <div className="bg-gray-800/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white text-sm font-medium">Bombes</span>
            <span className="text-yellow-400 text-sm">{bombs}</span>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => adjustBombs(-1)} disabled={isPlaying || bombs <= 1} className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-2 transition-colors">
              <Minus className="w-4 h-4 text-white" />
            </button>
            <div className="flex-1 bg-gray-700 rounded-lg h-2">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-lg transition-all" style={{
              width: `${bombs / 24 * 100}%`
            }} />
            </div>
            <button onClick={() => adjustBombs(1)} disabled={isPlaying || bombs >= 24} className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-2 transition-colors">
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Contrôle de mise */}
        <div className="bg-gray-800/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white text-sm font-medium">Mise</span>
            <span className="text-green-400 text-sm">{bet.toLocaleString()} FCFA</span>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => adjustBet(-100)} disabled={isPlaying} className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-3 transition-colors">
              <Minus className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1 text-center">
              <input type="number" value={bet} onChange={e => !isPlaying && setBet(Math.max(200, parseInt(e.target.value) || 200))} disabled={isPlaying} className="bg-gray-700 text-white text-center rounded-lg p-2 w-full disabled:opacity-50" min="200" />
            </div>
            <button onClick={() => adjustBet(100)} disabled={isPlaying} className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-3 transition-colors">
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="space-y-3">
          {!isPlaying ? <Button onClick={startGame} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 text-lg">
              Jouer
            </Button> : <div className="space-y-2">
              {revealedStars > 0 && !gameEnded && <Button onClick={cashOut} className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 text-lg">
                  Encaisser {potentialWin.toLocaleString()} FCFA
                </Button>}
            </div>}

          {gameEnded && <div className="space-y-3">
              <div className={`text-center p-4 rounded-xl ${won ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {won ? `Félicitations! Vous avez gagné ${potentialWin.toLocaleString()} FCFA!` : 'Boom! Vous avez touché une bombe!'}
              </div>
              <Button onClick={resetGame} className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 text-lg">
                Rejouer
              </Button>
            </div>}
        </div>
      </div>
    </div>;
};