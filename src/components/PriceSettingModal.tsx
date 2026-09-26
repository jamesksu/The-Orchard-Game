import React, { useEffect } from 'react';
import { FruitType, Season } from '../types';
import { getDemandAnalysis } from '../constants/produce';
import { renderProducePriceSign } from '../services/asciiArt';
import { SoundEngine } from '../services/sound';
import { X, Check } from 'lucide-react';

interface PriceSettingModalProps {
  isOpen: boolean;
  produceId: FruitType;
  name: string;
  symbol: string;
  unit: string;
  price: number;
  defaultPrice: number;
  autoSell: boolean;
  season?: Season;
  inventoryCount?: number;
  onUpdatePrice: (newPrice: number) => void;
  onToggleAutoSell: () => void;
  onClose: () => void;
}

export const PriceSettingModal: React.FC<PriceSettingModalProps> = ({
  isOpen,
  produceId,
  name,
  symbol,
  unit,
  price,
  defaultPrice,
  autoSell,
  season = 'Spring',
  inventoryCount = 0,
  onUpdatePrice,
  onToggleAutoSell,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const analysis = getDemandAnalysis(price, defaultPrice, season, produceId);
  const priceFormatted = `$${price.toFixed(2)} ${unit}`;
  const demandFormatted = `${season} (${analysis.demandLabel} ${analysis.demand.toFixed(1)}x)`;

  const signLines = renderProducePriceSign(
    name,
    symbol,
    priceFormatted,
    autoSell,
    analysis.rateText,
    demandFormatted,
    inventoryCount
  );

  const handleAdjustPrice = (delta: number) => {
    const next = Math.max(0.25, Math.round((price + delta) * 100) / 100);
    SoundEngine.playPluck(delta > 0 ? 1.4 : 1.1);
    onUpdatePrice(next);
  };

  const handlePlaqueClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    if (
      target.closest('[data-action="decrease-price"]') ||
      target.getAttribute('data-action') === 'decrease-price' ||
      target.textContent?.trim() === '-'
    ) {
      e.stopPropagation();
      handleAdjustPrice(-0.5);
      return;
    }

    if (
      target.closest('[data-action="increase-price"]') ||
      target.getAttribute('data-action') === 'increase-price' ||
      target.textContent?.trim() === '+'
    ) {
      e.stopPropagation();
      handleAdjustPrice(0.5);
      return;
    }

    if (
      target.closest('[data-action="toggle-auto-sell"]') ||
      target.textContent?.includes('ENABLED') ||
      target.textContent?.includes('OFF') ||
      target.textContent?.includes('Auto-Sell')
    ) {
      SoundEngine.playPluck(autoSell ? 1.1 : 1.4);
      onToggleAutoSell();
    }
  };

  const handlePlaqueKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target as HTMLElement;
      if (
        target.closest('[data-action="decrease-price"]') ||
        target.getAttribute('data-action') === 'decrease-price' ||
        target.textContent?.trim() === '-'
      ) {
        e.preventDefault();
        handleAdjustPrice(-0.5);
        return;
      }
      if (
        target.closest('[data-action="increase-price"]') ||
        target.getAttribute('data-action') === 'increase-price' ||
        target.textContent?.trim() === '+'
      ) {
        e.preventDefault();
        handleAdjustPrice(0.5);
        return;
      }
      if (
        target.closest('[data-action="toggle-auto-sell"]') ||
        target.textContent?.includes('ENABLED') ||
        target.textContent?.includes('OFF')
      ) {
        e.preventDefault();
        SoundEngine.playPluck(autoSell ? 1.1 : 1.4);
        onToggleAutoSell();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${name} Settings`}
    >
      <div
        className="bg-[#fbf9f4] border border-stone-300 rounded-xl shadow-2xl p-4 sm:p-6 max-w-2xl w-full flex flex-col items-center relative max-h-[92vh] overflow-y-auto ascii-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-stone-400 hover:text-stone-700 p-1.5 rounded-lg transition-colors cursor-pointer"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ASCII Sign Board */}
        <div className="w-full overflow-x-auto flex justify-center ascii-scroll mb-3">
          <pre
            style={{ fontSize: '0.85rem', lineHeight: '1.24' }}
            onClick={handlePlaqueClick}
            onKeyDown={handlePlaqueKeyDown}
            className="font-mono text-stone-800 m-0 p-0 font-medium tracking-tight select-none text-center inline-block min-w-max"
            dangerouslySetInnerHTML={{ __html: signLines.join('\n') }}
          />
        </div>

        {/* Save button */}
        <div className="flex items-center justify-center mt-2 w-full max-w-xs">
          <button
            onClick={() => {
              SoundEngine.playCoin();
              onClose();
            }}
            className="w-full py-2 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-mono font-bold text-xs rounded-lg border border-emerald-900 transition-all cursor-pointer shadow-sm text-center flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save & Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
