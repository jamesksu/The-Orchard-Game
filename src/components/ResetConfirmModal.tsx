import React, { useEffect } from 'react';
import { renderResetConfirmation } from '../services/asciiArt';
import { SoundEngine } from '../services/sound';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  fontScale?: number;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  fontScale = 1,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const signLines = renderResetConfirmation();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs select-none animate-fade-in"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-label="Reset Confirmation"
    >
      <div
        className="bg-[#fbf9f4] border border-stone-300 rounded-xl shadow-2xl p-4 sm:p-6 max-w-2xl w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full overflow-x-auto flex justify-center ascii-scroll">
          <pre
            style={{ fontSize: `${0.85 * fontScale}rem`, lineHeight: '1.24' }}
            className="font-mono text-stone-800 m-0 p-0 font-medium tracking-tight select-none text-center inline-block min-w-max"
            dangerouslySetInnerHTML={{ __html: signLines.join('\n') }}
          />
        </div>

        <div className="flex items-center justify-center gap-4 mt-5 w-full max-w-xs">
          <button
            onClick={() => {
              SoundEngine.playCoin();
              onConfirm();
            }}
            className="flex-1 py-2 px-4 bg-red-700 hover:bg-red-800 active:scale-95 text-white font-mono font-bold text-xs rounded-lg border border-red-900 transition-all cursor-pointer shadow-sm text-center"
          >
            Yes, Reset
          </button>
          <button
            onClick={() => {
              SoundEngine.playPluck(1.2);
              onCancel();
            }}
            className="flex-1 py-2 px-4 bg-stone-200 hover:bg-stone-300 active:scale-95 text-stone-800 font-mono font-bold text-xs rounded-lg border border-stone-300 transition-all cursor-pointer shadow-sm text-center"
          >
            No, Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
