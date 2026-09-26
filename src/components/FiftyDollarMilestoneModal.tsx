import React, { useEffect } from 'react';
import { renderFiftyDollarMilestonePlaque } from '../services/asciiArt';
import { SoundEngine } from '../services/sound';

interface FiftyDollarMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FiftyDollarMilestoneModal: React.FC<FiftyDollarMilestoneModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    SoundEngine.playFanfare();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        SoundEngine.playRustle();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDismiss = () => {
    SoundEngine.playRustle();
    onClose();
  };

  const plaqueLines = renderFiftyDollarMilestonePlaque();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs select-none animate-fade-in"
      onClick={handleDismiss}
      role="dialog"
      aria-modal="true"
      aria-label="Milestone Notice"
    >
      <div
        className="bg-[#fbf9f4] border border-stone-300 rounded-xl shadow-2xl p-4 sm:p-6 max-w-xl w-full max-h-[88vh] overflow-y-auto flex flex-col items-center cursor-pointer transition-transform hover:scale-[1.005] active:scale-[0.995]"
        onClick={(e) => {
          e.stopPropagation();
          handleDismiss();
        }}
        title="Click anywhere to continue"
      >
        <div className="w-full overflow-x-auto flex justify-center ascii-scroll">
          <pre
            style={{ fontSize: '0.85rem', lineHeight: '1.24' }}
            className="font-mono text-stone-800 m-0 p-0 font-medium tracking-tight select-none text-center inline-block min-w-max"
            dangerouslySetInnerHTML={{ __html: plaqueLines.join('\n') }}
          />
        </div>
        <div className="mt-3 text-xs font-mono text-stone-500 flex items-center gap-1.5">
          <span>(Click anywhere or press Enter/Space to continue)</span>
        </div>
      </div>
    </div>
  );
};
