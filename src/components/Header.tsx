import React from 'react';
import { FruitType, Plot, Season } from '../types';
import { PRODUCE_CATALOG, ALL_FRUIT_TYPES } from '../constants/produce';
import { CRAFTING_RECIPES } from '../constants/gameData';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface HeaderProps {
  hasLadder: boolean;
  basket: Record<FruitType, number>;
  isBasketPopping: boolean;
  plots: Plot[];
  lifetimeFruits: Record<FruitType, number>;
  season: Season;
  day: number;
  hour: number;
  money: number;
  fontScale: number;
  setFontScale: (scale: number) => void;
  onResetGame: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  weatherText?: string;
  hasFirstApple?: boolean;
  hasTruckKey?: boolean;
  onOpenTractorMan?: () => void;
  onOpenMainStreet?: () => void;
  onOpenForestPath?: () => void;
  juiceInventory?: Record<string, number>;
}

export const Header: React.FC<HeaderProps> = ({
  hasLadder,
  basket,
  isBasketPopping,
  plots,
  lifetimeFruits,
  season,
  day,
  hour,
  money,
  fontScale,
  setFontScale,
  onResetGame,
  soundEnabled,
  onToggleSound,
  weatherText,
  hasFirstApple,
  hasTruckKey = false,
  onOpenTractorMan,
  onOpenMainStreet,
  onOpenForestPath,
  juiceInventory = {},
}) => {
  const visibleItems = ALL_FRUIT_TYPES.filter((type) => {
    if (type === 'apple') return true;
    return (
      plots.some((p) => p.tree?.type === type) ||
      (lifetimeFruits[type] || 0) > 0 ||
      (basket[type] || 0) > 0
    );
  });

  return (
    <header className="w-full max-w-5xl flex flex-col items-start mb-3 px-1 sm:px-2 select-none">
      {/* Top row: 'The Orchard' on left, controls on right */}
      <div className="w-full flex items-center justify-between gap-3 mb-0.5">
        <h1
          style={{ fontSize: '0.88rem' }}
          className="font-mono text-stone-800 font-bold text-left tracking-tight m-0"
        >
          The Orchard
        </h1>

        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono text-stone-600">
          <div className="flex items-center bg-[#f5f2eb] border border-stone-300 rounded px-1.5 py-0.5 shadow-2xs">
            <button
              onClick={() => setFontScale(Math.max(0.65, fontScale - 0.15))}
              className="p-1 hover:text-stone-900 text-stone-500 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-[11px] text-stone-600 tabular-nums font-mono min-w-8 text-center">
              {Math.round(fontScale * 100)}%
            </span>
            <button
              onClick={() => setFontScale(Math.min(1.5, fontScale + 0.15))}
              className="p-1 hover:text-stone-900 text-stone-500 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {fontScale !== 1 && (
              <button
                onClick={() => setFontScale(1)}
                className="p-1 text-stone-400 hover:text-stone-700 ml-1 cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          {onOpenTractorMan && (
            <button
              onClick={onOpenTractorMan}
              className="text-[11px] font-mono font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 active:scale-95 border border-amber-300 rounded px-2 py-0.5 shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
              title="Go directly to TractorMan (Test shortcut)"
            >
              <span>🚜</span>
              <span>TractorMan</span>
            </button>
          )}

          {onOpenMainStreet && (
            <button
              onClick={onOpenMainStreet}
              className="text-[11px] font-mono font-bold text-sky-900 bg-sky-100 hover:bg-sky-200 active:scale-95 border border-sky-300 rounded px-2 py-0.5 shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
              title="Go directly to Main Street"
            >
              <span>🏘️</span>
              <span>Main Street</span>
            </button>
          )}

          {onOpenForestPath && (
            <button
              onClick={onOpenForestPath}
              className="text-[11px] font-mono font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 active:scale-95 border border-emerald-300 rounded px-2 py-0.5 shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
              title="Go directly to Forest Path"
            >
              <span>🌲</span>
              <span>Forest Path</span>
            </button>
          )}

          <button
            onClick={onResetGame}
            className="text-[11px] font-mono text-stone-500 hover:text-red-700 hover:bg-red-50 border border-stone-300 hover:border-red-300 rounded px-2 py-0.5 shadow-2xs transition-colors cursor-pointer"
            title="Reset game progress"
          >
            Reset Game
          </button>
          <button
            onClick={onToggleSound}
            className="text-[11px] font-mono text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 border border-stone-300 hover:border-stone-400 rounded px-2 py-0.5 shadow-2xs transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute audio' : 'Unmute audio'}
          >
            {soundEnabled ? '🔊 Sound' : '🔇 Muted'}
          </button>
        </div>
      </div>

      <div
        style={{ fontSize: '0.85rem' }}
        className="font-mono text-stone-800 font-medium flex flex-wrap items-center justify-start gap-x-2.5 gap-y-1 my-0.5 text-left tracking-tight"
      >
        <span>
          {season}: Day {day}: Hour {hour}
        </span>
        {hasFirstApple && weatherText && (
          <span className="inline-flex items-center gap-1.5 ml-2">
            <span className="text-stone-400">·</span>
            <span className="font-semibold text-stone-700">Conditions:</span>
            <span className="text-stone-800">{weatherText}</span>
          </span>
        )}
      </div>

      {(hasLadder || hasTruckKey) && (
        <>
          {hasLadder && (
            <div
              style={{ fontSize: '0.88rem' }}
              className="font-mono text-stone-800 font-bold my-0.5 text-left tracking-tight"
            >
              Treasury: <span className="text-emerald-800 font-extrabold">${money.toLocaleString()}</span>
            </div>
          )}

          <div
            style={{ fontSize: '0.85rem' }}
            className="font-mono text-stone-800 font-medium flex flex-wrap items-center justify-start gap-x-1.5 gap-y-0.5 my-0.5 text-left max-w-4xl"
          >
            <span className="font-semibold text-stone-700">Inventory:</span>
            {hasLadder && (
              <span className="inline-flex items-center">
                <span>Wooden Ladder:</span>
                <span className="font-bold ml-1 tabular-nums">1</span>
                {(hasTruckKey || visibleItems.length > 0) && <span className="mr-1">,</span>}
              </span>
            )}
            {hasTruckKey && (
              <span className="inline-flex items-center">
                <span>Truck Key:</span>
                <span className="font-bold ml-1 tabular-nums">1</span>
                {visibleItems.length > 0 && <span className="mr-1">,</span>}
              </span>
            )}
            {visibleItems.map((item, idx) => {
              const info = PRODUCE_CATALOG[item];
              const count = basket[item] || 0;
              return (
                <span key={item} className="inline-flex items-center">
                  <span>{info.plural}:</span>
                  <span
                    className={`font-bold ml-1 tabular-nums transition-transform duration-200 ${
                      isBasketPopping ? 'pop-active' : ''
                    }`}
                  >
                    {count}
                  </span>
                  {idx < visibleItems.length - 1 && <span className="mr-1">,</span>}
                </span>
              );
            })}
            {Object.entries(juiceInventory).map(([recipeId, count]) => {
              if (count <= 0) return null;
              const recipe = CRAFTING_RECIPES.find((r) => r.id === recipeId);
              const label = recipe ? recipe.outputName : recipeId;
              return (
                <span key={recipeId} className="inline-flex items-center text-amber-900 font-semibold ml-0.5">
                  <span className="mr-0.5">🧃</span>
                  <span>{label}:</span>
                  <span className="font-bold ml-1 tabular-nums">{count}</span>
                  <span className="mr-1">,</span>
                </span>
              );
            })}
          </div>
        </>
      )}
    </header>
  );
};
