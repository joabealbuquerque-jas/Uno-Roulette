import React, { useEffect, useState } from 'react';

export const OpeningScreen: React.FC = () => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // O App.tsx remove este componente em 2500ms.
    // Iniciamos a animação de saída aos 1900ms para ter 600ms de efeito "flip".
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 1900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
      <style>
        {`
          @keyframes shuffle-left {
            0% { transform: translateX(0) rotate(-10deg); z-index: 10; }
            50% { transform: translateX(-60px) rotate(-20deg); z-index: 10; }
            100% { transform: translateX(0) rotate(0deg); z-index: 5; }
          }
          @keyframes shuffle-right {
            0% { transform: translateX(0) rotate(10deg); z-index: 10; }
            50% { transform: translateX(60px) rotate(20deg); z-index: 10; }
            100% { transform: translateX(0) rotate(0deg); z-index: 5; }
          }
          @keyframes fade-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes flip-out {
             0% { transform: scale(1) rotate(0deg); opacity: 1; }
             50% { opacity: 0.8; }
             100% { transform: scale(1.5) rotateY(180deg) rotate(10deg); opacity: 0; }
          }
          .card-uno {
            width: 80px;
            height: 120px;
            border-radius: 8px;
            border: 4px solid white;
            position: absolute;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            backface-visibility: hidden; /* Importante para o efeito de flip 3D */
          }
          .card-inner {
            width: 60%;
            height: 70%;
            background: white;
            transform: rotate(25deg);
            border-radius: 50%;
          }
          .animate-shuffle-l { animation: shuffle-left 0.8s ease-in-out infinite alternate; }
          .animate-shuffle-r { animation: shuffle-right 0.8s ease-in-out infinite alternate-reverse; }
          
          /* Classe de saída que substitui o shuffle */
          .animate-flip-exit { 
            animation: flip-out 0.6s cubic-bezier(0.45, 0, 0.55, 1) forwards; 
          }
        `}
      </style>

      {/* Adicionado perspective para o efeito 3D ficar realista */}
      <div className="relative w-40 h-40 flex items-center justify-center mb-8" style={{ perspective: '1000px' }}>
        {/* Cartas de fundo (Estáticas ou Flipando no final) */}
        <div className={`card-uno bg-yellow-500 transform -rotate-6 ${isExiting ? 'animate-flip-exit' : ''}`} style={{ animationDelay: isExiting ? '0ms' : '0ms' }}>
           <div className="card-inner"></div>
        </div>
        <div className={`card-uno bg-green-600 transform rotate-6 ${isExiting ? 'animate-flip-exit' : ''}`} style={{ animationDelay: isExiting ? '100ms' : '0ms' }}>
           <div className="card-inner"></div>
        </div>
        
        {/* Cartas Animadas (Shuffle ou Flip) */}
        <div className={`card-uno bg-red-600 ${isExiting ? 'animate-flip-exit' : 'animate-shuffle-l'}`} style={{ animationDelay: isExiting ? '50ms' : '0ms' }}>
            <span className="text-white font-black text-2xl z-10 drop-shadow-md italic absolute">UNO</span>
        </div>
        <div className={`card-uno bg-blue-600 ${isExiting ? 'animate-flip-exit' : 'animate-shuffle-r'}`} style={{ animationDelay: isExiting ? '150ms' : '0ms' }}>
            <span className="text-white font-black text-2xl z-10 drop-shadow-md italic absolute">UNO</span>
        </div>
      </div>

      <div className={`text-center ${isExiting ? 'opacity-0 transition-opacity duration-500' : 'animate-[fade-up_1s_ease-out_forwards]'}`}>
        <h1 className="text-yellow-500 font-black italic text-5xl tracking-tighter drop-shadow-lg mb-2">
          UNO
        </h1>
        <p className="text-white font-bold text-xl uppercase tracking-widest opacity-80">
          Roulette
        </p>
        <div className="mt-8 flex justify-center gap-2">
           <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
           <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
           <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
};