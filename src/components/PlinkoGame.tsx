import React, { useState } from 'react';
import { ArrowLeft, Coins, Play, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGameBalance } from '@/hooks/useGameBalance';
import { useBetHistory } from '@/hooks/useBetHistory';

const MULTIPLIERS = [
  { val: 13, color: 'bg-green-600 shadow-green-600/50' },
  { val: 3, color: 'bg-lime-500 shadow-lime-500/50' },
  { val: 1.3, color: 'bg-yellow-500 shadow-yellow-500/50' },
  { val: 0.7, color: 'bg-orange-500 shadow-orange-500/50' },
  { val: 0.4, color: 'bg-red-500 shadow-red-500/50' }, 
  { val: 0.7, color: 'bg-orange-500 shadow-orange-500/50' },
  { val: 1.3, color: 'bg-yellow-500 shadow-yellow-500/50' },
  { val: 3, color: 'bg-lime-500 shadow-lime-500/50' },
  { val: 13, color: 'bg-green-600 shadow-green-600/50' },
];

const ROWS = 8;
const PEG_SPACING_X = 30;
const PEG_SPACING_Y = 25;
const ANIMATION_DURATION = 3000;

export const PlinkoGame: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateBalance } = useGameBalance();
  const { addBetEntry } = useBetHistory();
  const balance = profile?.balance || 0;

  const [betAmount, setBetAmount] = useState<number>(200);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastNetResult, setLastNetResult] = useState<number | null>(null);
  const [showWin, setShowWin] = useState(false);
  const [dynamicStyles, setDynamicStyles] = useState<string>('');
  const [activeMultiplier, setActiveMultiplier] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [winType, setWinType] = useState<'win' | 'lose' | null>(null);

  const getMultiplierColor = (val: number) => {
    const match = MULTIPLIERS.find(m => m.val === val);
    return match ? match.color.split(' ')[0] : 'bg-slate-500';
  };

  const adjustBet = (action: 'min' | 'max' | 'inc' | 'dec') => {
    if (isPlaying) return;
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

  const spawnBall = async () => {
    if (isPlaying || balance < betAmount || betAmount < 200) return;
    
    setIsPlaying(true);
    setShowWin(false);
    setActiveMultiplier(null);
    setWinType(null);

    let targetBucketIndex;
    const potentialMaxWin = betAmount * 13;
    const forceLoss = (balance - betAmount + potentialMaxWin >= 10000);
    const forceWin = (balance < 1000);

    if (forceLoss) {
      targetBucketIndex = Math.random() < 0.5 ? 4 : (Math.random() < 0.5 ? 3 : 5);
    } else if (forceWin) {
      targetBucketIndex = Math.random() < 0.5 ? 2 : 6;
    } else {
      const rand = Math.random();
      if (rand < 0.34) targetBucketIndex = 4;
      else if (rand < 0.60) targetBucketIndex = Math.random() < 0.5 ? 3 : 5;
      else if (rand < 0.80) targetBucketIndex = Math.random() < 0.5 ? 2 : 6;
      else if (rand < 0.94) targetBucketIndex = Math.random() < 0.5 ? 1 : 7;
      else targetBucketIndex = Math.random() < 0.5 ? 0 : 8;
      
      const chosenMult = MULTIPLIERS[targetBucketIndex].val;
      if (balance - betAmount + (betAmount * chosenMult) >= 10000) {
        targetBucketIndex = 4; 
      }
    }
    
    const directions: number[] = [];
    let rightsNeeded = targetBucketIndex;
    let stepsRemaining = ROWS;
    
    for (let i = 0; i < ROWS; i++) {
      let goRight: boolean;
      if (rightsNeeded === stepsRemaining) {
        goRight = true;
      } else if (rightsNeeded === 0) {
        goRight = false;
      } else {
        goRight = Math.random() > 0.5;
      }
      
      if (goRight) rightsNeeded--;
      stepsRemaining--;
      directions.push(goRight ? 1 : 0);
    }

    const path: {x: number, y: number}[] = [];
    let currentX = 0;
    let currentY = 0;
    let bucketIndex = 0;
    path.push({ x: 0, y: 0 });

    for (let row = 0; row < ROWS; row++) {
      const goRight = directions[row] === 1;
      bucketIndex += goRight ? 1 : 0;
      const dir = goRight ? 1 : -1;
      const jitter = (Math.random() - 0.5) * 8; 
      currentX += (dir * (PEG_SPACING_X / 2)) + jitter;
      currentY += PEG_SPACING_Y;
      path.push({ x: currentX, y: currentY });
    }

    let keyframes = '@keyframes dropBall {';
    const steps = path.length;
    path.forEach((point, index) => {
      const percentage = Math.round((index / (steps - 1)) * 100);
      keyframes += `
        ${percentage}% { 
          transform: translate(${point.x}px, ${point.y + 50}px) rotate(${index * 45}deg);
          animation-timing-function: cubic-bezier(0.5, 0.05, 1, 0.5); 
        }
      `;
    });
    keyframes += '}';
    setDynamicStyles(keyframes);

    setTimeout(async () => {
      const result = MULTIPLIERS[bucketIndex];
      const grossPayout = Math.floor(betAmount * result.val);
      const netProfit = grossPayout - betAmount;
      
      setActiveMultiplier(bucketIndex);
      setTimeout(() => setActiveMultiplier(null), 400);

      setLastNetResult(netProfit);
      const isNetWin = netProfit >= 0;
      setWinType(isNetWin ? 'win' : 'lose');
      setShowWin(true);
      setHistory(prev => [result.val, ...prev].slice(0, 5));

      const newBalance = balance + netProfit;
      const transactionType = isNetWin ? 'game_win' : 'game_loss';
      const description = isNetWin ? `Plinko - Gain x${result.val}` : 'Plinko - Perte';
      
      await updateBalance(newBalance, transactionType, isNetWin ? grossPayout : betAmount, description);
      await addBetEntry({ 
        game_name: 'Plinko', 
        bet_amount: betAmount, 
        result: isNetWin ? 'win' : 'lose', 
        multiplier: result.val, 
        win_amount: grossPayout 
      });

      setTimeout(() => setShowWin(false), 2000);
      setIsPlaying(false);
      setDynamicStyles('');
    }, ANIMATION_DURATION);
  };

  const renderPegs = () => {
    const pegs = [];
    for (let row = 0; row < ROWS; row++) {
      const numPegs = row + 3; 
      for (let i = 0; i < numPegs; i++) {
        const rowWidth = (numPegs - 1) * PEG_SPACING_X;
        const x = (i * PEG_SPACING_X) - (rowWidth / 2);
        const y = row * PEG_SPACING_Y;
        pegs.push(
          <div
            key={`${row}-${i}`}
            className="absolute w-2.5 h-2.5 bg-gradient-to-br from-slate-300 to-slate-500 rounded-full shadow-lg"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `${y + 60}px`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        );
      }
    }
    return pegs;
  };

  return (
    <div className="flex flex-col h-full animate-fade-in text-white relative overflow-hidden bg-[#130026]">
      <style>{dynamicStyles}</style>

      {/* Header */}
      <div className="flex items-center justify-between p-4 z-10">
        <button onClick={() => navigate('/')} disabled={isPlaying} className="p-2 bg-[#2d1b4e] rounded-xl text-white hover:bg-[#3c096c] transition-colors border border-[#4c1d95] disabled:opacity-50">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#2d1b4e] rounded-full border border-[#4c1d95]/50 shadow-lg">
          <Coins className="text-[#ff9f1c]" size={20} />
          <span className="font-mono font-bold text-lg">{balance.toLocaleString()} FCFA</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative px-4">
        {/* Win Notification */}
        <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-30 transition-all duration-500 ${showWin ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
          <div className={`px-6 py-3 rounded-2xl backdrop-blur-xl border-2 ${winType === 'win' ? 'bg-green-900/90 border-green-500' : 'bg-red-900/90 border-red-500'}`}>
            <span className={`font-mono font-bold text-2xl ${winType === 'win' ? 'text-green-400' : 'text-red-400'}`}>
              {lastNetResult && lastNetResult > 0 ? '+' : ''}{lastNetResult} FCFA
            </span>
          </div>
        </div>

        {/* Game Board */}
        <div className="relative w-full max-w-sm bg-gradient-to-b from-[#1e1035] to-[#130026] rounded-3xl border border-[#3c096c] shadow-[0_0_60px_rgba(76,29,149,0.3)] overflow-hidden" style={{ height: `${(ROWS - 1) * PEG_SPACING_Y + 140}px` }}>
          
          {/* Ball */}
          <div 
            className="absolute left-1/2 top-0 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-[0_0_20px_rgba(255,159,28,0.8)] z-20"
            style={{
              transform: 'translate(-50%, 10px)',
              animation: isPlaying ? `dropBall ${ANIMATION_DURATION}ms ease-out forwards` : 'none'
            }}
          />

          {/* Pegs */}
          {renderPegs()}

          {/* Buckets - positioned just below where pegs end */}
          <div className="absolute left-1/2 -translate-x-1/2 flex gap-1" style={{ top: `${(ROWS - 1) * PEG_SPACING_Y + 80}px` }}>
            {MULTIPLIERS.map((m, idx) => (
              <div
                key={idx}
                className={`w-8 h-10 rounded-lg flex items-center justify-center text-[10px] font-black transition-all duration-200 ${m.color} ${activeMultiplier === idx ? 'scale-125 shadow-lg' : 'shadow-md'}`}
              >
                {m.val}x
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 w-full max-w-sm mx-auto mb-4 px-4 flex flex-col gap-3">
        {history.length > 0 && (
          <div className="flex justify-center gap-2 mb-2">
            {history.map((val, idx) => (
              <div key={idx} className={`px-2 py-1 rounded-lg text-xs font-bold ${getMultiplierColor(val)} text-white`}>
                {val}x
              </div>
            ))}
          </div>
        )}

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
              className="bg-transparent text-center font-mono font-bold text-xl w-full focus:outline-none text-white appearance-none"
            />
          </div>
          <button onClick={() => adjustBet('inc')} className="p-3 bg-[#3c096c] rounded-lg hover:bg-[#4c1d95] active:scale-95">
            <Plus size={16} />
          </button>
          <button onClick={() => adjustBet('max')} className="text-xs font-bold text-[#9fa8da] px-2 hover:text-white">MAX</button>
        </div>

        <button 
          onClick={spawnBall} 
          disabled={isPlaying || balance < betAmount || betAmount < 200} 
          className="w-full bg-gradient-to-r from-[#ff9f1c] to-[#ff5400] hover:to-[#ff9f1c] text-white font-black text-xl py-4 rounded-2xl shadow-[0_10px_30px_rgba(255,159,28,0.3)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-wider border-t border-white/20 group"
        >
          {isPlaying ? <span className="animate-pulse">En cours...</span> : <>JOUER <Play size={24} className="group-hover:scale-110 transition-transform" /></>}
        </button>
      </div>
    </div>
  );
};
