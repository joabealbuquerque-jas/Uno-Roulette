import React, { useState } from 'react';
import { Segment } from '../types';
import { COLORS, MIN_SEGMENTS } from '../constants';

interface AdminPanelProps {
  segments: Segment[];
  onUpdateSegments: (segments: Segment[]) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ segments, onUpdateSegments, onClose }) => {
  const [tempSegments, setTempSegments] = useState<Segment[]>(JSON.parse(JSON.stringify(segments)));

  const handleTextChange = (id: string, newText: string) => {
    setTempSegments(prev => prev.map(s => s.id === id ? { ...s, text: newText } : s));
  };

  const handleIconChange = (id: string, newIcon: string) => {
    setTempSegments(prev => prev.map(s => s.id === id ? { ...s, icon: newIcon } : s));
  };

  const handleDescriptionChange = (id: string, newDesc: string) => {
    setTempSegments(prev => prev.map(s => s.id === id ? { ...s, description: newDesc } : s));
  };

  const handleColorChange = (id: string, newColor: string) => {
    setTempSegments(prev => prev.map(s => s.id === id ? { ...s, color: newColor } : s));
  };

  const handleDelete = (id: string) => {
    if (tempSegments.length <= MIN_SEGMENTS) {
      alert(`Mínimo de ${MIN_SEGMENTS} campos necessários.`);
      return;
    }
    setTempSegments(prev => prev.filter(s => s.id !== id));
  };

  const handleAdd = () => {
    const newId = Date.now().toString();
    // Cycle default colors
    const colors = Object.values(COLORS);
    const randomColor = colors[tempSegments.length % colors.length];
    
    setTempSegments([...tempSegments, { 
      id: newId, 
      text: 'Novo', 
      icon: '✨',
      description: 'Regra do novo campo',
      color: randomColor 
    }]);
  };

  const handleSave = () => {
    onUpdateSegments(tempSegments);
    onClose();
  };

  const colorOptions = Object.values(COLORS);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col p-4 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Admin da Roleta</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-20">
        {tempSegments.map((segment, index) => (
          <div key={segment.id} className="bg-gray-800 p-3 rounded-lg flex flex-col gap-3 border border-gray-700">
            <div className="flex items-center gap-2">
               <span className="text-gray-400 font-mono text-sm">#{index + 1}</span>
               
               {/* Color Picker */}
                <div className="flex gap-1 flex-wrap">
                  {colorOptions.map(c => (
                    <button
                      key={c}
                      onClick={() => handleColorChange(segment.id, c)}
                      className={`w-6 h-6 rounded-full border-2 ${segment.color === c ? 'border-white scale-110' : 'border-transparent opacity-50'}`}
                      style={{ backgroundColor: c }}
                      title={c === COLORS.BLACK ? "Curinga/Preto" : "Cor"}
                    />
                  ))}
                </div>
                
                <div className="flex-1"></div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(segment.id)}
                  disabled={tempSegments.length <= MIN_SEGMENTS}
                  className="p-2 text-red-400 disabled:opacity-30"
                >
                  🗑️
                </button>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <div className="w-16">
                        <label className="text-xs text-gray-500 uppercase">Emoji</label>
                        <input
                            type="text"
                            value={segment.icon || ''}
                            onChange={(e) => handleIconChange(segment.id, e.target.value)}
                            className="w-full bg-gray-700 text-white px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-center"
                            maxLength={2}
                            placeholder="🎨"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-gray-500 uppercase">Título (Na roda)</label>
                        <input
                        type="text"
                        value={segment.text}
                        onChange={(e) => handleTextChange(segment.id, e.target.value)}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        maxLength={15}
                        placeholder="Ex: Curinga"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-xs text-gray-500 uppercase">Descrição (Aparece no resultado)</label>
                    <input
                      type="text"
                      value={segment.description || ''}
                      onChange={(e) => handleDescriptionChange(segment.id, e.target.value)}
                      className="w-full bg-gray-700 text-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={80}
                      placeholder="Ex: Escolha a próxima cor do jogo."
                    />
                </div>
            </div>
          </div>
        ))}
        
        <button 
          onClick={handleAdd}
          className="w-full py-3 border-2 border-dashed border-gray-600 text-gray-400 rounded-lg hover:border-white hover:text-white transition-colors"
        >
          + Adicionar Campo
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900 border-t border-gray-800">
        <button
          onClick={handleSave}
          className="w-full bg-yellow-500 text-black font-black py-4 rounded-xl text-lg shadow-lg hover:bg-yellow-400 transition-transform active:scale-95"
        >
          SALVAR ALTERAÇÕES
        </button>
      </div>
    </div>
  );
};