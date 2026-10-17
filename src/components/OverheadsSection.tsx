import React from 'react';
import { Plus, Trash2, Zap } from 'lucide-react';
import { IndirectCostItem } from '../types';
import { formatRs } from '../utils/scaler';

interface OverheadsSectionProps {
  overheads: IndirectCostItem[];
  multiplier: number;
  scaleOverheads: boolean;
  onUpdateOverhead: (id: string, field: keyof IndirectCostItem, value: any) => void;
  onAddOverhead: () => void;
  onRemoveOverhead: (id: string) => void;
}

export const OverheadsSection: React.FC<OverheadsSectionProps> = ({
  overheads,
  multiplier,
  scaleOverheads,
  onUpdateOverhead,
  onAddOverhead,
  onRemoveOverhead,
}) => {
  const overheadMult = scaleOverheads ? multiplier : 1;
  const totalBaseIndirect = overheads.reduce((sum, item) => sum + (Number(item.baseCost) || 0), 0);
  const totalScaledIndirect = totalBaseIndirect * overheadMult;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden mb-6">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-stone-50 via-amber-50/30 to-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-600/10 text-amber-800 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
                Section 3: Indirect Overheads
              </h2>
              <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                {overheads.length} items
              </span>
            </div>
            <p className="text-xs text-stone-500 font-normal">
              Utilities, equipment power, gas, and baker wage allocation per batch.
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-semibold text-stone-500">Scaled Indirect Cost</div>
          <div className="text-base font-extrabold text-amber-900">
            {formatRs(totalScaledIndirect)}
            <span className="text-xs font-normal text-stone-400 ml-1.5">
              ({scaleOverheads ? `${multiplier}x scaled` : 'Locked fixed'})
            </span>
          </div>
        </div>
      </div>

      {/* Body: Responsive Table */}
      <div className="p-4 sm:p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="pb-2.5 pl-2 font-semibold w-1/3">Expense Type (Free-Text)</th>
                <th className="pb-2.5 px-2 font-semibold w-5/12">Description / Notes</th>
                <th className="pb-2.5 px-2 font-semibold w-1/4">Base Cost (Rs) &amp; Scaled</th>
                <th className="pb-2.5 pr-2 text-center font-semibold w-12">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {overheads.map((ovh, idx) => {
                const scaledCost = (Number(ovh.baseCost) || 0) * overheadMult;

                return (
                  <tr key={ovh.id} className="hover:bg-amber-50/30 transition-colors group">
                    {/* Expense Type */}
                    <td className="py-2.5 pl-2 pr-2 align-top">
                      <input
                        id={`overhead-type-${idx}`}
                        type="text"
                        value={ovh.type}
                        onChange={(e) => onUpdateOverhead(ovh.id, 'type', e.target.value)}
                        placeholder="e.g., Electricity, Gas, Bass salary"
                        className="w-full text-xs sm:text-sm font-medium text-stone-800 bg-white border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                      />
                    </td>

                    {/* Description / Notes */}
                    <td className="py-2.5 px-2 align-top">
                      <input
                        id={`overhead-desc-${idx}`}
                        type="text"
                        value={ovh.description}
                        onChange={(e) => onUpdateOverhead(ovh.id, 'description', e.target.value)}
                        placeholder="e.g., Oven baking electricity, staff labor"
                        className="w-full text-xs sm:text-sm font-normal text-stone-700 bg-white border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                      />
                    </td>

                    {/* Cost in Rs */}
                    <td className="py-2.5 px-2 align-top">
                      <div className="flex flex-col gap-1">
                        <div className="relative">
                          <span className="absolute left-2.5 top-2 text-xs font-bold text-stone-400">Rs</span>
                          <input
                            id={`overhead-cost-${idx}`}
                            type="number"
                            min="0"
                            step="1"
                            value={ovh.baseCost || ''}
                            onChange={(e) =>
                              onUpdateOverhead(ovh.id, 'baseCost', parseFloat(e.target.value) || 0)
                            }
                            placeholder="0"
                            className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm font-bold text-stone-800 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                          />
                        </div>
                        {multiplier !== 1 && (
                          <div className="text-[11px] font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 w-fit">
                            {scaleOverheads ? `Scaled (${multiplier}x):` : 'Fixed:'}{' '}
                            <strong>{formatRs(scaledCost)}</strong>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-2.5 pr-2 pl-2 text-center align-top">
                      <button
                        type="button"
                        id={`remove-overhead-${idx}`}
                        onClick={() => onRemoveOverhead(ovh.id)}
                        className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-rose-100 text-stone-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                        title="Remove overhead"
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

        {/* Add Overhead Button */}
        <div className="mt-3.5 pt-2 border-t border-stone-100 flex items-center justify-between">
          <button
            id="add-overhead-btn"
            type="button"
            onClick={onAddOverhead}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-900 bg-amber-100/70 hover:bg-amber-200/70 border border-amber-300 rounded-lg transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Indirect Cost</span>
          </button>

          <span className="text-[11px] text-stone-400">
            Total Base Indirect: {formatRs(totalBaseIndirect)}
          </span>
        </div>
      </div>
    </div>
  );
};
