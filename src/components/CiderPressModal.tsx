import React from 'react';
import { FruitType, CraftRecipe } from '../types';
import { CRAFTING_RECIPES } from '../constants/gameData';
import { PRODUCE_CATALOG } from '../constants/produce';
import { X, Wine } from 'lucide-react';

interface CiderPressModalProps {
  isOpen: boolean;
  onClose: () => void;
  basket: Record<FruitType, number>;
  onCraftProduct: (recipe: CraftRecipe, quantity: number) => void;
  cidersPressed: number;
}

export const CiderPressModal: React.FC<CiderPressModalProps> = ({
  isOpen,
  onClose,
  basket,
  onCraftProduct,
  cidersPressed,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs select-none">
      <div className="bg-[#fcfbf9] border border-stone-300 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-stone-200 flex items-center justify-between bg-stone-100/70">
          <div>
            <h2 className="text-xl md:text-2xl font-bold font-mono text-stone-900 flex items-center gap-2">
              <Wine className="w-5 h-5 text-amber-700" />
              Farmhouse Cider Press & Pantry
            </h2>
            <p className="text-xs font-mono text-stone-600 mt-1">
              Press raw harvested fruit into artisanal ciders, perries, and cordials for 3x–4x market value!
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recipes Grid */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CRAFTING_RECIPES.map((recipe) => {
              const inStock = basket[recipe.fruitType] || 0;
              const maxPressable = Math.floor(inStock / recipe.fruitRequired);
              const fruitInfo = PRODUCE_CATALOG[recipe.fruitType];

              return (
                <div
                  key={recipe.id}
                  className="bg-white border border-stone-200 rounded-lg p-4 flex flex-col justify-between shadow-2xs hover:border-amber-400 transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-mono font-bold text-sm text-stone-900">{recipe.name}</h3>
                      <span className="font-mono font-bold text-sm text-emerald-800 shrink-0">
                        ${recipe.bottleValue}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-stone-500 mt-1">{recipe.description}</p>
                    <div className="mt-3 flex items-center justify-between text-xs font-mono bg-stone-50 p-2 rounded border border-stone-200">
                      <span className="text-stone-600">
                        Requires: {recipe.fruitRequired}x {fruitInfo.symbol} {fruitInfo.name}
                      </span>
                      <span
                        className={`font-semibold ${
                          inStock >= recipe.fruitRequired ? 'text-emerald-700' : 'text-stone-400'
                        }`}
                      >
                        In Inventory: {inStock}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
                    <span className="text-xs font-mono text-stone-500">
                      Can Press: <strong>{maxPressable}</strong>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onCraftProduct(recipe, 1)}
                        disabled={maxPressable < 1}
                        className={`px-3 py-1 font-mono text-xs font-semibold rounded transition-all cursor-pointer ${
                          maxPressable >= 1
                            ? 'bg-amber-700 hover:bg-amber-800 text-white shadow-2xs active:scale-95'
                            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        }`}
                      >
                        Press 1
                      </button>
                      {maxPressable > 1 && (
                        <button
                          onClick={() => onCraftProduct(recipe, maxPressable)}
                          className="px-3 py-1 font-mono text-xs font-semibold bg-stone-800 hover:bg-stone-900 text-white rounded transition-all shadow-2xs active:scale-95 cursor-pointer"
                        >
                          All ({maxPressable})
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs font-mono text-stone-600">
          <span>
            Bottles Pressed to Date: <strong className="text-stone-800">{cidersPressed}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 text-white font-medium rounded hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Return to Orchard
          </button>
        </div>
      </div>
    </div>
  );
};
