import React from 'react';
import { TrendingUp, TrendingDown, Wheat, Zap, ShoppingBag, DollarSign, PieChart } from 'lucide-react';
import { CalculationBreakdown } from '../types';
import { formatRs, formatPercent } from '../utils/scaler';

interface SummaryCardsProps {
  calc: CalculationBreakdown;
  unitType: string;
  baseOutcomeQty: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  calc,
  unitType,
  baseOutcomeQty,
}) => {
  const isProfitable = calc.netProfit >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-6">
      {/* 1. Scaled Direct Cost */}
      <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-sm hover:border-amber-300 transition-colors">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
          <span>Scaled Direct</span>
          <Wheat className="w-3.5 h-3.5 text-amber-700" />
        </div>
        <div className="text-xl font-bold text-stone-900 tracking-tight">
          {formatRs(calc.scaledDirectCost)}
        </div>
        <div className="text-[11px] text-stone-500 mt-1 font-medium">
          Base: {formatRs(calc.scaledDirectCost / (calc.multiplier || 1))} @ 1x
        </div>
      </div>

      {/* 2. Scaled Indirect Cost */}
      <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-sm hover:border-amber-300 transition-colors">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
          <span>Scaled Overheads</span>
          <Zap className="w-3.5 h-3.5 text-amber-700" />
        </div>
        <div className="text-xl font-bold text-stone-900 tracking-tight">
          {formatRs(calc.scaledIndirectCost)}
        </div>
        <div className="text-[11px] text-stone-500 mt-1 font-medium">
          {calc.scaleOverheads ? 'Proportional scaling' : 'Fixed overhead locked'}
        </div>
      </div>

      {/* 3. Total Production Cost */}
      <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-sm hover:border-amber-300 transition-colors">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
          <span>Total Cost</span>
          <DollarSign className="w-3.5 h-3.5 text-stone-600" />
        </div>
        <div className="text-xl font-bold text-stone-900 tracking-tight">
          {formatRs(calc.totalProductionCost)}
        </div>
        <div className="text-[11px] text-stone-500 mt-1 font-medium">
          Cost / {unitType || 'unit'}: {formatRs(calc.costPerUnit)}
        </div>
      </div>

      {/* 4. Total Outcome Value (Revenue) */}
      <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-sm hover:border-amber-300 transition-colors">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
          <span>Outcome Revenue</span>
          <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <div className="text-xl font-bold text-emerald-700 tracking-tight">
          {formatRs(calc.totalOutcomeValue)}
        </div>
        <div className="text-[11px] text-stone-500 mt-1 font-medium">
          Yield: {calc.scaledOutcomeQty} {unitType} (Base: {baseOutcomeQty})
        </div>
      </div>

      {/* 5. Net Profit (Color Coded: Green or Red) */}
      <div
        className={`rounded-xl p-4 border shadow-sm transition-all sm:col-span-2 lg:col-span-1 ${
          isProfitable
            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
            : 'bg-rose-50/70 border-rose-300 text-rose-950'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider mb-1">
          <span className="flex items-center gap-1">
            {isProfitable ? 'Net Profit' : 'Net Loss'}
          </span>
          <span
            className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
              isProfitable ? 'bg-emerald-200/80 text-emerald-900' : 'bg-rose-200/80 text-rose-900'
            }`}
          >
            {formatPercent(calc.netMarginPercent)}
          </span>
        </div>
        <div
          className={`text-xl font-extrabold tracking-tight flex items-center gap-1.5 ${
            isProfitable ? 'text-emerald-700' : 'text-rose-700'
          }`}
        >
          {isProfitable ? (
            <TrendingUp className="w-5 h-5 flex-shrink-0" />
          ) : (
            <TrendingDown className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{formatRs(calc.netProfit)}</span>
        </div>
        <div className="text-[11px] font-medium mt-1 opacity-80">
          {isProfitable ? 'Gain' : 'Loss'} / {unitType || 'unit'}: {formatRs(calc.profitPerUnit)}
        </div>
      </div>
    </div>
  );
};
