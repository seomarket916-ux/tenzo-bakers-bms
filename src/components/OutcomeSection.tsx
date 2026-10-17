import React from 'react';
import { ShoppingBag, TrendingUp, TrendingDown, Layers, Calculator, CheckCircle2, AlertTriangle } from 'lucide-react';
import { BatchOutcomeConfig, CalculationBreakdown } from '../types';
import { formatRs, formatPercent, formatScaledNumber } from '../utils/scaler';

interface OutcomeSectionProps {
  outcome: BatchOutcomeConfig;
  multiplier: number;
  calc: CalculationBreakdown;
  onUpdateOutcome: (field: keyof BatchOutcomeConfig, value: any) => void;
}

export const OutcomeSection: React.FC<OutcomeSectionProps> = ({
  outcome,
  multiplier,
  calc,
  onUpdateOutcome,
}) => {
  const isProfitable = calc.netProfit >= 0;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden mb-6">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-stone-50 via-amber-50/30 to-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-700 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif]">
              Section 4: Batch Outcome &amp; Selling Setup
            </h2>
            <p className="text-xs text-stone-500 font-normal">
              Specify the batch yield output and unit selling price to calculate revenue and net profit.
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-semibold text-stone-500">Total Outcome Value (Revenue)</div>
          <div className="text-base font-extrabold text-emerald-700">
            {formatRs(calc.totalOutcomeValue)}
          </div>
        </div>
      </div>

      {/* Body: 3-column input configuration */}
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {/* Outcome Unit Type */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="outcome-unit-type" className="text-xs font-bold text-stone-700">
              Outcome Unit Type (Free-Text)
            </label>
            <input
              id="outcome-unit-type"
              type="text"
              value={outcome.unitType}
              onChange={(e) => onUpdateOutcome('unitType', e.target.value)}
              placeholder="e.g., kg, pcs, loaves, boxes"
              className="text-xs sm:text-sm font-semibold text-stone-800 bg-white border border-stone-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            />
            <span className="text-[11px] text-stone-400">
              Units produced (e.g. "kg", "pcs", "boxes")
            </span>
          </div>

          {/* Base Outcome Quantity */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="outcome-base-quantity" className="text-xs font-bold text-stone-700">
              Total Base Outcome Qty (1x Batch)
            </label>
            <div className="relative">
              <input
                id="outcome-base-quantity"
                type="number"
                min="0.01"
                step="0.1"
                value={outcome.baseQuantity || ''}
                onChange={(e) => onUpdateOutcome('baseQuantity', parseFloat(e.target.value) || 0)}
                placeholder="6"
                className="w-full text-xs sm:text-sm font-bold text-stone-800 bg-white border border-stone-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200 w-fit">
              <Layers className="w-3 h-3" />
              <span>
                Scaled Yield: <strong>{formatScaledNumber(calc.scaledOutcomeQty)} {outcome.unitType || 'units'}</strong>
              </span>
            </div>
          </div>

          {/* Selling Price Per Unit */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="outcome-price-per-unit" className="text-xs font-bold text-stone-700">
              Selling Price Per Unit (Rs / {outcome.unitType || 'unit'})
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs font-bold text-stone-400">Rs</span>
              <input
                id="outcome-price-per-unit"
                type="number"
                min="0"
                step="1"
                value={outcome.pricePerUnit || ''}
                onChange={(e) => onUpdateOutcome('pricePerUnit', parseFloat(e.target.value) || 0)}
                placeholder="1200"
                className="w-full pl-8 pr-3 py-2.5 text-xs sm:text-sm font-bold text-stone-800 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
            </div>
            <span className="text-[11px] text-stone-400">
              Target selling price charged to customer
            </span>
          </div>
        </div>

        {/* Highlight Live Net Profit Banner */}
        <div
          id="profit-highlight-banner"
          className={`rounded-2xl p-5 sm:p-6 transition-all shadow-md ${
            isProfitable
              ? 'bg-gradient-to-br from-[#14532d] via-[#166534] to-[#15803d] text-white shadow-emerald-950/20'
              : 'bg-gradient-to-br from-[#7f1d1d] via-[#991b1b] to-[#dc2626] text-white shadow-rose-950/20'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                {isProfitable ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-200" />
                )}
                <span className="text-xs font-bold tracking-wider uppercase text-emerald-100/90">
                  {isProfitable ? 'Net Profit Outcome (Batch Scaled)' : 'Net Loss Alert (Unprofitable Batch)'}
                </span>
                <span className="bg-white/20 text-white text-[11px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {multiplier}x Batch Scale
                </span>
              </div>

              <div className="text-3xl sm:text-4xl font-black tracking-tight flex items-baseline gap-2">
                <span>{formatRs(calc.netProfit)}</span>
                <span className="text-sm font-semibold opacity-85">
                  {isProfitable ? 'Net Gain' : 'Net Loss'}
                </span>
              </div>

              <div className="text-xs sm:text-sm font-medium opacity-90 mt-2 flex flex-wrap items-center gap-2">
                <span>Total Revenue: <strong>{formatRs(calc.totalOutcomeValue)}</strong></span>
                <span>•</span>
                <span>Total Production Cost: <strong>{formatRs(calc.totalProductionCost)}</strong></span>
              </div>
            </div>

            {/* Metrics Breakdown right side */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-black/15 p-3.5 rounded-xl border border-white/15 backdrop-blur-xs">
              <div>
                <div className="text-[11px] uppercase tracking-wider opacity-75 font-semibold">
                  Net Margin
                </div>
                <div className="text-xl sm:text-2xl font-extrabold mt-0.5">
                  {formatPercent(calc.netMarginPercent)}
                </div>
                <div className="text-[10px] opacity-75 font-medium">Profit % of Revenue</div>
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-wider opacity-75 font-semibold">
                  Cost / {outcome.unitType || 'Unit'}
                </div>
                <div className="text-lg sm:text-xl font-bold mt-0.5">
                  {formatRs(calc.costPerUnit)}
                </div>
                <div className="text-[10px] opacity-75 font-medium">Production break-even</div>
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-wider opacity-75 font-semibold">
                  {isProfitable ? 'Profit' : 'Loss'} / {outcome.unitType || 'Unit'}
                </div>
                <div className="text-lg sm:text-xl font-bold mt-0.5">
                  {formatRs(calc.profitPerUnit)}
                </div>
                <div className="text-[10px] opacity-75 font-medium">Per scaled unit</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
