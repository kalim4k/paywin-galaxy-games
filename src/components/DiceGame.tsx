import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Coins, Dices, Trophy, Frown, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGameBalance } from '@/hooks/useGameBalance';
import { useBetHistory } from '@/hooks/useBetHistory';

interface RealDieProps {
  value: number;
  rollTrigger: number;
  type: 'player' | 'ai';
}

const Real3DDie: React.FC<RealDieProps> = ({ value, rollTrigger, type }) => {
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
      1: { x: 0, y: 0 }, 6: { x: 180, y: 0 }, 2: { x: -90, y: 0 },
      5: { x: 90, y: 0 }, 3: { x: 0, y: -90 }, 4: { x: 0, y: 90 },
    };
    const target = targets[value] || { x: 0, y: 0 };
    const minSpins = 3; const maxSpins = 6;
    const spinX = (minSpins + Math.floor(Math.random() * (maxSpins - minSpins))) * 360;
    const spinY = (minSpins + Math.floor(Math.random() * (maxSpins - minSpins))) * 360;
    const currentX = xRotationRef.current;
    const currentY = yRotationRef.current;
    const deltaX = (target.x - (currentX % 360)) + spinX;
    const deltaY = (target.y - (currentY % 360)) + spinY;
    xRotationRef.current += deltaX;
    yRotationRef.current += deltaY;
    setTransformStyle(`rotateX(${xRotationRef.current}deg) rotateY(${yRotationRef.current}deg)`);
  }, [rollTrigger, value]);

  const isPlayer = type === 'player';
  const faceBaseClass = `absolute inset-0 border flex flex-wrap content-between p-[18%] backface-hidden rounded-xl shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]`;
  const faceColorClass = isPlayer ? "bg-gradient-to-br from-red-600/90 via-red-500/90 to-red-700/90 border-red-400/30 backdrop-blur-sm" : "bg-gradient-to-br from-slate-100 via-white to-slate-200 border-slate-300";
  const pipColorClass = isPlayer ? "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.3)]" : "bg-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)]";

  const renderPips = (idx: number) => {
    const pipMap: Record<number, number[]> = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
    const pips = pipMap[idx] || [];
    return (
      <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-0.5 pointer-events-none">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="flex items-center justify-center">
             {pips.includes(i) && <div className={`w-[85%] h-[85%] rounded-full ${pipColorClass}`}></div>}
          </div>
        ))}
      </div>
    );
  };
  const faceTransforms = [
    { id: 1, style: { transform: 'translateZ(40px)' } }, { id: 6, style: { transform: 'rotateY(180deg) translateZ(40px)' } },
    { id: 2, style: { transform: 'rotateX(90deg) translateZ(40px)' } }, { id: 5, style: { transform: 'rotateX(-90deg) translateZ(40px)' } },
    { id: 3, style: { transform: 'rotateY(90deg) translateZ(40px)' } }, { id: 4, style: { transform: 'rotateY(-90deg) translateZ(40px)' } },
  ];
  return (
    <div className="w-20 h-20 perspective-[800px] group">
       <div className="absolute top-1/2 left-1/2 w-[80%] h-[80%] bg-black/40 blur-lg rounded-full -translate-x-1/2 -translate-y-1/2 translate-z-[-60px] opacity-60 transition-all duration-300 group-hover:scale-110"></div>
       <div className="w-full h-full relative preserve-3d transition-transform ease-out-cubic" style={{ transformStyle: 'preserve-3d', transform: transformStyle, transitionDuration: '2000ms' }}>
          {faceTransforms.map(face => (<div key={face.id} className={`${faceBaseClass} ${faceColorClass}`} style={face.style}>{renderPips(face.id)}</div>))}
          {isPlayer && <div className="absolute inset-4 bg-red-900/50 blur-sm rounded-lg transform translate-z-0 pointer-events-none"></div>}
       </div>
    </div>
  );
};

export const DiceGame: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateBalance } = useGameBalance();
  const { addBetEntry } = useBetHistory();
  const balance = profile?.balance || 0;

  const [betAmount, setBetAmount] = useState<number>(200);
  const [isRolling, setIsRolling] = useState(false);
  const [playerDice, setPlayerDice] = useState<[number, number]>([1, 1]);
  const [aiDice, setAiDice] = useState<[number, number]>([1, 1]);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [rollTrigger, setRollTrigger] = useState(0);
  const [displayResult, setDisplayResult] = useState(false);
  const [snapshotBet, setSnapshotBet] = useState<number>(0);
  const [snapshotPayout, setSnapshotPayout] = useState<number>(0);

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

  const rollDice = async () => {
    if (isRolling || balance < betAmount || betAmount < 200) return;

    setIsRolling(true);
    setGameResult(null);
    setDisplayResult(false);
    setRollTrigger(prev => prev + 1);
    setSnapshotBet(betAmount);

    const multiplier = 1.96;
    const potentialWin = Math.floor(betAmount * multiplier);

    let forceWin = false;
    let forceLose = false;

    if (balance - betAmount + potentialWin >= 10000) {
        forceLose = true;
    } else if (balance < 1000) {
        forceWin = true;
    }

    let p1, p2, a1, a2;
    
    if (forceWin) {
        a1 = Math.floor(Math.random() * 3) + 1;
        a2 = Math.floor(Math.random() * 3) + 1;
        const aiSum = a1 + a2;
        const minPlayer = Math.min(12, aiSum + 1);
        const pSum = Math.floor(Math.random() * (12 - minPlayer + 1)) + minPlayer;
        const minD1 = Math.max(1, pSum - 6);
        const maxD1 = Math.min(6, pSum - 1);
        p1 = Math.floor(Math.random() * (maxD1 - minD1 + 1)) + minD1;
        p2 = pSum - p1;
    } else if (forceLose) {
        a1 = Math.floor(Math.random() * 3) + 4;
        a2 = Math.floor(Math.random() * 3) + 4;
        const aiSum = a1 + a2;
        const maxPlayer = Math.max(2, aiSum - 1);
        const pSum = Math.floor(Math.random() * (maxPlayer - 2 + 1)) + 2;
        const minD1 = Math.max(1, pSum - 6);
        const maxD1 = Math.min(6, pSum - 1);
        p1 = Math.floor(Math.random() * (maxD1 - minD1 + 1)) + minD1;
        p2 = pSum - p1;
    } else {
        p1 = Math.floor(Math.random() * 6) + 1;
        p2 = Math.floor(Math.random() * 6) + 1;
        a1 = Math.floor(Math.random() * 6) + 1;
        a2 = Math.floor(Math.random() * 6) + 1;
    }

    setPlayerDice([p1, p2]);
    setAiDice([a1, a2]);
    const pSum = p1 + p2;
    const aSum = a1 + a2;

    let result: 'win' | 'lose' | 'draw' = 'draw';
    if (pSum > aSum) result = 'win'; 
    else if (pSum < aSum) result = 'lose';

    setTimeout(async () => {
      setIsRolling(false);
      setDisplayResult(true);
      setGameResult(result);

      let payout = 0;
      if (result === 'win') {
        payout = potentialWin;
      } else if (result === 'draw') {
        payout = betAmount;
      }
      
      setSnapshotPayout(payout);

      const newBalance = balance - betAmount + payout;
      const transactionType = result === 'lose' ? 'game_loss' : 'game_win';
      const description = result === 'win' ? `Dice - Victoire x1.96` : result === 'draw' ? 'Dice - Égalité' : 'Dice - Défaite';
      
      await updateBalance(newBalance, transactionType, result === 'lose' ? betAmount : payout, description);
      await addBetEntry({ game_name: 'Dice', bet_amount: betAmount, result: result === 'lose' ? 'lose' : 'win', multiplier: result === 'win' ? 1.96 : result === 'draw' ? 1 : 0, win_amount: payout });
    }, 2000);
  };

  const pTotal = playerDice[0] + playerDice[1];
  const aTotal = aiDice[0] + aiDice[1];

  return (
    <div className="flex flex-col h-full animate-fade-in text-white relative overflow-hidden bg-[#130026]">
      <style>{`
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .ease-out-cubic { transition-timing-function: cubic-bezier(0.15, 0.45, 0.15, 1.05); }
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in { animation: bounce-in 0.5s ease-out; }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between p-4 z-10">
        <button onClick={() => navigate('/')} disabled={isRolling} className="p-2 bg-[#2d1b4e] rounded-xl text-white hover:bg-[#3c096c] transition-colors border border-[#4c1d95] disabled:opacity-50">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#2d1b4e] rounded-full border border-[#4c1d95]/50 shadow-lg">
           <Coins className="text-[#ff9f1c]" size={20} />
           <span className="font-mono font-bold text-lg">{balance.toLocaleString()} FCFA</span>
        </div>
      </div>

      {/* Game Arena */}
      <div className="flex-1 flex flex-col gap-4 relative px-4 max-w-lg mx-auto w-full">
        {/* Result Overlay */}
        {displayResult && gameResult && !isRolling && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
             <div className={`pointer-events-auto px-8 py-6 rounded-2xl border-2 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center gap-2 animate-bounce-in backdrop-blur-xl ${gameResult === 'win' ? 'bg-green-900/90 border-green-500' : gameResult === 'lose' ? 'bg-red-900/90 border-red-500' : 'bg-blue-900/90 border-blue-400'}`}>
                {gameResult === 'win' && <Trophy className="text-green-400 w-12 h-12" />}
                {gameResult === 'lose' && <Frown className="text-red-400 w-12 h-12" />}
                {gameResult === 'draw' && <Minus className="text-blue-400 w-12 h-12" />}
                <h2 className="text-3xl font-black uppercase text-white drop-shadow-md">{gameResult === 'win' ? 'GAGNÉ !' : gameResult === 'lose' ? 'PERDU' : 'ÉGALITÉ'}</h2>
                <p className="font-mono font-bold text-xl">
                    {gameResult === 'win' ? `+${snapshotPayout} FCFA` : gameResult === 'draw' ? `+${snapshotPayout} FCFA` : `-${snapshotBet} FCFA`}
                </p>
                <button onClick={() => setDisplayResult(false)} className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors border border-white/10">Fermer</button>
             </div>
          </div>
        )}

        <div className="flex-1 bg-[#1e1035] rounded-3xl border border-[#3c096c] relative flex flex-col items-center justify-center py-6 shadow-inner">
           <div className="absolute top-4 text-center"><span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-[#130026]/50 px-3 py-1 rounded-full backdrop-blur-sm">Ordinateur</span></div>
           <div className="flex gap-8 md:gap-12 perspective-[1000px]">
              <Real3DDie value={aiDice[0]} rollTrigger={rollTrigger} type="ai" />
              <Real3DDie value={aiDice[1]} rollTrigger={rollTrigger} type="ai" />
           </div>
           <div className="mt-6 flex items-center gap-2">
              <span className="text-slate-500 text-sm font-bold tracking-wider">TOTAL</span>
              <span className={`text-3xl font-mono font-black transition-all ${isRolling ? 'opacity-50 blur-sm' : 'opacity-100 text-white'}`}>{isRolling ? '?' : aTotal}</span>
           </div>
        </div>

        <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
           <div className="bg-[#ff9f1c] text-black font-black text-xl w-12 h-12 rounded-full flex items-center justify-center border-[4px] border-[#130026]">VS</div>
        </div>

        <div className="flex-1 bg-gradient-to-b from-[#2d1b4e] to-[#1e1035] rounded-3xl border border-[#4c1d95] relative flex flex-col items-center justify-center py-6 shadow-[0_0_40px_rgba(76,29,149,0.3)]">
           <div className="absolute top-4 text-center"><span className="text-xs font-bold text-[#ff9f1c] uppercase tracking-widest bg-[#ff9f1c]/10 px-3 py-1 rounded-full border border-[#ff9f1c]/20">Vous</span></div>
           <div className="flex gap-8 md:gap-12 perspective-[1000px]">
              <Real3DDie value={playerDice[0]} rollTrigger={rollTrigger} type="player" />
              <Real3DDie value={playerDice[1]} rollTrigger={rollTrigger} type="player" />
           </div>
           <div className="mt-6 flex items-center gap-2">
              <span className="text-slate-400 text-sm font-bold tracking-wider">TOTAL</span>
              <span className={`text-3xl font-mono font-black transition-all ${isRolling ? 'opacity-50 blur-sm' : 'opacity-100 text-[#ff9f1c]'}`}>{isRolling ? '?' : pTotal}</span>
           </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 w-full max-w-sm mx-auto mb-4 px-4 flex flex-col gap-3">
         <div className="bg-[#2d1b4e] p-2 rounded-xl border border-[#4c1d95] flex items-center justify-between">
            <button onClick={() => adjustBet('min')} className="text-xs font-bold text-[#9fa8da] px-2 hover:text-white">MIN</button>
            <button onClick={() => adjustBet('dec')} className="p-3 bg-[#3c096c] rounded-lg hover:bg-[#4c1d95] active:scale-95"><Minus size={16} /></button>
            <div className="flex flex-col items-center flex-1 mx-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Mise</span>
                <input 
                  type="number"
                  value={betAmount.toString()}
                  onChange={handleBetChange}
                  className="bg-transparent text-center font-mono font-bold text-xl w-full focus:outline-none text-white appearance-none"
                />
            </div>
            <button onClick={() => adjustBet('inc')} className="p-3 bg-[#3c096c] rounded-lg hover:bg-[#4c1d95] active:scale-95"><Plus size={16} /></button>
            <button onClick={() => adjustBet('max')} className="text-xs font-bold text-[#9fa8da] px-2 hover:text-white">MAX</button>
         </div>

         <button onClick={rollDice} disabled={isRolling || balance < betAmount || betAmount < 200} className="w-full bg-gradient-to-r from-[#ff9f1c] to-[#ff5400] hover:to-[#ff9f1c] text-white font-black text-xl py-4 rounded-2xl shadow-[0_10px_30px_rgba(255,159,28,0.3)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-wider border-t border-white/20 group">
             {isRolling ? <span className="animate-pulse">Calcul...</span> : <>LANCER <Dices size={24} className="group-hover:rotate-12 transition-transform" /></>}
         </button>
      </div>
    </div>
  );
};
