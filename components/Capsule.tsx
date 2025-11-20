import React from 'react';

interface CapsuleProps {
  color: string;
  className?: string;
  rotation?: number;
}

export const Capsule: React.FC<CapsuleProps> = ({ color, className = '', rotation = 0 }) => {
  return (
    <div 
      className={`relative w-12 h-12 rounded-full shadow-inner border-2 border-black/10 flex items-center justify-center overflow-hidden ${className}`}
      style={{ 
        backgroundColor: color,
        transform: `rotate(${rotation}deg)`
      }}
    >
      {/* Shine effect */}
      <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full opacity-40 blur-[1px]" />
      
      {/* Capsule separation line */}
      <div className="absolute w-full h-[2px] bg-black/10 rotate-45 transform" />
      
      {/* Bottom half shading */}
      <div className="absolute bottom-0 w-full h-1/2 bg-black/10 pointer-events-none" />
    </div>
  );
};
