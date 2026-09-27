import React, { useState, useEffect } from 'react';
import { renderColoredLivingRoom } from '../services/asciiArt';
import { SoundEngine } from '../services/sound';

interface LivingRoomViewProps {
  onBackToFarmhouse: () => void;
  onBackToOrchard?: () => void;
  fontScale?: number;
}

export const LivingRoomView: React.FC<LivingRoomViewProps> = ({
  onBackToFarmhouse,
  onBackToOrchard,
  fontScale = 1,
}) => {
  const [flameFrame, setFlameFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFlameFrame((prev) => (prev + 1) % 4);
    }, 220);
    return () => clearInterval(timer);
  }, []);

  const roomLines = renderColoredLivingRoom(flameFrame);

  const handleRoomClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-kitchen]') || target.getAttribute('data-kitchen') === 'true') {
      SoundEngine.playRustle();
      onBackToFarmhouse();
      return;
    }
    if (target.closest('[data-window]') || target.getAttribute('data-window') === 'true') {
      SoundEngine.playRustle();
      onBackToOrchard?.();
      return;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target as HTMLElement;
      if (target.closest('[data-kitchen]') || target.getAttribute('data-kitchen') === 'true') {
        e.preventDefault();
        SoundEngine.playRustle();
        onBackToFarmhouse();
      } else if (target.closest('[data-window]') || target.getAttribute('data-window') === 'true') {
        e.preventDefault();
        SoundEngine.playRustle();
        onBackToOrchard?.();
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none animate-fade-in pb-8">
      {/* Top Navigation Row */}
      <div className="w-full max-w-7xl flex items-center justify-between gap-2 px-2 py-1.5 mb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              SoundEngine.playRustle();
              onBackToFarmhouse();
            }}
            className="text-xs font-mono font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 active:scale-95 border border-stone-300 rounded px-2.5 py-1 shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
            title="Return to the kitchen / farmhouse"
          >
            <span>⬅</span>
            <span>Back to Farmhouse</span>
          </button>

          {onBackToOrchard && (
            <button
              onClick={() => {
                SoundEngine.playRustle();
                onBackToOrchard();
              }}
              className="text-xs font-mono font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 active:scale-95 border border-amber-300 rounded px-2.5 py-1 shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
              title="Return to the orchard"
            >
              <span>🍎</span>
              <span>Orchard</span>
            </button>
          )}
        </div>

        <div className="text-xs font-mono font-bold text-stone-600 tracking-wider uppercase">
          Living Room
        </div>
      </div>

      {/* Main ASCII Canvas for Living Room */}
      <div className="w-full bg-[#f5f2eb] p-3 sm:p-5 overflow-x-auto ascii-scroll flex justify-center items-start border border-stone-200/80 rounded-lg shadow-inner">
        <div
          role="region"
          aria-label="Farmhouse Living Room scene"
          onClick={handleRoomClick}
          onKeyDown={handleKeyDown}
          className="select-none inline-block text-left"
        >
          <pre
            className="font-mono leading-none select-none m-0 p-0 text-stone-800 tracking-normal"
            style={{
              fontSize: `${0.85 * fontScale}rem`,
              lineHeight: `${0.95 * fontScale}rem`,
            }}
          >
            {roomLines.map((line, idx) => (
              <div key={idx} dangerouslySetInnerHTML={{ __html: line }} />
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
};
