import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { Wheel } from './components/Wheel';
import { AdminPanel } from './components/AdminPanel';
import { ResultModal } from './components/ResultModal';
import { Scoreboard } from './components/Scoreboard';
import { OpeningScreen } from './components/OpeningScreen';
import { Segment, WheelState, Player } from './types';
import { DEFAULT_SEGMENTS } from './constants';
import { soundManager } from './utils/audio';

// Chaves do LocalStorage
const STORAGE_KEY_SEGMENTS = 'uno_roulette_segments_v1';
const STORAGE_KEY_PLAYERS = 'uno_roulette_players_v1';

const App: React.FC = () => {
  // --- Loading State ---
  const [isLoading, setIsLoading] = useState(true);

  // --- Data State (with Persistence) ---
  const [segments, setSegments] = useState<Segment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SEGMENTS);
      return saved ? JSON.parse(saved) : DEFAULT_SEGMENTS;
    } catch (e) {
      console.error("Erro ao carregar segmentos salvos", e);
      return DEFAULT_SEGMENTS;
    }
  });

  const [players, setPlayers] = useState<Player[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLAYERS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Erro ao carregar jogadores salvos", e);
      return [];
    }
  });

  // --- UI State ---
  const [showAdmin, setShowAdmin] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [size, setSize] = useState(300);
  
  const [wheelState, setWheelState] = useState<WheelState>({
    isSpinning: false,
    rotation: 0,
    winner: null,
  });

  // --- Effects ---

  // Intro Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 segundos de animação
    return () => clearTimeout(timer);
  }, []);

  // Save Segments when changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SEGMENTS, JSON.stringify(segments));
    } catch (e) {
      console.error("Erro ao salvar segmentos", e);
    }
  }, [segments]);

  // Save Players when changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PLAYERS, JSON.stringify(players));
    } catch (e) {
      console.error("Erro ao salvar jogadores", e);
    }
  }, [players]);

  // Resize Listener
  useEffect(() => {
    const handleResize = () => {
      const minDim = Math.min(window.innerWidth, window.innerHeight);
      setSize(minDim * 0.85); // 85% of shortest screen dimension
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Logic ---

  // Calculate Leader
  const leader = useMemo(() => {
    if (players.length === 0) return null;
    // Sort logic same as scoreboard
    return [...players].sort((a, b) => b.score - a.score)[0];
  }, [players]);

  const spinWheel = useCallback(() => {
    if (wheelState.isSpinning) return;

    // Reset winner
    setWheelState(prev => ({ ...prev, winner: null }));

    // Start Sound
    // Duration matches CSS transition (4000ms)
    soundManager.playSpinSound(4000);

    // Random spin calculation
    // Minimum 5 full rotations (360 * 5) + random angle
    const minRotations = 5;
    const randomDegree = Math.floor(Math.random() * 360);
    const newRotation = wheelState.rotation + (360 * minRotations) + randomDegree;

    setWheelState(prev => ({
      ...prev,
      isSpinning: true,
      rotation: newRotation,
    }));
  }, [wheelState.isSpinning, wheelState.rotation]);

  const handleTransitionEnd = useCallback(() => {
    // IMPORTANT: Only process result if we were actually spinning.
    if (!wheelState.isSpinning) return;

    // Play Win Sound
    soundManager.playWin();

    // 1. Calculate effective angle (0-360)
    const finalRotation = wheelState.rotation % 360;
    
    // In CSS rotation (clockwise), the value increases. 
    // The top pointer is fixed at 0 degrees.
    const pointerAngleDeg = (360 - finalRotation) % 360;
    
    // Convert to Radians for D3 comparison
    const pointerRad = (pointerAngleDeg * Math.PI) / 180;

    // 2. Find segment using exact D3 logic
    const pieGenerator = d3.pie<Segment>().sort(null).value(() => 1);
    const pieData = pieGenerator(segments);
    
    // Find the arc that contains the pointer angle
    const winningSlice = pieData.find(slice => {
        return pointerRad >= slice.startAngle && pointerRad < slice.endAngle;
    });

    // Fallback if exactly on 360/0 boundary
    const winner = winningSlice ? winningSlice.data : segments[0];

    setWheelState(prev => ({
      ...prev,
      isSpinning: false,
      winner: winner,
    }));
  }, [segments, wheelState.rotation, wheelState.isSpinning]);

  const toggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  if (isLoading) {
    return <OpeningScreen />;
  }

  return (
    // Alterado de overflow-hidden para overflow-x-hidden para permitir scroll vertical (parallax)
    // O background foi movido para uma div separada com position fixed
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col relative animate-fade-in">
      <style>
        {`
          @keyframes breathe {
             0%, 100% { opacity: 0.8; border-color: rgba(255,255,255,0.1); }
             50% { opacity: 1; border-color: rgba(255,255,255,0.3); }
          }
          .ad-breathing {
            animation: breathe 4s ease-in-out infinite;
          }
        `}
      </style>

      {/* Camada de Background Parallax (Fixo) */}
      <div className="fixed inset-0 bg-gradient-to-br from-red-900 via-gray-900 to-black -z-10" />
      
      {/* Header */}
      <header className="absolute top-0 w-full p-4 flex justify-between items-center z-10">
        <h1 className="text-yellow-500 font-black italic text-2xl md:text-3xl drop-shadow-md tracking-tighter">
          UNO<span className="text-white not-italic font-bold text-lg ml-1">Roulette</span>
        </h1>
        
        <div className="flex items-center gap-2">
          {/* Scoreboard Button */}
          <button 
            onClick={() => setShowScoreboard(true)}
            className="bg-yellow-500/90 w-10 h-10 rounded-full border border-yellow-300 text-black shadow-lg hover:bg-yellow-400 transition-colors flex items-center justify-center relative"
            aria-label="Placar"
          >
            🏆
            {players.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-black">
                {players.length}
              </span>
            )}
          </button>

          <button 
            onClick={toggleMute}
            className="bg-gray-800/80 w-10 h-10 rounded-full border border-gray-600 text-white hover:bg-gray-700 transition-colors flex items-center justify-center"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          
          <button 
            onClick={() => setShowAdmin(true)}
            className="bg-gray-800/80 w-10 h-10 rounded-full border border-gray-600 text-white hover:bg-gray-700 transition-colors flex items-center justify-center"
            aria-label="Admin Settings"
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-0">
        <div className="relative mt-8">
          <Wheel 
            segments={segments}
            rotation={wheelState.rotation}
            onTransitionEnd={handleTransitionEnd}
            size={size}
            isSpinning={wheelState.isSpinning}
            winner={wheelState.winner}
          />
        </div>
      </main>

      {/* Footer Controls & Ads */}
      <div className="w-full p-6 pb-10 z-20 flex flex-col items-center justify-end gap-4">
        
        {/* Leader Display (Visible if players exist) */}
        {leader && (
          <div className="flex items-center gap-2 mb-1 animate-fade-in bg-black/60 backdrop-blur-md border border-yellow-500/30 px-5 py-2 rounded-full shadow-lg shadow-yellow-900/20 max-w-[90%]">
            <span className="text-2xl filter drop-shadow-md animate-pulse">👑</span>
            <div className="flex flex-col items-start leading-none truncate">
              <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">Líder</span>
              <span className="text-white font-bold text-lg truncate max-w-[150px]">{leader.name}</span>
            </div>
            <div className="ml-2 bg-yellow-500 text-black font-black text-sm w-8 h-8 flex flex-shrink-0 items-center justify-center rounded-full border-2 border-yellow-300 shadow-sm">
              {leader.score}
            </div>
          </div>
        )}

        {/* Spin Button */}
        <button
          onClick={spinWheel}
          disabled={wheelState.isSpinning}
          className={`
            w-full max-w-xs h-20 rounded-2xl text-2xl font-black uppercase tracking-widest shadow-xl transform transition-all
            flex items-center justify-center gap-3
            ${wheelState.isSpinning 
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed scale-95 border-2 border-gray-600' 
              : 'bg-green-500 text-white hover:bg-green-400 active:scale-95 active:shadow-none shadow-green-900/50 hover:shadow-green-400/20'
            }
          `}
        >
          {wheelState.isSpinning ? (
            <>
              <svg className="animate-spin h-8 w-8 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-xl">GIRANDO...</span>
            </>
          ) : (
            'GIRAR!'
          )}
        </button>

        {/* Ad Space (Moved below button) */}
        <div className="w-full max-w-[320px] min-h-[50px] bg-black/40 border border-white/5 rounded-lg flex items-center justify-center overflow-hidden backdrop-blur-sm ad-breathing transition-all duration-300 hover:scale-105 hover:bg-black/60 hover:shadow-lg cursor-pointer group">
           {/* Replace this span with your Google Ads script/container */}
           <span className="text-gray-600 text-[10px] font-mono uppercase tracking-widest group-hover:text-gray-400 transition-colors">Publicidade</span>
        </div>

      </div>

      {/* Modals */}
      {showAdmin && (
        <AdminPanel 
          segments={segments}
          onUpdateSegments={setSegments}
          onClose={() => setShowAdmin(false)}
        />
      )}

      {showScoreboard && (
        <Scoreboard 
          players={players}
          onUpdatePlayers={setPlayers}
          onClose={() => setShowScoreboard(false)}
        />
      )}

      <ResultModal 
        winner={wheelState.winner}
        onClose={() => setWheelState(prev => ({ ...prev, winner: null }))}
      />
    </div>
  );
};

export default App;