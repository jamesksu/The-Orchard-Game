import React, { useState, useEffect } from 'react';
import {
  renderColoredTractorMan,
  renderTractorManIntroPlaque,
  renderTractorManServicesPlaque,
} from '../services/asciiArt';
import { SoundEngine } from '../services/sound';

interface TractorManViewProps {
  onBackToMarket: () => void;
  onBackToOrchard?: () => void;
  hasSeenIntro?: boolean;
  onMarkIntroSeen?: () => void;
  fontScale?: number;
}

export const TractorManView: React.FC<TractorManViewProps> = ({
  onBackToMarket,
  hasSeenIntro,
  onMarkIntroSeen,
  fontScale = 1,
}) => {
  const [showIntroModal, setShowIntroModal] = useState<boolean>(() => {
    // Clear any stale blocking sessionStorage or localStorage keys from prior sessions
    try {
      sessionStorage.removeItem('orchard_tractorman_intro_seen');
      localStorage.removeItem('orchard_tractorman_intro_seen');
    } catch {}
    if (typeof hasSeenIntro === 'boolean') {
      return !hasSeenIntro;
    }
    return true;
  });
  const [showServicesModal, setShowServicesModal] = useState<boolean>(false);

  const tractorLines = renderColoredTractorMan();
  const introPlaqueLines = renderTractorManIntroPlaque();
  const servicesPlaqueLines = renderTractorManServicesPlaque();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        if (showIntroModal) {
          handleDismissIntro();
        } else if (showServicesModal) {
          handleDismissServices();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showIntroModal, showServicesModal]);

  const handleDismissIntro = () => {
    SoundEngine.playRustle();
    setShowIntroModal(false);
    onMarkIntroSeen?.();
  };

  const handleDismissServices = () => {
    SoundEngine.playRustle();
    setShowServicesModal(false);
  };

  const handleTractorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // Check if clicked the crow on the exhaust stack
    if (
      target.closest('[data-crow]') ||
      target.getAttribute('data-crow') === 'true' ||
      target.textContent?.includes('(>o)') ||
      target.textContent?.includes('>(o)')
    ) {
      SoundEngine.playCrowCall();
      onBackToMarket();
      return;
    }

    // Check if clicked TractorMan on the right side
    if (
      target.closest('[data-tractorman]') ||
      target.getAttribute('data-tractorman') === 'true'
    ) {
      SoundEngine.playPluck(1.3);
      setShowServicesModal(true);
      return;
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none animate-fade-in pb-8">
      {/* Main ASCII Canvas for TractorMan */}
      <div className="w-full bg-[#f5f2eb] p-3 sm:p-5 overflow-x-auto ascii-scroll flex justify-center items-start">
        <div
          onClick={handleTractorClick}
          role="region"
          aria-label="TractorMan scene"
          className="select-none inline-block text-left"
        >
          <pre
            className="font-mono leading-none select-none m-0 p-0"
            style={{
              fontSize: `${0.85 * fontScale}rem`,
              lineHeight: `${0.95 * fontScale}rem`,
            }}
          >
            {tractorLines.map((line, idx) => (
              <div key={idx} dangerouslySetInnerHTML={{ __html: line }} />
            ))}
          </pre>
        </div>
      </div>

      {/* First-Open Introduction Pop-up Plaque Modal */}
      {showIntroModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs select-none animate-fade-in"
          onClick={handleDismissIntro}
          role="dialog"
          aria-modal="true"
          aria-label="TractorMan Introduction Plaque"
        >
          <div
            className="bg-[#fbf9f4] border border-stone-300 rounded-xl shadow-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[88vh] overflow-y-auto flex flex-col items-center cursor-pointer transition-transform hover:scale-[1.005] active:scale-[0.995]"
            onClick={(e) => {
              e.stopPropagation();
              handleDismissIntro();
            }}
            title="Click anywhere to continue"
          >
            <div className="w-full overflow-x-auto flex justify-center ascii-scroll">
              <pre
                style={{ fontSize: `${0.85 * fontScale}rem`, lineHeight: '1.24' }}
                className="font-mono text-stone-800 m-0 p-0 font-medium tracking-tight select-none text-center inline-block min-w-max"
                dangerouslySetInnerHTML={{ __html: introPlaqueLines.join('\n') }}
              />
            </div>
            <div className="mt-3 text-xs font-mono text-stone-500 flex items-center gap-1.5">
              <span>(Click anywhere or press Enter/Space to continue)</span>
            </div>
          </div>
        </div>
      )}

      {/* Services Pop-up Plaque Modal (When clicking TractorMan on the right side) */}
      {showServicesModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs select-none animate-fade-in"
          onClick={handleDismissServices}
          role="dialog"
          aria-modal="true"
          aria-label="TractorMan Services Plaque"
        >
          <div
            className="bg-[#fbf9f4] border border-stone-300 rounded-xl shadow-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[88vh] overflow-y-auto flex flex-col items-center cursor-pointer transition-transform hover:scale-[1.005] active:scale-[0.995]"
            onClick={(e) => {
              e.stopPropagation();
              handleDismissServices();
            }}
            title="Click anywhere to close notice"
          >
            <div className="w-full overflow-x-auto flex justify-center ascii-scroll">
              <pre
                style={{ fontSize: `${0.85 * fontScale}rem`, lineHeight: '1.24' }}
                className="font-mono text-stone-800 m-0 p-0 font-medium tracking-tight select-none text-center inline-block min-w-max"
                dangerouslySetInnerHTML={{ __html: servicesPlaqueLines.join('\n') }}
              />
            </div>
            <div className="mt-3 text-xs font-mono text-stone-500 flex items-center gap-1.5">
              <span>(Click anywhere or press Enter/Space to continue)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
