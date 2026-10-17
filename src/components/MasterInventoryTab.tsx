import React, { useState } from 'react';
import { MasterIngredient, UOM } from '../types';
import { UOM_OPTIONS, calculateMasterUnitPrice, formatRs, getUomLabel } from '../utils/bmsEngine';
import { Plus, Trash2, Search, PackageCheck, AlertCircle, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface MasterInventoryTabProps {
  inventory: MasterIngredient[];
  onAddIngredient: () => void;
  onUpdateIngredient: (id: string, field: keyof MasterIngredient, value: any) => void;
  onRemoveIngredient: (id: string) => void;
  onResetDefaultCatalog: () => void;
}

export const MasterInventoryTab: React.FC<MasterInventoryTabProps> = ({
  inventory,
  onAddIngredient,
  onUpdateIngredient,
  onRemoveIngredient,
  onResetDefaultCatalog,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Intro Banner with Examples */}
      <div className="bg-gradient-to-r from-amber-900 via-[#78350f] to-amber-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-amber-800/60 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-amber-300/30">
                <PackageCheck className="w-3.5 h-3.5" />
                Tab 1 • Purchase Database
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Outfit',sans-serif] tracking-tight">
                Master Ingredient Inventory
              </h2>
              <p className="text-amber-100/85 text-xs sm:text-sm mt-1 max-w-2xl font-['Plus_Jakarta_Sans',sans-serif]">
                Maintain bulk purchase pricing and packaging quantities. Every price updated here immediately synchronizes with all recipes in Tab 2 in real time.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                id="reset-catalog-btn"
                onClick={onResetDefaultCatalog}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
                title="Reset inventory items to Tenzo Cafe standards"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
              <button
                id="add-inventory-btn"
                onClick={onAddIngredient}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-amber-950 border border-amber-300 transition-all shadow-md shadow-amber-950/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Master Ingredient</span>
              </button>
            </div>
          </div>

          {/* Quick reference metrics and formula box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-amber-700/40 text-xs">
            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs border border-white/10">
              <span className="text-amber-200/80 font-medium block">Wheat Flour Mill</span>
              <span className="text-white font-bold text-sm">50 kg @ Rs 9,750 = Rs 195/kg</span>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs border border-white/10">
              <span className="text-amber-200/80 font-medium block">Sugar</span>
              <span className="text-white font-bold text-sm">50 kg @ Rs 11,600 = Rs 232/kg</span>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs border border-white/10">
              <span className="text-amber-200/80 font-medium block">Beehive Margarine</span>
              <span className="text-white font-bold text-sm">20 kg @ Rs 20,400 = Rs 1,020/kg</span>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs border border-white/10">
              <span className="text-amber-200/80 font-medium block">Hycho Shortening</span>
              <span className="text-white font-bold text-sm">20 kg @ Rs 10,750 = Rs 537.50/kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table Container */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-stone-100 bg-stone-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="search-inventory-input"
                type="text"
                placeholder="Search ingredients or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs font-medium text-stone-800 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
            <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">
              {filteredInventory.length} items
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-stone-500">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> LocalStorage Auto-Saved
            </span>
            <span className="hidden md:inline text-stone-400">•</span>
            <span className="hidden md:inline">Formula: Unit Price = Bulk Price ÷ Bulk Qty</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100/90 text-stone-700 font-bold border-b border-stone-200 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 sm:px-4 w-12 text-center">#</th>
                <th className="py-3 px-3 sm:px-4 min-w-[200px]">Ingredient Name</th>
                <th className="py-3 px-3 sm:px-4 min-w-[130px]">Bulk Package Qty</th>
                <th className="py-3 px-3 sm:px-4 min-w-[150px]">Unit of Measurement [UOM]</th>
                <th className="py-3 px-3 sm:px-4 min-w-[150px]">Total Bulk Price (Rs)</th>
                <th className="py-3 px-3 sm:px-4 min-w-[160px] bg-amber-50/70 text-amber-950">
                  Calculated Unit Price
                </th>
                <th className="py-3 px-3 sm:px-4 w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-stone-400">
                    No ingredients match your search. Click "+ Add Master Ingredient" to create one.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item, index) => {
                  const unitPrice = calculateMasterUnitPrice(item.bulkPrice, item.bulkQuantity);
                  const uomLabel = getUomLabel(item.uom);

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-amber-50/30 transition-colors group"
                      id={`inventory-row-${item.id}`}
                    >
                      <td className="py-3 px-3 sm:px-4 text-center text-stone-400 font-mono text-[11px]">
                        {index + 1}
                      </td>

                      {/* Ingredient Name */}
                      <td className="py-3 px-3 sm:px-4">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => onUpdateIngredient(item.id, 'name', e.target.value)}
                          placeholder="e.g. Wheat Flour, Sugar..."
                          className="w-full text-xs font-semibold text-stone-900 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        />
                      </td>

                      {/* Bulk Package Quantity */}
                      <td className="py-3 px-3 sm:px-4">
                        <div className="relative">
                          <input
                            type="number"
                            min="0.01"
                            step="any"
                            value={item.bulkQuantity}
                            onChange={(e) =>
                              onUpdateIngredient(
                                item.id,
                                'bulkQuantity',
                                Math.max(0.001, parseFloat(e.target.value) || 0)
                              )
                            }
                            className="w-full text-xs font-semibold text-stone-900 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                          />
                        </div>
                      </td>

                      {/* UOM Dropdown */}
                      <td className="py-3 px-3 sm:px-4">
                        <select
                          value={item.uom}
                          onChange={(e) => onUpdateIngredient(item.id, 'uom', e.target.value as UOM)}
                          className="w-full text-xs font-semibold text-stone-800 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
                        >
                          {UOM_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Total Bulk Purchase Price (Rs) */}
                      <td className="py-3 px-3 sm:px-4">
                        <div className="relative flex items-center">
                          <span className="absolute left-2.5 text-stone-400 font-bold text-xs">Rs</span>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.bulkPrice}
                            onChange={(e) =>
                              onUpdateIngredient(
                                item.id,
                                'bulkPrice',
                                Math.max(0, parseFloat(e.target.value) || 0)
                              )
                            }
                            className="w-full pl-8 pr-2.5 py-1.5 text-xs font-bold text-stone-900 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                          />
                        </div>
                      </td>

                      {/* Calculated Unit Price Display */}
                      <td className="py-3 px-3 sm:px-4 bg-amber-50/50">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-amber-950 text-xs sm:text-sm font-mono">
                            {formatRs(unitPrice)}
                          </span>
                          <span className="text-stone-500 font-semibold text-[11px]">
                            / {uomLabel}
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                          ({item.bulkPrice} ÷ {item.bulkQuantity} {uomLabel})
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 sm:px-4 text-center">
                        <button
                          id={`delete-ing-${item.id}`}
                          onClick={() => onRemoveIngredient(item.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete ingredient from inventory"
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

        {/* Bottom bar with Add button */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onAddIngredient}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-[#78350f] hover:bg-[#92400e] text-white transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Another Ingredient Row</span>
          </button>

          <p className="text-xs text-stone-500 italic">
            Tip: Changes made to bulk purchase prices immediately update all batch recipes in Tab 2.
          </p>
        </div>
      </div>
    </div>
  );
};
