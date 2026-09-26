import React, { useState, useEffect } from 'react';
import { Season } from '../types';
import { PRODUCE_CATALOG, ALL_FRUIT_TYPES, SEASONAL_DEMAND_FACTORS } from '../constants/produce';
import { SoundEngine } from '../services/sound';
import { X, Search, Sparkles, TrendingUp, Info } from 'lucide-react';

interface MarketResearchModalProps {
  isOpen: boolean;
  currentSeason: Season;
  onClose: () => void;
}

export const MarketResearchModal: React.FC<MarketResearchModalProps> = ({
  isOpen,
  currentSeason,
  onClose,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'tree' | 'bush'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const produceList = ALL_FRUIT_TYPES.map((type) => {
    const info = PRODUCE_CATALOG[type];
    const sp = SEASONAL_DEMAND_FACTORS.Spring[type] ?? 1.0;
    const su = SEASONAL_DEMAND_FACTORS.Summer[type] ?? 1.0;
    const au = SEASONAL_DEMAND_FACTORS.Autumn[type] ?? 1.0;
    const wi = SEASONAL_DEMAND_FACTORS.Winter[type] ?? 1.0;

    const ranks = [
      { season: 'Spring', val: sp },
      { season: 'Summer', val: su },
      { season: 'Autumn', val: au },
      { season: 'Winter', val: wi },
    ].sort((a, b) => b.val - a.val);

    return {
      id: type,
      name: info.name,
      symbol: info.symbol,
      category: info.plantForm,
      basePrice: info.baseValue,
      unit: info.unit.toLowerCase(),
      spring: sp,
      summer: su,
      autumn: au,
      winter: wi,
      peakSeason: ranks[0].season,
      peakValue: ranks[0].val,
    };
  });

  const filtered = produceList.filter((item) => {
    if (filterCategory === 'tree' && item.category !== 'tree') return false;
    if (filterCategory === 'bush' && item.category !== 'bush') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.peakSeason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const renderBadge = (factor: number, isCurrent: boolean) => {
    let colorClass = 'bg-stone-100 text-stone-700 border-stone-300';
    let icon = '';
    if (factor >= 1.8) {
      colorClass = 'bg-amber-100 text-amber-900 border-amber-400 font-extrabold shadow-2xs';
      icon = '🔥';
    } else if (factor >= 1.3) {
      colorClass = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
      icon = '📈';
    } else if (factor <= 0.6) {
      colorClass = 'bg-rose-50 text-rose-800 border-rose-200';
      icon = '❄️';
    } else if (factor < 0.9) {
      colorClass = 'bg-stone-100 text-stone-600 border-stone-200';
    }

    return (
      <div
        className={`inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded border text-xs font-mono transition-transform ${colorClass} ${
          isCurrent ? 'ring-2 ring-emerald-600 ring-offset-1 font-bold' : ''
        }`}
      >
        <span>{factor.toFixed(1)}x</span>
        {icon && <span className="text-[10px]">{icon}</span>}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/60 backdrop-blur-xs select-none animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Market Research Demand Ledger"
    >
      <div
        className="bg-[#fcfbf9] border-2 border-stone-400 rounded-xl shadow-2xl p-4 sm:p-6 max-w-4xl w-full flex flex-col items-center relative max-h-[92vh] overflow-y-auto ascii-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-stone-400 hover:text-stone-700 p-1.5 rounded-lg transition-colors cursor-pointer"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header ASCII Banner */}
        <div className="w-full overflow-x-auto flex justify-center ascii-scroll mb-3">
          <pre
            style={{ fontSize: '0.75rem', lineHeight: '1.2' }}
            className="font-mono text-stone-800 m-0 p-0 font-medium tracking-tight select-none text-center inline-block min-w-max"
          >
            <span className="text-[#b45309] font-bold">
              +========================================================================+
            </span>
            {'\n'}
            <span className="text-[#78350f] font-bold">
              |               📊 ~*~ MARKET RESEARCH & DEMAND LEDGER ~*~ 📊             |
            </span>
            {'\n'}
            <span className="text-stone-600">
              |          Seasonal Consumer Valuation & Purchasing Multipliers          |
            </span>
            {'\n'}
            <span className="text-[#b45309] font-bold">
              +========================================================================+
            </span>
          </pre>
        </div>

        {/* Current Season Notification */}
        <div className="w-full bg-[#f4f0e6] border border-stone-300 rounded-lg p-3 mb-3 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-lg">🗓️</span>
            <div>
              <span className="text-stone-600">Active Orchard Season:</span>{' '}
              <strong className="text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                {currentSeason}
              </strong>
            </div>
          </div>
          <div className="text-[11px] text-stone-600 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Highlighted column reflects current auto-sell demand</span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="w-full flex flex-wrap items-center justify-between gap-2.5 mb-3 font-mono">
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-lg border border-stone-300 text-xs">
            <button
              onClick={() => {
                SoundEngine.playPluck(1.1);
                setFilterCategory('all');
              }}
              className={`px-3 py-1 rounded font-semibold cursor-pointer transition-all ${
                filterCategory === 'all'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              All Produce ({produceList.length})
            </button>
            <button
              onClick={() => {
                SoundEngine.playPluck(1.2);
                setFilterCategory('tree');
              }}
              className={`px-3 py-1 rounded font-semibold cursor-pointer transition-all ${
                filterCategory === 'tree'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              🌳 Trees ({produceList.filter((p) => p.category === 'tree').length})
            </button>
            <button
              onClick={() => {
                SoundEngine.playPluck(1.3);
                setFilterCategory('bush');
              }}
              className={`px-3 py-1 rounded font-semibold cursor-pointer transition-all ${
                filterCategory === 'bush'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              🌿 Bushes ({produceList.filter((p) => p.category === 'bush').length})
            </button>
          </div>

          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-stone-400 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search fruit or crop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 text-xs bg-white border border-stone-300 rounded-lg font-mono text-stone-800 placeholder-stone-400 focus:outline-emerald-600 focus:border-emerald-600 w-52 shadow-2xs"
            />
          </div>
        </div>

        {/* Seasonal Multipliers Table */}
        <div className="w-full border border-stone-300 rounded-lg overflow-hidden shadow-2xs font-mono mb-3 bg-white">
          <div className="overflow-x-auto ascii-scroll">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#f2ede4] border-b border-stone-300 text-stone-800 uppercase font-bold text-[11px] tracking-wider">
                  <th className="py-2.5 px-3">Fruit / Produce</th>
                  <th className="py-2.5 px-2 text-center">Form</th>
                  <th className="py-2.5 px-2 text-right">Base Price</th>
                  <th
                    className={`py-2.5 px-2 text-center ${
                      currentSeason === 'Spring' ? 'bg-emerald-100/70 text-emerald-950 font-extrabold' : ''
                    }`}
                  >
                    🌸 Spring
                  </th>
                  <th
                    className={`py-2.5 px-2 text-center ${
                      currentSeason === 'Summer' ? 'bg-emerald-100/70 text-emerald-950 font-extrabold' : ''
                    }`}
                  >
                    ☀️ Summer
                  </th>
                  <th
                    className={`py-2.5 px-2 text-center ${
                      currentSeason === 'Autumn' ? 'bg-emerald-100/70 text-emerald-950 font-extrabold' : ''
                    }`}
                  >
                    🍂 Autumn
                  </th>
                  <th
                    className={`py-2.5 px-2 text-center ${
                      currentSeason === 'Winter' ? 'bg-emerald-100/70 text-emerald-950 font-extrabold' : ''
                    }`}
                  >
                    ❄️ Winter
                  </th>
                  <th className="py-2.5 px-3 text-center">Peak Season</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl select-none">{item.symbol}</span>
                        <div>
                          <span className="font-bold text-stone-900 block">{item.name}</span>
                          <span className="text-[10px] text-stone-500 lowercase">id: {item.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          item.category === 'tree'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {item.category === 'tree' ? 'Tree' : 'Bush'}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-right font-bold text-stone-800">
                      ${item.basePrice.toFixed(2)}
                    </td>
                    <td className={`py-2 px-2 text-center ${currentSeason === 'Spring' ? 'bg-emerald-50/60' : ''}`}>
                      {renderBadge(item.spring, currentSeason === 'Spring')}
                    </td>
                    <td className={`py-2 px-2 text-center ${currentSeason === 'Summer' ? 'bg-emerald-50/60' : ''}`}>
                      {renderBadge(item.summer, currentSeason === 'Summer')}
                    </td>
                    <td className={`py-2 px-2 text-center ${currentSeason === 'Autumn' ? 'bg-emerald-50/60' : ''}`}>
                      {renderBadge(item.autumn, currentSeason === 'Autumn')}
                    </td>
                    <td className={`py-2 px-2 text-center ${currentSeason === 'Winter' ? 'bg-emerald-50/60' : ''}`}>
                      {renderBadge(item.winter, currentSeason === 'Winter')}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded border border-stone-300 text-[11px]">
                        <TrendingUp className="w-3 h-3 text-emerald-600" />
                        <span>{item.peakSeason}</span>
                        <span className="text-emerald-700">({item.peakValue.toFixed(1)}x)</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Educational Guide */}
        <div className="w-full bg-[#f8f6f0] border border-stone-300 rounded-lg p-3 font-mono text-xs text-stone-700 flex flex-col gap-1.5 mb-3">
          <div className="flex items-center gap-1.5 font-bold text-stone-900">
            <Info className="w-4 h-4 text-amber-700" />
            <span>How Market Demand Affects Selling:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-stone-600 mt-1">
            <div className="flex items-start gap-1.5">
              <span>•</span>
              <div>
                <strong className="text-stone-800">1.0x Baseline:</strong> Standard consumer demand rate.
              </div>
            </div>
            <div className="flex items-start gap-1.5">
              <span>•</span>
              <div>
                <strong className="text-amber-800">Peak Demand (🔥 &gt;1.5x):</strong> Shoppers purchase items much faster; allows higher price markups before sales slow down.
              </div>
            </div>
            <div className="flex items-start gap-1.5">
              <span>•</span>
              <div>
                <strong className="text-rose-800">Off-Season (&lt;0.8x):</strong> Buying interest decreases; discount prices below default to maintain rapid sales.
              </div>
            </div>
            <div className="flex items-start gap-1.5">
              <span>•</span>
              <div>
                <strong className="text-emerald-800">Auto-Sell Rate:</strong> Adjust asking prices directly on the market stand to tune profit versus turnover speed.
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            SoundEngine.playPluck(1.1);
            onClose();
          }}
          className="py-2 px-6 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-mono font-bold text-xs rounded-lg border border-emerald-900 transition-all cursor-pointer shadow-sm"
        >
          Close Research Ledger
        </button>
      </div>
    </div>
  );
};
