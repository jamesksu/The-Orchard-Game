import React, { useState, useEffect, useMemo } from 'react';
import { FruitType, CraftRecipe } from '../types';
import { CRAFTING_RECIPES } from '../constants/gameData';
import { PRODUCE_CATALOG } from '../constants/produce';
import { renderFruitJuicerPlaqueHeader } from '../services/asciiArt';
import { SoundEngine } from '../services/sound';
import { X, Sparkles, PackageCheck, Wine } from 'lucide-react';

interface FarmhouseFruitJuicerModalProps {
  isOpen: boolean;
  onClose: () => void;
  basket: Record<FruitType, number>;
  onCraftProduct: (recipe: CraftRecipe, quantity: number) => void;
  cidersPressed: number;
  juiceInventory?: Record<string, number>;
  lifetimeFruits?: Record<FruitType, number>;
  fontScale?: number;
}

export const FarmhouseFruitJuicerModal: React.FC<FarmhouseFruitJuicerModalProps> = ({
  isOpen,
  onClose,
  basket,
  onCraftProduct,
  cidersPressed,
  juiceInventory = {},
  lifetimeFruits,
  fontScale = 1,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | '2-produce' | '3-produce' | '4-produce' | 'inventory'>('all');
  const [showCraftableOnly, setShowCraftableOnly] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        SoundEngine.playRustle();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const plaqueHeaderLines = useMemo(() => renderFruitJuicerPlaqueHeader(), []);

  const totalJuiceCount = useMemo(() => {
    return Object.values(juiceInventory).reduce((sum, count) => sum + (count || 0), 0);
  }, [juiceInventory]);

  const totalJuiceValue = useMemo(() => {
    return Object.entries(juiceInventory).reduce((sum, [recipeId, count]) => {
      const recipe = CRAFTING_RECIPES.find((r) => r.id === recipeId);
      return sum + (count || 0) * (recipe?.bottleValue || 0);
    }, 0);
  }, [juiceInventory]);

  // Check if a produce variety has ever been placed into the inventory
  const isProduceDiscovered = (fruitType: FruitType): boolean => {
    return (basket[fruitType] || 0) > 0 || (lifetimeFruits?.[fruitType] || 0) > 0;
  };

  // A recipe is unlocked/discovered once all its required produce varieties have been placed into inventory
  const isRecipeDiscovered = (recipe: CraftRecipe): boolean => {
    if (recipe.ingredients && recipe.ingredients.length > 0) {
      return recipe.ingredients.every((ing) => isProduceDiscovered(ing.fruitType));
    }
    if (recipe.fruitType) {
      return isProduceDiscovered(recipe.fruitType);
    }
    return false;
  };

  const discoveredRecipes = useMemo(() => {
    return CRAFTING_RECIPES.filter(isRecipeDiscovered);
  }, [basket, lifetimeFruits]);

  const countAll = discoveredRecipes.length;
  const count2 = discoveredRecipes.filter((r) => r.category === '2-produce').length;
  const count3 = discoveredRecipes.filter((r) => r.category === '3-produce').length;
  const count4 = discoveredRecipes.filter((r) => r.category === '4-produce').length;

  if (!isOpen) return null;

  const handleDismiss = () => {
    SoundEngine.playRustle();
    onClose();
  };

  const calculateMaxCraftable = (recipe: CraftRecipe): number => {
    let max = Infinity;
    for (const ing of recipe.ingredients) {
      const inStock = basket[ing.fruitType] || 0;
      const possible = Math.floor(inStock / ing.amount);
      if (possible < max) max = possible;
    }
    return max === Infinity ? 0 : max;
  };

  const filteredRecipes = discoveredRecipes.filter((r) => {
    if (activeCategory !== 'all' && r.category !== activeCategory) return false;
    if (showCraftableOnly && calculateMaxCraftable(r) < 1) return false;
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/65 backdrop-blur-xs select-none animate-fade-in"
      onClick={handleDismiss}
      role="dialog"
      aria-modal="true"
      aria-label="Farmhouse Fruit Juicer"
    >
      <div
        style={{
          transform: fontScale !== 1 ? `scale(${fontScale})` : undefined,
          transformOrigin: 'center center',
        }}
        className="bg-[#fbf9f4] border border-stone-300 rounded-xl shadow-2xl p-3 sm:p-5 max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col items-center transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Plaque Close Icon */}
        <div className="w-full flex justify-end mb-1">
          <button
            onClick={handleDismiss}
            className="p-1 text-stone-500 hover:text-stone-900 hover:bg-stone-200/80 rounded transition-colors cursor-pointer"
            title="Close Juicer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ASCII Plaque Header */}
        <div className="w-full overflow-x-auto flex justify-center ascii-scroll mb-3">
          <pre
            style={{ fontSize: `${0.82 * fontScale}rem`, lineHeight: '1.2' }}
            className="font-mono text-stone-800 m-0 p-0 font-medium tracking-tight select-none text-center inline-block min-w-max"
            dangerouslySetInnerHTML={{ __html: plaqueHeaderLines.join('\n') }}
          />
        </div>

        {/* Category Filters Bar */}
        <div className="w-full max-w-3xl flex flex-wrap items-center justify-between gap-2 border-b border-amber-900/20 pb-3 mb-4">
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 rounded font-bold transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-amber-800 text-amber-50 shadow-2xs'
                  : 'bg-stone-200/80 text-stone-700 hover:bg-stone-300'
              }`}
            >
              All Juices ({countAll})
            </button>
            <button
              onClick={() => setActiveCategory('2-produce')}
              className={`px-3 py-1 rounded font-bold transition-all cursor-pointer ${
                activeCategory === '2-produce'
                  ? 'bg-amber-800 text-amber-50 shadow-2xs'
                  : 'bg-stone-200/80 text-stone-700 hover:bg-stone-300'
              }`}
            >
              2-Produce ({count2})
            </button>
            <button
              onClick={() => setActiveCategory('3-produce')}
              className={`px-3 py-1 rounded font-bold transition-all cursor-pointer ${
                activeCategory === '3-produce'
                  ? 'bg-amber-800 text-amber-50 shadow-2xs'
                  : 'bg-stone-200/80 text-stone-700 hover:bg-stone-300'
              }`}
            >
              3-Produce ({count3})
            </button>
            <button
              onClick={() => setActiveCategory('4-produce')}
              className={`px-3 py-1 rounded font-bold transition-all cursor-pointer ${
                activeCategory === '4-produce'
                  ? 'bg-amber-800 text-amber-50 shadow-2xs'
                  : 'bg-stone-200/80 text-stone-700 hover:bg-stone-300'
              }`}
            >
              4-Produce ({count4})
            </button>
            <button
              onClick={() => setActiveCategory('inventory')}
              className={`px-3 py-1 rounded font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeCategory === 'inventory'
                  ? 'bg-emerald-800 text-emerald-50 shadow-2xs'
                  : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Pantry Cellar ({totalJuiceCount})</span>
            </button>
          </div>

          {activeCategory !== 'inventory' && (
            <label className="flex items-center gap-1.5 text-xs font-mono text-stone-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showCraftableOnly}
                onChange={(e) => setShowCraftableOnly(e.target.checked)}
                className="rounded border-stone-400 text-amber-700 focus:ring-amber-500 cursor-pointer"
              />
              <span className="font-semibold">Ready to Juice Only</span>
            </label>
          )}
        </div>

        {/* Content Section: Recipes or Inventory */}
        {activeCategory === 'inventory' ? (
          <div className="w-full max-w-3xl space-y-4 my-2">
            <div className="bg-amber-50/70 border border-amber-300/80 rounded-lg p-3 text-xs font-mono text-amber-900 flex items-center justify-between">
              <div>
                <span className="font-bold">Cellar Inventory Status:</span>{' '}
                <span>{totalJuiceCount} bottles stored</span>
              </div>
              <div>
                <span className="font-bold">Total Stored Value:</span>{' '}
                <span className="text-emerald-700 font-extrabold text-sm">${totalJuiceValue.toLocaleString()}</span>
              </div>
            </div>

            {totalJuiceCount === 0 ? (
              <div className="py-12 text-center font-mono text-stone-500">
                <Wine className="w-10 h-10 mx-auto text-stone-400 mb-2 stroke-1" />
                <p className="text-sm font-semibold">Your pantry shelves are currently empty.</p>
                <p className="text-xs mt-1 text-stone-400">
                  Combine 2 to 4 produce varieties above to cold-press juices into your inventory!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(juiceInventory).map(([recipeId, count]) => {
                  if (count <= 0) return null;
                  const recipe = CRAFTING_RECIPES.find((r) => r.id === recipeId);
                  const title = recipe ? recipe.outputName : recipeId;
                  const value = recipe ? recipe.bottleValue : 0;

                  return (
                    <div
                      key={recipeId}
                      className="bg-white border border-stone-200 rounded-lg p-3 shadow-2xs font-mono flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 text-amber-900 font-bold text-sm">
                          <span>🧃</span>
                          <span>{title}</span>
                        </div>
                        <div className="text-xs text-stone-500 mt-1 line-clamp-2">
                          {recipe?.description || 'Artisanal farmhouse juice.'}
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                        <span className="text-stone-600">
                          Count: <strong className="text-stone-900 font-bold">{count}</strong>
                        </span>
                        <span className="text-emerald-700 font-bold">
                          ${value} / bottle
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="w-full max-w-3xl py-10 px-4 text-center font-mono text-stone-600 bg-amber-50/60 border border-amber-200/80 rounded-xl my-4">
            {discoveredRecipes.length === 0 ? (
              <>
                <div className="text-3xl mb-2">🔒 🧃</div>
                <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider mb-1">
                  No Juicer Recipes Discovered Yet
                </h3>
                <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                  Recipes remain hidden until the required produce varieties are first placed into your inventory!
                </p>
                <p className="text-[11px] text-amber-800 mt-2.5 font-medium bg-amber-100/70 border border-amber-300/60 rounded px-3 py-1.5 inline-block">
                  💡 Tip: Harvest and collect at least 2 different orchard fruits or garden crops to reveal unique juice recipes.
                </p>
              </>
            ) : showCraftableOnly ? (
              <>
                <p className="text-sm font-bold text-stone-800">No Discovered Recipes Ready to Juice</p>
                <p className="text-xs text-stone-500 mt-1">
                  You don't currently have enough raw produce for any discovered recipe. Uncheck "Ready to Juice Only" to see all unlocked recipes.
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl mb-1">🔍</div>
                <p className="text-sm font-bold text-stone-800">
                  No {activeCategory === '2-produce' ? '2-Produce' : activeCategory === '3-produce' ? '3-Produce' : '4-Produce'} Recipes Discovered Yet
                </p>
                <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                  Continue expanding your orchard and planting new varieties to discover advanced recipes in this category!
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="w-full max-w-3xl overflow-y-auto space-y-3 my-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredRecipes.map((recipe) => {
                const maxCraftable = calculateMaxCraftable(recipe);
                const canCraft = maxCraftable > 0;

                const categoryLabel =
                  recipe.category === '2-produce'
                    ? '2 Produce'
                    : recipe.category === '3-produce'
                    ? '3 Produce'
                    : '4 Produce';

                const categoryColor =
                  recipe.category === '2-produce'
                    ? 'bg-blue-100 text-blue-900 border-blue-200'
                    : recipe.category === '3-produce'
                    ? 'bg-amber-100 text-amber-900 border-amber-200'
                    : 'bg-purple-100 text-purple-900 border-purple-200';

                const inInventory = juiceInventory[recipe.id] || 0;

                return (
                  <div
                    key={recipe.id}
                    className="bg-white border border-amber-900/15 rounded-lg p-3.5 flex flex-col justify-between shadow-2xs hover:border-amber-700/40 transition-colors"
                  >
                    <div>
                      {/* Title & Category Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-base">🧃</span>
                            <h3 className="font-mono font-bold text-sm text-stone-900">{recipe.name}</h3>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${categoryColor}`}
                            >
                              {categoryLabel}
                            </span>
                            {inInventory > 0 && (
                              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                                In Inventory: {inInventory}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-mono font-bold text-sm text-emerald-800">
                            ${recipe.bottleValue}
                          </span>
                          <div className="text-[10px] font-mono text-stone-400">per bottle</div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs font-mono text-stone-600 mt-2 leading-relaxed">
                        {recipe.description}
                      </p>

                      {/* Required Ingredients */}
                      <div className="mt-3 bg-stone-50/90 border border-stone-200 rounded p-2 text-xs font-mono space-y-1">
                        <div className="text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                          Required Ingredients ({recipe.ingredients.length} Varieties):
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1">
                          {recipe.ingredients.map((ing) => {
                            const info = PRODUCE_CATALOG[ing.fruitType];
                            const stock = basket[ing.fruitType] || 0;
                            const hasEnough = stock >= ing.amount;

                            return (
                              <div
                                key={ing.fruitType}
                                className={`flex items-center justify-between text-[11px] px-1.5 py-0.5 rounded ${
                                  hasEnough ? 'bg-emerald-50/70 text-emerald-900' : 'bg-rose-50/60 text-rose-900'
                                }`}
                              >
                                <span className="flex items-center gap-1 truncate">
                                  <span>{info.symbol}</span>
                                  <span className="font-medium truncate">{ing.amount}x {info.name}</span>
                                </span>
                                <span className="font-bold tabular-nums shrink-0 ml-1">
                                  ({stock})
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-3.5 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
                      <span className="text-xs font-mono text-stone-600">
                        Can Juice: <strong className={canCraft ? 'text-emerald-700' : 'text-stone-400'}>{maxCraftable}</strong>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onCraftProduct(recipe, 1)}
                          disabled={!canCraft}
                          className={`px-3 py-1 font-mono text-xs font-bold rounded transition-all cursor-pointer flex items-center gap-1 ${
                            canCraft
                              ? 'bg-amber-700 hover:bg-amber-800 active:scale-95 text-white shadow-2xs'
                              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                          }`}
                          title={canCraft ? `Craft 1 ${recipe.outputName} into inventory` : 'Insufficient ingredients'}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Juice 1</span>
                        </button>

                        {maxCraftable > 1 && (
                          <button
                            onClick={() => onCraftProduct(recipe, maxCraftable)}
                            className="px-3 py-1 font-mono text-xs font-bold bg-stone-800 hover:bg-stone-900 active:scale-95 text-white rounded transition-all shadow-2xs cursor-pointer"
                            title={`Juice all ${maxCraftable} bottles into inventory`}
                          >
                            All ({maxCraftable})
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Plaque Footer */}
        <div className="w-full max-w-3xl mt-4 pt-3 border-t border-amber-900/20 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-stone-600">
          <div className="flex items-center gap-3">
            <span>
              Recipes Discovered: <strong className="text-amber-900 font-bold">{discoveredRecipes.length}</strong> / {CRAFTING_RECIPES.length}
            </span>
            <span>·</span>
            <span>
              Bottles Juiced: <strong className="text-stone-900 font-bold">{cidersPressed}</strong>
            </span>
            <span>·</span>
            <span>
              Bottles in Pantry: <strong className="text-emerald-800 font-bold">{totalJuiceCount}</strong>
            </span>
          </div>

          <button
            onClick={handleDismiss}
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-mono text-xs font-semibold rounded shadow-2xs transition-colors cursor-pointer"
          >
            Return to Farmhouse
          </button>
        </div>
      </div>
    </div>
  );
};
