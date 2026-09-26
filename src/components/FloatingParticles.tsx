import React from 'react';
import { FloatingParticle } from '../types';

interface FloatingParticlesProps {
  particles: FloatingParticle[];
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({ particles }) => {
  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{ left: `${p.x}px`, top: `${p.y}px`, color: p.color }}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 font-mono font-bold select-none pointer-events-none transition-all duration-700 ${
            p.isCrit
              ? 'text-base sm:text-lg drop-shadow-md scale-110 font-extrabold'
              : 'text-xs sm:text-sm drop-shadow-xs'
          }`}
        >
          {p.text}
        </div>
      ))}
    </div>
  );
};
