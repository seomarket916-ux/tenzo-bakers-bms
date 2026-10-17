import React from 'react';
import { Recipe, MasterIngredient, RecipeIngredientRow, OverheadExpense, CalculationBreakdown, UOM } from '../types';
import {
  UOM_OPTIONS,
  calculateIngredientCost,
  formatRs,
  formatNumber,
  formatPercent,
  getUomLabel,
} from '../utils/bmsEngine';
import {
  Plus,
  Trash2,
  Sliders,
  DollarSign,
  TrendingUp,
  Percent,
  Flame,
  Scale,
  Sparkles,
  Layers,
  ArrowRight,
  Info,
  Check,
  Zap,
} from 'lucide-react';

interface RecipeCostingTabProps {
  recipe: Recipe;
  recipesList: Recipe[];
  activeRecipeId: string;
  inventory: MasterIngredient[];
  calculations: CalculationBreakdown;
  onSelectRecipe: (id: string) => void;
  onCreateNewRecipe: () => void;
  onUpdateRecipeField: (field: keyof Recipe, value: any) => void;
  onUpdateIngredientRow: (id: string, field: keyof RecipeIngredientRow, value: any) => void;
  onAddIngredientRow: () => void;
  onRemoveIngredientRow: (id: string) => void;
  onUpdateOverheadRow: (id: string, field: keyof OverheadExpense, value: any) => void;
  onAddOverheadRow: () => void;
  onRemoveOverheadRow: (id: string) => void;
}

export const RecipeCostingTab: React.FC<RecipeCostingTabProps> = ({
  recipe,
  recipesList,
  activeRecipeId,
  inventory,
  calculations,
  onSelectRecipe,
  onCreateNewRecipe,
  onUpdateRecipeField,
  onUpdateIngredientRow,
  onAddIngredientRow,
  onRemoveIngredientRow,
  onUpdateOverheadRow,
  onAddOverheadRow,
  onRemoveOverheadRow,
}) => {
  const mult = recipe.batchMultiplier || 1;
  const isProfitable = calculations.netProfit >= 0;
  const inventoryMap = new Map<string, MasterIngredient>(inventory.map((item) => [item.id, item]));

  const MULTIPLIER_PRESETS = [0.5, 1.0, 1.5, 2.0, 3.0];

  return (
    <div className="space-y-6">
      {/* RECIPE SELECTION & BATCH MULTIPLIER BAR */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-stone-100">
          {/* Recipe Switcher & Name */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Tab 2 • Recipe Engine
              </span>
              <span className="text-xs text-stone-500 font-medium">Select Recipe Preset:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {recipesList.map((rec) => (
                  <button
                    key={rec.id}
                    onClick={() => onSelectRecipe(rec.id)}
                    className={`text-xs px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                      activeRecipeId === rec.id
                        ? 'bg-[#78350f] text-white shadow-sm ring-2 ring-amber-400'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    {rec.name}
                  </button>
                ))}
                <button
                  onClick={onCreateNewRecipe}
                  className="text-xs px-3 py-1 rounded-full font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-all cursor-pointer"
                >
                  + New Recipe
                </button>
              </div>
            </div>

            <div className="mt-3">
              <label htmlFor="recipe-title-input" className="block text-xs font-bold text-stone-700 mb-1">
                Recipe / Item Name
              </label>
              <input
                id="recipe-title-input"
                type="text"
                value={recipe.name}
                onChange={(e) => onUpdateRecipeField('name', e.target.value)}
                placeholder="e.g. Butter Cake 6kg Batch, Sweet Bun..."
                className="w-full text-base font-bold text-stone-900 bg-white border border-stone-200 rounded-lg px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Batch Scaling Multiplier Controls */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 lg:w-[380px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-700" />
                Batch Scaling Multiplier
              </span>
              <span className="text-xs font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md font-mono">
                {formatNumber(mult, 2)}x Scale
              </span>
            </div>

            <div className="flex items-center gap-1.5 mb-3">
              {MULTIPLIER_PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => onUpdateRecipeField('batchMultiplier', p)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    mult === p
                      ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-300'
                      : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-200'
                  }`}
                >
                  {p}x
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-medium">Custom:</span>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={recipe.batchMultiplier}
                onChange={(e) =>
                  onUpdateRecipeField('batchMultiplier', Math.max(0.01, parseFloat(e.target.value) || 1))
                }
                className="flex-1 text-xs font-bold text-stone-900 bg-white border border-stone-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
              <span className="text-xs font-semibold text-stone-400">multiplier</span>
            </div>
          </div>
        </div>

        {/* TOP FINANCIAL KPI SNAPSHOT */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-5">
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 block">Direct Cost</span>
            <div className="text-sm sm:text-base font-extrabold text-stone-900 font-mono mt-0.5">
              {formatRs(calculations.scaledDirectCost)}
            </div>
            <span className="text-[10px] text-stone-400 font-mono">
              Base: {formatRs(calculations.baseDirectCost)}
            </span>
          </div>

          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 block">Overhead Cost</span>
            <div className="text-sm sm:text-base font-extrabold text-stone-900 font-mono mt-0.5">
              {formatRs(calculations.scaledIndirectCost)}
            </div>
            <span className="text-[10px] text-stone-400 font-mono">
              Fixed &amp; Var
            </span>
          </div>

          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 block">Total Cost</span>
            <div className="text-sm sm:text-base font-extrabold text-amber-950 font-mono mt-0.5">
              {formatRs(calculations.totalProductionCost)}
            </div>
            <span className="text-[10px] text-stone-400 font-mono">
              Direct + Indirect
            </span>
          </div>

          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 block">Total Revenue</span>
            <div className="text-sm sm:text-base font-extrabold text-stone-900 font-mono mt-0.5">
              {formatRs(calculations.totalRevenue)}
            </div>
            <span className="text-[10px] text-stone-400 font-mono">
              {formatNumber(calculations.scaledOutcomeQty)} {recipe.outcomeUnitType}
            </span>
          </div>

          {/* NET PROFIT (GREEN/RED) */}
          <div
            className={`rounded-xl p-3 border ${
              isProfitable
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}
          >
            <span
              className={`text-[11px] font-bold block ${
                isProfitable ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              Net Profit
            </span>
            <div className="text-sm sm:text-base font-black font-mono mt-0.5">
              {formatRs(calculations.netProfit)}
            </div>
            <span
              className={`text-[10px] font-bold ${
                isProfitable ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {isProfitable ? '▲ Profitable' : '▼ Loss Alert'}
            </span>
          </div>

          {/* GROSS MARGIN % */}
          <div
            className={`rounded-xl p-3 border ${
              isProfitable
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}
          >
            <span
              className={`text-[11px] font-bold block ${
                isProfitable ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              Gross Margin
            </span>
            <div className="text-sm sm:text-base font-black font-mono mt-0.5">
              {formatPercent(calculations.grossMarginPercent)}
            </div>
            <span className="text-[10px] text-stone-500 font-mono">
              {formatRs(calculations.costPerUnit)}/unit cost
            </span>
          </div>
        </div>
      </div>

      {/* 2. DIRECT INGREDIENTS SECTION */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-50 via-amber-50/40 to-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-800 text-white flex items-center justify-center text-xs">
                2
              </span>
              Direct Ingredients Section (Pulled Live from Tab 1)
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Select ingredients from Master Inventory. The system automatically fetches bulk unit price and calculates ingredient cost.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs font-bold text-stone-600">
              Direct Cost: <span className="text-amber-900 font-extrabold">{formatRs(calculations.scaledDirectCost)}</span>
            </div>
            <button
              onClick={onAddIngredientRow}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#78350f] hover:bg-[#92400e] text-white transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Ingredient Row</span>
            </button>
          </div>
        </div>

        {/* Ingredients Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100/90 text-stone-700 font-bold border-b border-stone-200 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 sm:px-4 w-12 text-center">#</th>
                <th className="py-3 px-3 sm:px-4 min-w-[220px]">Master Ingredient (from Tab 1)</th>
                <th className="py-3 px-3 sm:px-4 min-w-[130px]">Quantity Needed</th>
                <th className="py-3 px-3 sm:px-4 min-w-[110px]">Recipe UOM</th>
                <th className="py-3 px-3 sm:px-4 min-w-[150px]">Master Unit Cost</th>
                <th className="py-3 px-3 sm:px-4 min-w-[140px] bg-amber-50/70 text-amber-950">
                  Base Cost (1x)
                </th>
                <th className="py-3 px-3 sm:px-4 min-w-[140px] bg-amber-100/50 text-amber-950">
                  Scaled Cost ({mult}x)
                </th>
                <th className="py-3 px-3 sm:px-4 w-14 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recipe.ingredients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-stone-400">
                    No ingredients added yet. Click "+ Add Ingredient Row" above.
                  </td>
                </tr>
              ) : (
                recipe.ingredients.map((row, idx) => {
                  const master = inventoryMap.get(row.masterIngredientId);
                  const isAvailable = !!master;
                  const calc = isAvailable
                    ? calculateIngredientCost(row.quantityNeeded, row.uom, master)
                    : { masterUnitPrice: 0, effectiveQtyInMasterUom: 0, baseCost: 0 };
                  const scaledCost = calc.baseCost * mult;

                  return (
                    <tr key={row.id} className="hover:bg-amber-50/20 transition-colors">
                      <td className="py-3 px-3 sm:px-4 text-center text-stone-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>

                      {/* Master Item Dropdown */}
                      <td className="py-3 px-3 sm:px-4">
                        <select
                          value={row.masterIngredientId}
                          onChange={(e) => onUpdateIngredientRow(row.id, 'masterIngredientId', e.target.value)}
                          className="w-full text-xs font-bold text-stone-800 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
                        >
                          <option value="" disabled>
                            -- Select Master Ingredient --
                          </option>
                          {inventory.map((inv) => (
                            <option key={inv.id} value={inv.id}>
                              {inv.name} ({getUomLabel(inv.uom)})
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Quantity Needed */}
                      <td className="py-3 px-3 sm:px-4">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={row.quantityNeeded}
                          onChange={(e) =>
                            onUpdateIngredientRow(
                              row.id,
                              'quantityNeeded',
                              Math.max(0, parseFloat(e.target.value) || 0)
                            )
                          }
                          className="w-full text-xs font-bold text-stone-900 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        />
                      </td>

                      {/* Recipe UOM Selector */}
                      <td className="py-3 px-3 sm:px-4">
                        <select
                          value={row.uom}
                          onChange={(e) =>
                            onUpdateIngredientRow(row.id, 'uom', e.target.value as UOM)
                          }
                          className="w-full text-xs font-semibold text-stone-800 bg-white border border-stone-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                        >
                          {UOM_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.symbol}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Master Unit Cost */}
                      <td className="py-3 px-3 sm:px-4 text-stone-600 font-mono">
                        {isAvailable ? (
                          <div>
                            <span className="font-bold text-stone-900">
                              {formatRs(calc.masterUnitPrice)}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              {' '}/ {getUomLabel(master.uom)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-rose-500 text-[11px] font-semibold">Select item</span>
                        )}
                      </td>

                      {/* Base Cost (1x) */}
                      <td className="py-3 px-3 sm:px-4 font-mono font-bold text-stone-900 bg-amber-50/40">
                        {formatRs(calc.baseCost)}
                      </td>

                      {/* Scaled Cost (multiplier x) */}
                      <td className="py-3 px-3 sm:px-4 font-mono font-extrabold text-amber-950 bg-amber-100/30">
                        {formatRs(scaledCost)}
                      </td>

                      {/* Delete */}
                      <td className="py-3 px-3 sm:px-4 text-center">
                        <button
                          onClick={() => onRemoveIngredientRow(row.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer row with examples */}
        <div className="p-3.5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-2 flex-wrap text-[11px]">
            <span className="font-bold text-stone-700">Formulas:</span>
            <span>1.5 kg Wheat Flour @ 200 Rs/kg = Rs 300</span>
            <span>•</span>
            <span>1.5 kg Sugar @ 160 Rs/kg = Rs 240</span>
            <span>•</span>
            <span>30 Eggs @ 30 Rs/egg = Rs 900</span>
          </div>
          <button
            onClick={onAddIngredientRow}
            className="text-amber-900 font-bold hover:underline cursor-pointer"
          >
            + Add Another Ingredient
          </button>
        </div>
      </div>

      {/* 3. INDIRECT OVERHEAD ALLOCATION (INDIRECT COSTS) */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-50 via-amber-50/40 to-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-800 text-white flex items-center justify-center text-xs">
                3
              </span>
              Indirect Overhead Allocation (Fixed vs Variable)
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Variable overheads scale with the batch multiplier; Fixed overheads remain constant regardless of batch size.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs font-bold text-stone-600">
              Total Overheads: <span className="text-amber-900 font-extrabold">{formatRs(calculations.scaledIndirectCost)}</span>
            </div>
            <button
              onClick={onAddOverheadRow}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#78350f] hover:bg-[#92400e] text-white transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Overhead Row</span>
            </button>
          </div>
        </div>

        {/* Overheads Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100/90 text-stone-700 font-bold border-b border-stone-200 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 sm:px-4 w-12 text-center">#</th>
                <th className="py-3 px-3 sm:px-4 min-w-[240px]">Expense Name / Description</th>
                <th className="py-3 px-3 sm:px-4 min-w-[160px]">Base Cost in Rs</th>
                <th className="py-3 px-3 sm:px-4 min-w-[180px]">Cost Behavior (Toggle)</th>
                <th className="py-3 px-3 sm:px-4 min-w-[150px] bg-amber-50/70 text-amber-950">
                  Scaled Cost ({mult}x)
                </th>
                <th className="py-3 px-3 sm:px-4 w-14 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recipe.overheads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-stone-400">
                    No overhead expenses added. Click "+ Add Overhead Row" above.
                  </td>
                </tr>
              ) : (
                recipe.overheads.map((ovh, idx) => {
                  const baseCost = Number(ovh.cost) || 0;
                  const scaledCost = ovh.isVariable ? baseCost * mult : baseCost;

                  return (
                    <tr key={ovh.id} className="hover:bg-amber-50/20 transition-colors">
                      <td className="py-3 px-3 sm:px-4 text-center text-stone-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>

                      {/* Expense Name */}
                      <td className="py-3 px-3 sm:px-4">
                        <input
                          type="text"
                          value={ovh.name}
                          onChange={(e) => onUpdateOverheadRow(ovh.id, 'name', e.target.value)}
                          placeholder="e.g. Electricity, Gas, Baker Salary, Packaging..."
                          className="w-full text-xs font-semibold text-stone-900 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        />
                      </td>

                      {/* Base Cost in Rs */}
                      <td className="py-3 px-3 sm:px-4">
                        <div className="relative flex items-center">
                          <span className="absolute left-2.5 text-stone-400 font-bold text-xs">Rs</span>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={ovh.cost}
                            onChange={(e) =>
                              onUpdateOverheadRow(
                                ovh.id,
                                'cost',
                                Math.max(0, parseFloat(e.target.value) || 0)
                              )
                            }
                            className="w-full pl-8 pr-2.5 py-1.5 text-xs font-bold text-stone-900 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                          />
                        </div>
                      </td>

                      {/* Fixed vs Variable Toggle */}
                      <td className="py-3 px-3 sm:px-4">
                        <button
                          type="button"
                          onClick={() => onUpdateOverheadRow(ovh.id, 'isVariable', !ovh.isVariable)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                            ovh.isVariable
                              ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                              : 'bg-stone-100 text-stone-700 border-stone-300'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              ovh.isVariable ? 'bg-amber-600' : 'bg-stone-400'
                            }`}
                          />
                          <span>{ovh.isVariable ? 'Variable (Scales with Multiplier)' : 'Fixed (Stays Constant)'}</span>
                        </button>
                      </td>

                      {/* Scaled Cost */}
                      <td className="py-3 px-3 sm:px-4 font-mono font-extrabold text-amber-950 bg-amber-50/50">
                        {formatRs(scaledCost)}
                        <span className="block text-[10px] font-normal text-stone-400">
                          {ovh.isVariable ? `(${baseCost} × ${mult}x)` : '(Fixed at base)'}
                        </span>
                      </td>

                      {/* Delete */}
                      <td className="py-3 px-3 sm:px-4 text-center">
                        <button
                          onClick={() => onRemoveOverheadRow(ovh.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove overhead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. BATCH OUTCOME & PROFIT ANALYSIS */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-50 via-amber-50/40 to-stone-50 border-b border-stone-200">
          <h3 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-800 text-white flex items-center justify-center text-xs">
              4
            </span>
            Batch Outcome, Evaporation Shrinkage &amp; Selling Setup
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Record raw batter weight versus finished baked weight to monitor baking shrinkage loss, configure selling price, and calculate net profitability.
          </p>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Baking Shrinkage & Evaporation Loss Engine */}
          <div className="bg-amber-50/50 rounded-xl p-4 sm:p-5 border border-amber-200/70">
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-700" />
                Raw Batter vs Finished Product Evaporation Loss
              </span>
              <span className="text-xs font-extrabold text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-md font-mono">
                {formatPercent(calculations.shrinkagePercent)} Baking Shrinkage Loss
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Raw Batter / Dough Weight (kg) [Base 1x]
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={recipe.rawBatterWeight}
                    onChange={(e) =>
                      onUpdateRecipeField('rawBatterWeight', Math.max(0, parseFloat(e.target.value) || 0))
                    }
                    className="w-full text-xs font-bold text-stone-900 bg-white border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 font-semibold">
                    kg
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Scaled ({mult}x): {formatNumber(calculations.rawBatterWeight, 2)} kg
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Finished Product Baked Weight (kg) [Base 1x]
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={recipe.finishedProductWeight}
                    onChange={(e) =>
                      onUpdateRecipeField('finishedProductWeight', Math.max(0, parseFloat(e.target.value) || 0))
                    }
                    className="w-full text-xs font-bold text-stone-900 bg-white border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 font-semibold">
                    kg
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Scaled ({mult}x): {formatNumber(calculations.finishedProductWeight, 2)} kg
                </span>
              </div>

              <div className="bg-white rounded-lg p-3 border border-amber-200 flex flex-col justify-center">
                <span className="text-[11px] font-semibold text-stone-500">Evaporation Moisture Loss</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-lg font-black text-amber-950 font-mono">
                    {formatNumber(Math.max(0, calculations.rawBatterWeight - calculations.finishedProductWeight), 2)} kg
                  </span>
                  <span className="text-xs font-bold text-amber-700">
                    ({formatPercent(calculations.shrinkagePercent)})
                  </span>
                </div>
                <span className="text-[10px] text-stone-400">
                  Formula: ((Raw - Finished) ÷ Raw) × 100
                </span>
              </div>
            </div>
          </div>

          {/* Outcome Units & Selling Price Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Total Outcome Quantity (Base 1x)
              </label>
              <input
                type="number"
                min="0.1"
                step="any"
                value={recipe.outcomeQuantity}
                onChange={(e) =>
                  onUpdateRecipeField('outcomeQuantity', Math.max(0.1, parseFloat(e.target.value) || 1))
                }
                className="w-full text-sm font-extrabold text-stone-900 bg-white border border-stone-200 rounded-lg px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
              <span className="text-[10px] text-stone-500 font-mono mt-1 block">
                Current Scaled Yield: {formatNumber(calculations.scaledOutcomeQty, 2)} {recipe.outcomeUnitType}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Outcome Unit of Sale
              </label>
              <input
                type="text"
                value={recipe.outcomeUnitType}
                onChange={(e) => onUpdateRecipeField('outcomeUnitType', e.target.value)}
                placeholder="e.g. kg, pieces, loaves, boxes"
                className="w-full text-sm font-semibold text-stone-900 bg-white border border-stone-200 rounded-lg px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Free-text (e.g. kg, pieces, loaves)
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Selling Price per {recipe.outcomeUnitType || 'Unit'} in Rs
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-stone-400 font-bold text-xs">Rs</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={recipe.sellingPricePerUnit}
                  onChange={(e) =>
                    onUpdateRecipeField('sellingPricePerUnit', Math.max(0, parseFloat(e.target.value) || 0))
                  }
                  className="w-full pl-9 pr-3 py-2 text-sm font-black text-stone-900 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
              <span className="text-[10px] text-stone-500 font-mono mt-1 block">
                e.g. 1200 Rs/kg
              </span>
            </div>
          </div>

          {/* LIVE COMPREHENSIVE FINANCIAL SUMMARY TABLE */}
          <div className="border border-stone-200 rounded-xl overflow-hidden">
            <div className="bg-stone-50 px-4 py-3 border-b border-stone-200 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Production Financial Breakdown ({mult}x Batch)
              </span>
              <span className="text-xs font-semibold text-stone-500 font-mono">
                Tenzo Cafe and Bakers Commercial Costing
              </span>
            </div>

            <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Cost Summary Column */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-600">Direct Ingredients Cost:</span>
                  <span className="font-mono font-bold text-stone-900">
                    {formatRs(calculations.scaledDirectCost)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-600">Indirect Overhead Allocation:</span>
                  <span className="font-mono font-bold text-stone-900">
                    {formatRs(calculations.scaledIndirectCost)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b-2 border-stone-800 bg-amber-50/60 px-2 rounded">
                  <span className="font-bold text-stone-900">Total Production Cost:</span>
                  <span className="font-mono font-black text-amber-950 text-sm">
                    {formatRs(calculations.totalProductionCost)}
                  </span>
                </div>
                <div className="flex justify-between py-1 text-stone-600">
                  <span>Unit Production Cost (Cost per {recipe.outcomeUnitType}):</span>
                  <span className="font-mono font-bold text-stone-800">
                    {formatRs(calculations.costPerUnit)} / {recipe.outcomeUnitType}
                  </span>
                </div>
              </div>

              {/* Revenue & Profit Column */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-600">
                    Total Outcome Quantity:
                  </span>
                  <span className="font-mono font-bold text-stone-900">
                    {formatNumber(calculations.scaledOutcomeQty, 2)} {recipe.outcomeUnitType}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-600">Gross Sales Revenue:</span>
                  <span className="font-mono font-bold text-stone-900">
                    {formatRs(calculations.totalRevenue)}
                  </span>
                </div>
                <div
                  className={`flex justify-between py-1.5 border-b-2 px-2 rounded ${
                    isProfitable
                      ? 'bg-emerald-100/70 border-emerald-700 text-emerald-950'
                      : 'bg-rose-100/70 border-rose-700 text-rose-950'
                  }`}
                >
                  <span className="font-extrabold text-sm">
                    Net Profit (Revenue - Cost):
                  </span>
                  <span className="font-mono font-black text-base">
                    {formatRs(calculations.netProfit)}
                  </span>
                </div>
                <div className="flex justify-between py-1 text-stone-600">
                  <span>Gross Profit Margin:</span>
                  <span
                    className={`font-mono font-extrabold ${
                      isProfitable ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {formatPercent(calculations.grossMarginPercent)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
