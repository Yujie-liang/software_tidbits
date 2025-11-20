import React, { useState, useEffect } from 'react';
import { Capsule } from './Capsule';

interface GachaponMachineProps {
  onSpin: () => void;
  isProcessing: boolean;
  label?: string; // New prop for custom label
}

export const GachaponMachine: React.FC<GachaponMachineProps> = ({ onSpin, isProcessing, label = "ENGINEERING" }) => {
  const [knobRotation, setKnobRotation] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [droppedBall, setDroppedBall] = useState<boolean>(false);

  // Visual only balls inside the machine
  const [innerBalls] = useState(() => 
    Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      color: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'][i % 6],
      top: Math.random() * 50 + 40 + '%', // Bottom half
      left: Math.random() * 70 + 15 + '%',
      rotation: Math.random() * 360
    }))
  );

  const handleClick = () => {
    if (isProcessing) return;
    
    // Start animation sequence
    setShaking(true);
    setKnobRotation(prev => prev + 360);
    onSpin();

    // Stop shaking after 1s
    setTimeout(() => setShaking(false), 1000);

    // Drop ball animation triggers
    setTimeout(() => setDroppedBall(true), 1200);
    
    // Reset ball after it falls out "visually"
    setTimeout(() => setDroppedBall(false), 2500);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Machine Body */}
      <div className="relative w-72 h-[450px] md:w-80 md:h-[500px] z-10">
        
        {/* Top Dome (Glass) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full border-4 border-slate-200 bg-blue-50/30 overflow-hidden z-20 shadow-inner backdrop-blur-[1px]">
          {/* Highlight on glass */}
          <div className="absolute top-4 right-8 w-16 h-8 bg-white rounded-full opacity-40 rotate-[-20deg]" />
          
          {/* Balls Inside */}
          <div className={`relative w-full h-full transition-transform duration-100 ${shaking ? 'animate-wiggle' : ''}`}>
            {innerBalls.map((ball) => (
              <div 
                key={ball.id}
                className="absolute w-10 h-10 rounded-full shadow-md border border-black/10"
                style={{
                  backgroundColor: ball.color,
                  top: ball.top,
                  left: ball.left,
                  transform: `rotate(${ball.rotation}deg)`,
                  transition: 'all 0.5s ease-out'
                }}
              >
                 <div className="absolute w-full h-[1px] top-1/2 bg-black/10" />
                 <div className="absolute top-1 left-1 w-3 h-2 bg-white/40 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Main Body (Red Box) */}
        <div className="absolute bottom-0 w-full h-[280px] bg-red-500 rounded-3xl shadow-2xl border-b-8 border-red-700 flex flex-col items-center z-10">
          
          {/* Front Plate */}
          <div className="mt-2 w-11/12 h-full bg-red-500 rounded-2xl border-4 border-red-400/50 flex flex-col items-center pt-4 relative">
            
            {/* Plate Label */}
            <div className="bg-white px-4 py-1 rounded-full border-2 border-gray-200 shadow-sm mb-4 max-w-[80%]">
              <span className="text-xs font-bold tracking-widest text-red-500 uppercase truncate block">
                {label}
              </span>
            </div>

            {/* Knob Mechanism Area */}
            <div className="w-40 h-40 bg-gray-100 rounded-full border-8 border-gray-300 shadow-inner flex items-center justify-center mb-4 relative">
               
               {/* The Knob */}
               <button 
                  onClick={handleClick}
                  disabled={isProcessing}
                  className={`w-32 h-10 bg-gray-200 rounded-full absolute transition-transform duration-1000 ease-in-out cursor-pointer hover:bg-gray-100 active:scale-95 shadow-lg border-b-4 border-gray-400 flex items-center justify-center z-30 ${isProcessing ? 'cursor-not-allowed opacity-80' : ''}`}
                  style={{ transform: `rotate(${knobRotation}deg)` }}
               >
                  <div className="w-full h-2 bg-gray-300" />
                  <div className="absolute w-8 h-14 bg-white rounded-lg border-2 border-gray-300 shadow-md" />
               </button>

               {/* Arrow instruction */}
               {!isProcessing && (
                 <div className="absolute -bottom-8 text-gray-500 text-xs animate-pulse">
                   點擊旋轉
                 </div>
               )}
            </div>

            {/* Exit Hole */}
            <div className="absolute bottom-6 w-32 h-20 bg-gray-800 rounded-t-full rounded-b-lg shadow-inner border-t-4 border-gray-600 overflow-visible flex justify-center items-end">
               <div className="w-full h-4 bg-black/50" /> {/* Shadow inside */}
            </div>

          </div>
        </div>

        {/* Dropping Ball Animation */}
        <div 
          className={`absolute left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in ${
            droppedBall 
              ? 'opacity-100 bottom-4 scale-100 rotate-[360deg]' 
              : 'opacity-0 bottom-40 scale-50 rotate-0 pointer-events-none'
          }`}
        >
           <Capsule color="#F59E0B" className="w-16 h-16 shadow-2xl" />
        </div>
      </div>

      {/* Machine Legs */}
      <div className="flex justify-between w-64 -mt-4 z-0">
        <div className="w-4 h-8 bg-gray-400 rounded-b-lg" />
        <div className="w-4 h-8 bg-gray-400 rounded-b-lg" />
      </div>

    </div>
  );
};