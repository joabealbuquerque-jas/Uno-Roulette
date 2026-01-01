import React, { useState } from 'react';
import { Player } from '../types';

interface ScoreboardProps {
  players: Player[];
  onUpdatePlayers: (players: Player[]) => void;
  onClose: () => void;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ players, onUpdatePlayers, onClose }) => {
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleAddPlayer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newPlayerName.trim()) return;

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newPlayerName.trim(),
      score: 0,
    };

    onUpdatePlayers([...players, newPlayer]);
    setNewPlayerName('');
  };

  const updateScore = (id: string, delta: number) => {
    const updated = players.map(p => 
      p.id === id ? { ...p, score: p.score + delta } : p
    );
    onUpdatePlayers(updated);
  };

  const removePlayer = (id: string) => {
    // Immediate removal as requested
    onUpdatePlayers(players.filter(p => p.id !== id));
  };

  // Sort by score descending (Highest first)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const highestScore = sortedPlayers.length > 0 ? sortedPlayers[0].score : 0;
  const lowestScore = sortedPlayers.length > 0 ? sortedPlayers[sortedPlayers.length - 1].score : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col p-4 animate-fade-in">
      <style>
        {`
          @keyframes glow-gold {
            0%, 100% { box-shadow: 0 0 10px rgba(250, 204, 21, 0.3); transform: scale(1); }
            50% { box-shadow: 0 0 25px rgba(250, 204, 21, 0.6); transform: scale(1.02); }
          }
          @keyframes glow-red {
            0%, 100% { box-shadow: 0 0 5px rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.5); }
            50% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.4); border-color: rgba(239, 68, 68, 1); }
          }
          .animate-leader { animation: glow-gold 2s ease-in-out infinite; z-index: 10; }
          .animate-last { animation: glow-red 2s ease-in-out infinite; }
        `}
      </style>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>🏆</span> Placar
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-xl p-2">
          ✕
        </button>
      </div>

      {/* Add Player Form */}
      <form onSubmit={handleAddPlayer} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          placeholder="Nome do jogador..."
          className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-yellow-500"
          maxLength={12}
        />
        <button 
          type="submit"
          className="bg-green-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-500 transition-colors"
        >
          +
        </button>
      </form>

      {/* Players List */}
      <div className="flex-1 overflow-y-auto space-y-5 pb-4 px-1">
        {sortedPlayers.length === 0 && (
          <div className="text-center text-gray-500 mt-10 italic">
            Nenhum jogador adicionado ainda.
          </div>
        )}

        {sortedPlayers.map((player, index) => {
          const isLeader = players.length > 1 && player.score === highestScore;
          const isLast = players.length > 1 && player.score === lowestScore;

          return (
            <div 
              key={player.id} 
              className={`
                relative flex items-center justify-between p-4 rounded-xl shadow-lg transition-all duration-300
                ${isLeader 
                  ? 'bg-gradient-to-r from-gray-800 to-yellow-900/30 border-4 border-yellow-400 animate-leader' 
                  : isLast 
                    ? 'bg-gray-800 border-l-4 border-red-500 animate-last' 
                    : 'bg-gray-800 border-l-4 border-gray-600'}
              `}
            >
              {/* Leader Crown Absolute Position */}
              {isLeader && (
                <div className="absolute -top-4 -left-3 text-3xl filter drop-shadow-md rotate-[-15deg] z-20">
                  👑
                </div>
              )}

              <div className="flex items-center gap-3 pl-2">
                <span className={`font-mono text-lg font-bold w-6 ${isLeader ? 'text-yellow-400' : 'text-gray-500'}`}>
                  {index + 1}
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-lg leading-none ${isLeader ? 'text-yellow-100' : 'text-white'}`}>
                        {player.name}
                    </span>
                    {isLast && <span className="text-lg">💀</span>}
                  </div>
                  <span className="text-xs text-gray-400 uppercase mt-1">Pontos</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => updateScore(player.id, -10)}
                  className="w-8 h-8 rounded-lg bg-red-900/50 text-red-400 border border-red-800 hover:bg-red-800 active:scale-95 flex items-center justify-center font-bold"
                >
                  -10
                </button>
                <button 
                  onClick={() => updateScore(player.id, -1)}
                  className="w-8 h-8 rounded-lg bg-gray-700 text-white hover:bg-gray-600 active:scale-95 flex items-center justify-center"
                >
                  -
                </button>
                
                <span className={`w-12 text-center font-mono text-2xl font-black ${isLeader ? 'text-yellow-400' : 'text-white'}`}>
                  {player.score}
                </span>
                
                <button 
                  onClick={() => updateScore(player.id, 1)}
                  className="w-8 h-8 rounded-lg bg-gray-700 text-white hover:bg-gray-600 active:scale-95 flex items-center justify-center"
                >
                  +
                </button>
                 <button 
                  onClick={() => updateScore(player.id, 10)}
                  className="w-8 h-8 rounded-lg bg-green-900/50 text-green-400 border border-green-800 hover:bg-green-800 active:scale-95 flex items-center justify-center font-bold"
                >
                  +10
                </button>
              </div>

              <button 
                onClick={() => removePlayer(player.id)}
                className="absolute -top-2 -right-2 bg-gray-900 text-red-400 hover:bg-red-900 hover:text-white rounded-full p-1.5 border border-gray-700 shadow-md transition-colors z-20"
                aria-label="Remove player"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="pt-4 border-t border-gray-800 text-center text-gray-500 text-xs">
        {players.length > 0 ? `${players.length} jogadores na partida` : 'Adicione jogadores para começar'}
      </div>
    </div>
  );
};