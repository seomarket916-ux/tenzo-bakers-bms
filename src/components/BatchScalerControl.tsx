import React from 'react';
import { Gauge, Sliders, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';

interface BatchScalerControlProps {
  multiplier: number;
  onMultiplierChange: (multiplier: number) => void;
  scaleOverheads: boolean;
  onToggleScaleOverheads: (val: boolean) => void;
}

const PRESET_SCALES = [
  { label: '0.5x Half Batch', value: 0.5 },
  { label: '1x Standard', value: 1.0 },
  { label: '1.5x', value: 1.5 },
  { label: '2x Double Batch', value: 2.0 },
  { label: '3x Triple Batch', value: 3.0 },
];

export const BatchScalerControl: React.FC<BatchScalerControlProps> = ({
  multiplier,
  onMultiplierChange,
  scaleOverheads,
  onToggleScaleOverheads,
}) => {
  return (
    <div className="bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 border border-amber-300/80 rounded-xl p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-900 flex items-center justify-center font-bold">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
              Batch Multiplier &amp; Scaling Control Bar
              <span className="bg-amber-200/90 text-amber-900 text-xs px-2 py-0.5 rounded-md font-extrabold border border-amber-300">
                {multiplier}x Active
              </span>
            </h3>
            <p className="text-[11px] text-amber-800/80 font-medium">
              Ingredient costs, text quantities, and batch yields scale dynamically in real time.
            </p>
          </div>
        </div>

        {/* Proportional vs Fixed Overheads Toggle */}
        <button
          type="button"
          onClick={() => onToggleScaleOverheads(!scaleOverheads)}
          className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
            scaleOverheads
              ? 'bg-amber-200/90 text-amber-950 border-amber-400 shadow-sm'
              : 'bg-white text-stone-600 border-stone-300'
          }`}
          title="Toggle whether utility & labor overheads scale with the batch multiplier or remain fixed"
        >
          {scaleOverheads ? (
            <ToggleRight className="w-4 h-4 text-amber-800" />
          ) : (
            <ToggleLeft className="w-4 h-4 text-stone-400" />
          )}
          <span>
            {scaleOverheads ? 'Overheads: Proportional' : 'Overheads: Fixed'}
          </span>
        </button>
      </div>

      {/* Preset Buttons & Custom Input */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {PRESET_SCALES.map((preset) => {
          const isSelected = Math.abs(multiplier - preset.value) < 0.001;
          return (
            <button
              key={preset.value}
              id={`scale-btn-${preset.value}`}
              type="button"
              onClick={() => onMultiplierChange(preset.value)}
              className={`text-xs font-bold px-3.5 py-2 rounded-lg transition-all shadow-sm cursor-pointer ${
                isSelected
                  ? 'bg-amber-800 text-white shadow-md shadow-amber-900/20 ring-2 ring-amber-600 scale-[1.02]'
                  : 'bg-white hover:bg-amber-100/80 text-amber-900 border border-amber-300 hover:border-amber-400'
              }`}
            >
              {preset.label}
            </button>
          );
        })}

        {/* Custom Multiplier Input */}
        <div className="flex items-center bg-white border border-amber-300 rounded-lg px-2.5 py-1 shadow-sm focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500">
          <span className="text-xs font-bold text-amber-900 mr-1.5">Custom:</span>
          <input
            id="custom-multiplier-input"
            type="number"
            min="0.05"
            max="100"
            step="0.1"
            value={multiplier}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val) && val > 0) {
                onMultiplierChange(val);
              }
            }}
            className="w-16 text-xs font-bold text-amber-950 text-center focus:outline-none"
            placeholder="1.0"
          />
          <span className="text-xs font-bold text-amber-800 ml-0.5">x</span>
        </div>

        {/* Quick Fine-Tuning Multiplier Steppers */}
        <div className="hidden sm:flex items-center gap-1 bg-white border border-amber-200 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => onMultiplierChange(Math.max(0.1, parseFloat((multiplier - 0.1).toFixed(2))))}
            className="text-xs font-bold px-2 py-1 text-stone-600 hover:bg-amber-50 rounded"
            title="Decrease multiplier by 0.1x"
          >
            -0.1x
          </button>
          <button
            type="button"
            onClick={() => onMultiplierChange(parseFloat((multiplier + 0.1).toFixed(2)))}
            className="text-xs font-bold px-2 py-1 text-stone-600 hover:bg-amber-50 rounded"
            title="Increase multiplier by 0.1x"
          >
            +0.1x
          </button>
        </div>
      </div>
    </div>
  );
};
