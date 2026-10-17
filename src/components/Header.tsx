import React from 'react';
import {
  ChefHat,
  RotateCcw,
  Printer,
  Download,
  Package,
  Calculator,
  CheckCircle2,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'inventory' | 'recipes';
  onTabChange: (tab: 'inventory' | 'recipes') => void;
  inventoryCount: number;
  currentRecipeName: string;
  netProfit: number;
  grossMargin: number;
  onResetDemo: () => void;
  onPrint: () => void;
  onDownloadStandalone: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  inventoryCount,
  currentRecipeName,
  netProfit,
  grossMargin,
  onResetDemo,
  onPrint,
  onDownloadStandalone,
}) => {
  const isProfitable = netProfit >= 0;

  return (
    <header className="mb-6 space-y-4">
      {/* Primary Brand Banner */}
      <div className="bg-gradient-to-br from-[#451a03] via-[#78350f] to-[#92400e] text-white p-5 sm:p-7 rounded-2xl shadow-xl shadow-amber-950/20 border border-amber-800/40 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-48 h-48 bg-amber-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Brand Identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-300/30 flex items-center justify-center text-amber-200 shadow-inner">
              <ChefHat className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white font-['Outfit',sans-serif]">
                  Tenzo Cafe and Bakers
                </h1>
                <span className="bg-amber-100 text-[#78350f] text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                  Enterprise BMS
                </span>
              </div>
              <p className="text-amber-100/90 text-xs sm:text-sm mt-0.5 font-medium font-['Plus_Jakarta_Sans',sans-serif]">
                Enterprise Bakery Management System • Master Purchase Database &amp; Recipe Batch Engine
              </p>
            </div>
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="reset-bms-btn"
              onClick={onResetDemo}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
              title="Reset data to standard Tenzo bakery demo catalog"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              id="print-sheet-btn"
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
              title="Print kitchen production card"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Kitchen Sheet</span>
            </button>

            <button
              id="download-standalone-html-btn"
              onClick={onDownloadStandalone}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-amber-950 border border-amber-300 transition-all shadow-md shadow-amber-950/20 cursor-pointer"
              title="Download standalone single-file HTML file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Standalone HTML</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2-TAB NAVIGATION SYSTEM BAR */}
      <nav className="bg-white rounded-2xl border border-stone-200/90 p-1.5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {/* Tab 1 Button */}
          <button
            id="nav-tab-inventory"
            onClick={() => onTabChange('inventory')}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-[#78350f] text-white shadow-md shadow-amber-950/20'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Tab 1: Master Ingredient Inventory</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'inventory'
                  ? 'bg-amber-200 text-amber-950'
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              {inventoryCount} Items
            </span>
          </button>

          {/* Tab 2 Button */}
          <button
            id="nav-tab-recipes"
            onClick={() => onTabChange('recipes')}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'recipes'
                ? 'bg-[#78350f] text-white shadow-md shadow-amber-950/20'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Tab 2: Recipe Costing &amp; Profit Calculator</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'recipes'
                  ? isProfitable
                    ? 'bg-emerald-300 text-emerald-950'
                    : 'bg-rose-300 text-rose-950'
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              {isProfitable ? '+' : ''}
              {grossMargin.toFixed(0)}% Margin
            </span>
          </button>
        </div>

        {/* Live sync badge */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-stone-500 pr-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium">Live Two-Way Reactive Sync</span>
        </div>
      </nav>
    </header>
  );
};
