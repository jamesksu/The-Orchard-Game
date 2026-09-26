import React, { useState } from 'react';
import { renderColoredTractorMan } from '../services/asciiArt';
import { SoundEngine } from '../services/sound';
import { ArrowLeft, Store, Volume2 } from 'lucide-react';

interface TractorManViewProps {
  onBackToMarket: () => void;
  onBackToOrchard: () => void;
}

const TRACTORMAN_QUOTES = [
  "Mornin'! The crow tipped me off that you'd be wanderin' back this way.",
  "That roadside stand of yours has quite a buzz goin' down the highway. $100 in fruit is quite a fine start!",
  "She’s an old two-cylinder diesel. Purrs like a lion when the morning dew burns off.",
  "They say I was out here plowin' these fields before the ditch was dug and before the highway was paved.",
  "Nothin' beats the smell of freshly turned black soil under an autumn sky.",
  "Keep tendin' those trees. A good orchard outlasts every storm.",
];

export const TractorManView: React.FC<TractorManViewProps> = ({
  onBackToMarket,
  onBackToOrchard,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const tractorLines = renderColoredTractorMan();

  const handleTractorClick = () => {
    SoundEngine.playTractorRev();
    setQuoteIndex((prev) => (prev + 1) % TRACTORMAN_QUOTES.length);
  };

  return (
    <div className="w-full flex flex-col items-center select-none animate-fade-in pb-8">
      {/* Top Navigation Bar */}
      <div className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-3 mb-3 px-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              SoundEngine.playPluck(1.2);
              onBackToMarket();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-mono font-bold rounded shadow-2xs transition-colors cursor-pointer"
            title="Return to the Roadside Stand"
          >
            <Store className="w-3.5 h-3.5" />
            Back to Market Stand
          </button>
          <button
            onClick={() => {
              SoundEngine.playPluck(1.1);
              onBackToOrchard();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-mono font-medium rounded transition-colors cursor-pointer"
            title="Return to the Orchard plots"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Orchard
          </button>
        </div>

        {/* Story Title & Rev Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTractorClick}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-800 hover:bg-stone-900 active:scale-95 text-amber-400 text-xs font-mono font-bold rounded shadow-2xs transition-all cursor-pointer"
            title="Rev the Tractor Engine!"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Rev Engine</span>
          </button>
        </div>
      </div>

      {/* Quote Banner */}
      <div
        onClick={handleTractorClick}
        className="w-full max-w-5xl bg-[#fbf9f4] border border-amber-900/20 rounded-lg p-3 mb-3 flex items-start gap-3 cursor-pointer hover:bg-[#faf6ee] transition-colors shadow-2xs font-mono"
        title="Click to talk with TractorMan"
      >
        <span className="text-xl leading-none">🚜</span>
        <div className="flex-1">
          <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
            <span>TractorMan</span>
            <span className="text-[10px] text-stone-400 font-normal">(Click anywhere on tractor to chat)</span>
          </div>
          <p className="text-xs text-stone-800 font-medium italic mt-0.5">
            "{TRACTORMAN_QUOTES[quoteIndex]}"
          </p>
        </div>
      </div>

      {/* Main ASCII Canvas for TractorMan */}
      <div className="w-full bg-[#f5f2eb] p-3 sm:p-5 overflow-x-auto ascii-scroll flex justify-center items-start rounded-lg border border-stone-300/80 shadow-inner">
        <div
          onClick={handleTractorClick}
          role="button"
          tabIndex={0}
          title="TractorMan & his ancient two-cylinder rig (Click to rev engine)"
          className="select-none cursor-pointer inline-block text-left group hover:brightness-105 active:scale-[0.995] transition-all"
        >
          <pre
            className="font-mono leading-none select-none m-0 p-0"
            style={{
              fontSize: `${0.85 * scale}rem`,
              lineHeight: `${0.95 * scale}rem`,
            }}
          >
            {tractorLines.map((line, idx) => (
              <div key={idx} dangerouslySetInnerHTML={{ __html: line }} />
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
};
