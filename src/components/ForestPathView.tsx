import React from 'react';
import { renderColoredForestPath } from '../services/asciiArt';
import { SoundEngine } from '../services/sound';

interface ForestPathViewProps {
  onBackToOrchard: () => void;
  onBackToMarket?: () => void;
  fontScale?: number;
}

export const ForestPathView: React.FC<ForestPathViewProps> = ({
  onBackToOrchard,
  onBackToMarket,
  fontScale = 1,
}) => {
  const forestLines = renderColoredForestPath();

  return (
    <div className="w-full flex flex-col items-center select-none animate-fade-in pb-8">
      {/* Top Navigation Row */}
      <div className="w-full max-w-7xl flex items-center justify-between gap-2 px-2 py-1.5 mb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              SoundEngine.playRustle();
              onBackToOrchard();
            }}
            className="text-xs font-mono font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 active:scale-95 border border-stone-300 rounded px-2.5 py-1 shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
            title="Return to the orchard"
          >
            <span>⬅</span>
            <span>Back to Orchard</span>
          </button>

          {onBackToMarket && (
            <button
              onClick={() => {
                SoundEngine.playRustle();
                onBackToMarket();
              }}
              className="text-xs font-mono font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 active:scale-95 border border-amber-300 rounded px-2.5 py-1 shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
              title="Return to roadside market stand"
            >
              <span>🏪</span>
              <span>Roadside Stand</span>
            </button>
          )}
        </div>

        <div className="text-xs font-mono font-bold text-emerald-800 tracking-wider uppercase flex items-center gap-1.5">
          <span>🌲</span>
          <span>Forest Path</span>
        </div>
      </div>

      {/* Main ASCII Canvas for Forest Path */}
      <div className="w-full bg-[#f5f2eb] p-3 sm:p-5 overflow-x-auto ascii-scroll flex justify-center items-start border border-stone-200/80 rounded-lg shadow-inner">
        <div
          role="region"
          aria-label="Forest Path scene"
          className="select-none inline-block text-left"
        >
          <pre
            className="font-mono leading-none select-none m-0 p-0 text-stone-800 tracking-tight"
            style={{
              fontSize: `${0.85 * fontScale}rem`,
              lineHeight: `${0.95 * fontScale}rem`,
            }}
          >
            {forestLines.map((line, idx) => (
              <div key={idx} dangerouslySetInnerHTML={{ __html: line }} />
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
};
