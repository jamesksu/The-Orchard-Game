import React from 'react';
import { Plot, FruitType, ProduceInfo } from '../types';
import { PRODUCE_CATALOG } from '../constants/produce';
import { X, Sprout } from 'lucide-react';

interface PlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  plot: Plot | null;
  money: number;
  onPlantTree: (plotId: number, type: FruitType) => void;
  fontScale?: number;
}

const CATEGORIES = [
  { form: 'tree' as const, label: '🌳 Fruit Trees', blurb: 'Slower to grow, but the most valuable harvests.' },
  { form: 'bush' as const, label: '🌿 Bushes & Garden Crops', blurb: 'Cheap, quick to grow and great for filling the orchard.' },
];

export const PlantModal: React.FC<PlantModalProps> = ({
  isOpen,
  onClose,
  plot,
  money,
  onPlantTree,
  fontScale = 1,
}) => {
  if (!isOpen || !plot) return null;

  const coord = `[${String.fromCharCode(65 + plot.row)}${plot.col + 1}]`;

  const renderProduceCard = (info: ProduceInfo) => {
    const canAfford = money >= info.seedCost;
    return (
      <div
        key={info.type}
        className="bg-white border border-stone-200 rounded-lg p-3 flex items-center justify-between gap-3 hover:border-emerald-400 transition-colors shadow-2xs"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl select-none">{info.symbol}</span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono font-bold text-sm text-stone-900">{info.name}</span>
              <span className="text-[11px] font-mono px-1.5 py-0.2 bg-stone-100 rounded text-stone-600 border border-stone-200">
                ⏱ {info.growthSeconds}s / harvest
              </span>
            </div>
            <p className="text-xs font-mono text-stone-500 mt-0.5">
              {info.description} (Sells for ${info.baseValue.toFixed(2)} each)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right font-mono">
            <span className="text-xs font-bold text-emerald-800">
              {info.seedCost === 0 ? 'FREE' : `$${info.seedCost}`}
            </span>
          </div>
          <button
            onClick={() => {
              onPlantTree(plot.id, info.type);
              onClose();
            }}
            disabled={!canAfford}
            className={`px-3 py-1.5 font-mono text-xs font-semibold rounded transition-all cursor-pointer ${
              canAfford
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs active:scale-95'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            Plant
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs select-none">
      <div
        style={{
          transform: fontScale !== 1 ? `scale(${fontScale})` : undefined,
          transformOrigin: 'center center',
        }}
        className="bg-[#fcfbf9] border border-stone-300 rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden transition-transform duration-150"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-100/70">
          <div>
            <h2 className="text-lg font-bold font-mono text-stone-900 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-700" />
              Plant a Tree or Bush - Plot {coord}
            </h2>
            <p className="text-xs font-mono text-stone-600 mt-0.5">
              Choose any fruit, vegetable or crop to cultivate in this prepared soil.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Crops List */}
        <div className="p-4 overflow-y-auto space-y-4">
          {CATEGORIES.map((cat) => {
            const items = Object.values(PRODUCE_CATALOG)
              .filter((info) => info.plantForm === cat.form)
              .sort((a, b) => a.seedCost - b.seedCost);

            return (
              <div key={cat.form} className="space-y-2.5">
                <div>
                  <h3 className="font-mono font-bold text-xs text-stone-700 uppercase tracking-wider">
                    {cat.label} ({items.length})
                  </h3>
                  <p className="text-[11px] font-mono text-stone-500">{cat.blurb}</p>
                </div>
                {items.map(renderProduceCard)}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs font-mono text-stone-600">
          <span>
            Current Funds:{' '}
            <strong className="text-emerald-800">${money.toLocaleString()}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
