import React from 'react';
import { Segment } from '../types';

interface ResultModalProps {
  winner: Segment | null;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ winner, onClose }) => {
  if (!winner) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl p-8 w-full max-w-sm text-center transform animate-bounce-in shadow-[0_0_50px_rgba(255,255,255,0.2)] border-4 relative"
        style={{ borderColor: winner.color }}
      >
        <h3 className="text-gray-500 font-bold uppercase tracking-wider mb-2 text-sm">Resultado</h3>
        
        <div className="text-6xl mb-4 animate-bounce">
          {winner.icon || '🎉'}
        </div>

        <div 
          className="text-4xl font-black mb-2 break-words leading-tight"
          style={{ color: winner.color }}
        >
          {winner.text}
        </div>

        {winner.description && (
          <div className="bg-gray-100 p-3 rounded-lg mb-6 border border-gray-200">
             <p className="text-gray-700 text-lg font-medium leading-snug">
               {winner.description}
             </p>
          </div>
        )}
        
        {!winner.description && <div className="w-full h-4"></div>}

        <button
          onClick={onClose}
          className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-lg active:scale-95"
        >
          GIRAR NOVAMENTE
        </button>
      </div>
    </div>
  );
};