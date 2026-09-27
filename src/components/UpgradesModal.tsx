import React from 'react';
import { Upgrade } from '../types';
import { X, Zap, Check } from 'lucide-react';

interface UpgradesModalProps {
  isOpen: boolean;
  onClose: () => void;
  upgrades: Upgrade[];
  money: number;
  onBuyUpgrade: (upgradeId: string) => void;
  fontScale?: number;
}

export const UpgradesModal: React.FC<UpgradesModalProps> = ({
  isOpen,
  onClose,
  upgrades,
  money,
  onBuyUpgrade,
  fontScale = 1,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs select-none">
      <div
        style={{
          transform: fontScale !== 1 ? `scale(${fontScale})` : undefined,
          transformOrigin: 'center center',
        }}
        className="bg-[#fcfbf9] border border-stone-300 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden transition-transform duration-150"
      >
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-stone-200 flex items-center justify-between bg-stone-100/70">
          <div>
            <h2 className="text-xl font-bold font-mono text-stone-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600" />
              Agricultural Tools & Hired Hands
            </h2>
            <p className="text-xs font-mono text-stone-600 mt-1">
              Purchase permanent mechanical and botanical upgrades to boost yield and efficiency.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upgrades List */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-3">
          {upgrades.map((u) => {
            const cost = Math.round(u.cost * Math.pow(u.costMultiplier, u.level));
            const isMax = u.level >= u.maxLevel;
            const canAfford = money >= cost && !isMax;

            return (
              <div
                key={u.id}
                className="bg-white border border-stone-200 rounded-lg p-3.5 flex items-center justify-between gap-3 shadow-2xs hover:border-amber-400 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono font-bold text-sm text-stone-900">{u.name}</h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 bg-stone-100 text-stone-600 rounded border border-stone-200">
                      Lvl {u.level} / {u.maxLevel}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-stone-500 mt-1">{u.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {!isMax && (
                    <span className="font-mono font-bold text-sm text-emerald-800">
                      ${cost.toLocaleString()}
                    </span>
                  )}
                  <button
                    onClick={() => onBuyUpgrade(u.id)}
                    disabled={!canAfford || isMax}
                    className={`px-3 py-1.5 font-mono text-xs font-semibold rounded flex items-center gap-1 transition-all cursor-pointer ${
                      isMax
                        ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                        : canAfford
                        ? 'bg-amber-700 hover:bg-amber-800 text-white shadow-2xs active:scale-95'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    {isMax ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>MAX</span>
                      </>
                    ) : (
                      'Upgrade'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs font-mono text-stone-600">
          <span>
            Available Treasury:{' '}
            <strong className="text-emerald-800">${money.toLocaleString()}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 text-white font-medium rounded hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
