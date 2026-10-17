import React from 'react';
import { Plus, Trash2, Wheat, Scale } from 'lucide-react';
import { IngredientItem } from '../types';
import { scaleQuantityText, formatRs } from '../utils/scaler';

interface IngredientsSectionProps {
  ingredients: IngredientItem[];
  multiplier: number;
  onUpdateIngredient: (id: string, field: keyof IngredientItem, value: any) => void;
  onAddIngredient: () => void;
  onRemoveIngredient: (id: string) => void;
}

export const IngredientsSection: React.FC<IngredientsSectionProps> = ({
  ingredients,
  multiplier,
  onUpdateIngredient,
  onAddIngredient,
  onRemoveIngredient,
}) => {
  const totalBaseDirect = ingredients.reduce((sum, ing) => sum + (Number(ing.baseCost) || 0), 0);
  const totalScaledDirect = totalBaseDirect * multiplier;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden mb-6">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-stone-50 via-amber-50/40 to-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-600/10 text-amber-800 flex items-center justify-center">
            <Wheat className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                Section 2: Direct Ingredients
              </h2>
              <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                {ingredients.length} items
              </span>
            </div>
            <p className="text-xs text-stone-500 font-normal">
              Direct entry enabled for free typing. Numbers in quantities scale automatically.
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-semibold text-stone-500">Scaled Direct Cost</div>
          <div className="text-base font-extrabold text-amber-900">
            {formatRs(totalScaledDirect)}
            {multiplier !== 1 && (
              <span className="text-xs font-normal text-stone-400 ml-1.5">
                (Base: {formatRs(totalBaseDirect)})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body: Responsive Table / Item Rows */}
      <div className="p-4 sm:p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="pb-2.5 pl-2 font-semibold">Ingredient Name (Free-Text)</th>
                <th className="pb-2.5 px-2 font-semibold">Base Qty/Weight &amp; Scaled</th>
                <th className="pb-2.5 px-2 font-semibold">Base Cost (Rs) &amp; Scaled</th>
                <th className="pb-2.5 pr-2 text-center font-semibold w-12">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {ingredients.map((ing, idx) => {
                const scaledQty = scaleQuantityText(ing.baseQty, multiplier);
                const scaledCost = (Number(ing.baseCost) || 0) * multiplier;

                return (
                  <tr key={ing.id} className="hover:bg-amber-50/30 transition-colors group">
                    {/* Ingredient Name */}
                    <td className="py-2.5 pl-2 pr-2 align-top">
                      <input
                        id={`ingredient-name-${idx}`}
                        type="text"
                        value={ing.name}
                        onChange={(e) => onUpdateIngredient(ing.id, 'name', e.target.value)}
                        placeholder="e.g., Wheat flour, Butter, Eggs"
                        className="w-full text-xs sm:text-sm font-medium text-stone-800 bg-white border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                      />
                    </td>

                    {/* Base Qty / Weight + Scaled Preview */}
                    <td className="py-2.5 px-2 align-top">
                      <div className="flex flex-col gap-1">
                        <input
                          id={`ingredient-qty-${idx}`}
                          type="text"
                          value={ing.baseQty}
                          onChange={(e) => onUpdateIngredient(ing.id, 'baseQty', e.target.value)}
                          placeholder="e.g., 1.5 kg, 500 g, 4 eggs"
                          className="w-full text-xs sm:text-sm font-medium text-stone-800 bg-white border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                        />
                        {multiplier !== 1 && (
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200 w-fit">
                            <Scale className="w-3 h-3 flex-shrink-0" />
                            <span>Scaled ({multiplier}x): <strong>{scaledQty}</strong></span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Base Cost (Rs) + Scaled Cost */}
                    <td className="py-2.5 px-2 align-top">
                      <div className="flex flex-col gap-1">
                        <div className="relative">
                          <span className="absolute left-2.5 top-2 text-xs font-bold text-stone-400">Rs</span>
                          <input
                            id={`ingredient-cost-${idx}`}
                            type="number"
                            min="0"
                            step="1"
                            value={ing.baseCost || ''}
                            onChange={(e) =>
                              onUpdateIngredient(ing.id, 'baseCost', parseFloat(e.target.value) || 0)
                            }
                            placeholder="0"
                            className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm font-bold text-stone-800 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                          />
                        </div>
                        {multiplier !== 1 && (
                          <div className="text-[11px] font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 w-fit">
                            Scaled: <strong>{formatRs(scaledCost)}</strong>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Remove Action */}
                    <td className="py-2.5 pr-2 pl-2 text-center align-top">
                      <button
                        type="button"
                        id={`remove-ingredient-${idx}`}
                        onClick={() => onRemoveIngredient(ing.id)}
                        className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-rose-100 text-stone-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                        title="Remove ingredient"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Add Row Button */}
        <div className="mt-3.5 pt-2 border-t border-stone-100 flex items-center justify-between">
          <button
            id="add-ingredient-btn"
            type="button"
            onClick={onAddIngredient}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-900 bg-amber-100/70 hover:bg-amber-200/70 border border-amber-300 rounded-lg transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Ingredient (Support 7+ Items)</span>
          </button>

          <span className="text-[11px] text-stone-400">
            Total Base Direct: {formatRs(totalBaseDirect)}
          </span>
        </div>
      </div>
    </div>
  );
};
