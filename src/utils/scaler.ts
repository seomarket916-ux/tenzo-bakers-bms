import { IngredientItem, IndirectCostItem, BatchOutcomeConfig, RecipePreset } from '../types';

/**
 * Intelligently scales numbers inside a free-text quantity string.
 * Examples:
 * "1.5 kg" with multiplier 2 -> "3 kg"
 * "500 g" with multiplier 2 -> "1000 g"
 * "4 eggs" with multiplier 2 -> "8 eggs"
 * "1/2 tsp" with multiplier 2 -> "1 tsp"
 * "2.5 tbsp" with multiplier 0.5 -> "1.25 tbsp"
 */
export function scaleQuantityText(baseQty: string, multiplier: number): string {
  if (!baseQty || multiplier === 1) return baseQty;

  let text = baseQty;

  // First handle simple fractions like 1/2, 3/4, 1/4
  text = text.replace(/(\d+)\/(\d+)/g, (_, numStr, denStr) => {
    const num = parseFloat(numStr);
    const den = parseFloat(denStr);
    if (isNaN(num) || isNaN(den) || den === 0) return `${numStr}/${denStr}`;
    const val = (num / den) * multiplier;
    return formatScaledNumber(val);
  });

  // Then handle decimal and integer numbers
  // Matches standalone or bordered numbers
  text = text.replace(/(^|[^0-9./])(\d+(?:\.\d+)?)(?=$|[^0-9./])/g, (match, prefix, numStr) => {
    const num = parseFloat(numStr);
    if (isNaN(num)) return match;
    const scaled = num * multiplier;
    return `${prefix}${formatScaledNumber(scaled)}`;
  });

  return text;
}

export function formatScaledNumber(val: number): string {
  if (Number.isInteger(val)) {
    return val.toString();
  }
  // Max 2 decimals, strip trailing zeroes
  const rounded = parseFloat(val.toFixed(2));
  return rounded.toString();
}

export function formatRs(amount: number): string {
  if (isNaN(amount)) return 'Rs 0';
  const isNeg = amount < 0;
  const absVal = Math.abs(amount);
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(absVal) ? 0 : 2,
  }).format(absVal);
  return `${isNeg ? '- ' : ''}Rs ${formatted}`;
}

export function formatPercent(margin: number): string {
  if (isNaN(margin) || !isFinite(margin)) return '0.0%';
  return `${margin.toFixed(1)}%`;
}

export const DEFAULT_DEMO_INGREDIENTS: IngredientItem[] = [
  {
    id: 'ing-1',
    name: 'Wheat flour',
    baseQty: '1.5 kg',
    baseCost: 500,
  },
  {
    id: 'ing-2',
    name: 'Sugar',
    baseQty: '1.5 kg',
    baseCost: 450,
  },
  {
    id: 'ing-3',
    name: 'Beehive margarine',
    baseQty: '1.5 kg',
    baseCost: 1200,
  },
  {
    id: 'ing-4',
    name: 'Egg',
    baseQty: '1.5 kg',
    baseCost: 900,
  },
];

export const DEFAULT_DEMO_OVERHEADS: IndirectCostItem[] = [
  {
    id: 'ovh-1',
    type: 'Electricity',
    description: 'Baking ovens & mixer electricity',
    baseCost: 200,
  },
  {
    id: 'ovh-2',
    type: 'Gas',
    description: 'Commercial oven LPG gas consumption',
    baseCost: 150,
  },
  {
    id: 'ovh-3',
    type: 'Bass salary',
    description: 'Baker & kitchen helper wages allocation',
    baseCost: 300,
  },
];

export const DEFAULT_DEMO_OUTCOME: BatchOutcomeConfig = {
  unitType: 'kg',
  baseQuantity: 6,
  pricePerUnit: 1200,
};

export const RECIPE_PRESETS: RecipePreset[] = [
  {
    id: 'preset-cake',
    name: 'Cake (Standard Sponge)',
    category: 'Cakes',
    ingredients: DEFAULT_DEMO_INGREDIENTS,
    indirectCosts: DEFAULT_DEMO_OVERHEADS,
    outcome: DEFAULT_DEMO_OUTCOME,
  },
  {
    id: 'preset-croissants',
    name: 'Butter Croissants Batch',
    category: 'Pastry',
    ingredients: [
      { id: 'cro-1', name: 'High-Protein Flour', baseQty: '2 kg', baseCost: 650 },
      { id: 'cro-2', name: 'French Cultured Butter', baseQty: '1.2 kg', baseCost: 1800 },
      { id: 'cro-3', name: 'Whole Milk', baseQty: '800 ml', baseCost: 180 },
      { id: 'cro-4', name: 'Instant Yeast & Salt', baseQty: '60 g', baseCost: 90 },
      { id: 'cro-5', name: 'Granulated Sugar', baseQty: '200 g', baseCost: 80 },
    ],
    indirectCosts: [
      { id: 'cro-ov-1', type: 'Chiller Electricity', description: 'Lamination proofing chill', baseCost: 250 },
      { id: 'cro-ov-2', type: 'Convection Oven Gas', description: 'Steam injection baking', baseCost: 220 },
      { id: 'cro-ov-3', type: 'Pastry Chef Labor', description: 'Rolling & shaping hours', baseCost: 450 },
    ],
    outcome: {
      unitType: 'pcs',
      baseQuantity: 30,
      pricePerUnit: 250,
    },
  },
  {
    id: 'preset-sourdough',
    name: 'Rustic Sourdough Boules',
    category: 'Bread',
    ingredients: [
      { id: 'sou-1', name: 'Organic Bread Flour', baseQty: '3 kg', baseCost: 850 },
      { id: 'sou-2', name: 'Whole Rye Flour', baseQty: '500 g', baseCost: 220 },
      { id: 'sou-3', name: 'Active Sourdough Starter', baseQty: '700 g', baseCost: 150 },
      { id: 'sou-4', name: 'Fine Sea Salt', baseQty: '70 g', baseCost: 40 },
    ],
    indirectCosts: [
      { id: 'sou-ov-1', type: 'Deck Oven Electricity', description: 'High temp stone baking', baseCost: 320 },
      { id: 'sou-ov-2', type: 'Water & Proofing Gas', description: 'Steam boiler heating', baseCost: 110 },
      { id: 'sou-ov-3', type: 'Artisan Baker Wage', description: 'Long fermentation care', baseCost: 350 },
    ],
    outcome: {
      unitType: 'loaves',
      baseQuantity: 5,
      pricePerUnit: 600,
    },
  },
  {
    id: 'preset-brownies',
    name: 'Belgian Fudge Brownies',
    category: 'Sweets',
    ingredients: [
      { id: 'brw-1', name: '70% Dark Chocolate Callets', baseQty: '1 kg', baseCost: 1600 },
      { id: 'brw-2', name: 'Pure Butter', baseQty: '800 g', baseCost: 1100 },
      { id: 'brw-3', name: 'Caster Sugar & Brown Sugar', baseQty: '1.2 kg', baseCost: 380 },
      { id: 'brw-4', name: 'Fresh Farm Eggs', baseQty: '12 pcs', baseCost: 360 },
      { id: 'brw-5', name: 'Cocoa Powder & Flour', baseQty: '600 g', baseCost: 420 },
    ],
    indirectCosts: [
      { id: 'brw-ov-1', type: 'Oven Energy', description: 'Electric deck heat', baseCost: 180 },
      { id: 'brw-ov-2', type: 'Packaging & Parchment', description: 'Portion boxes & stickers', baseCost: 200 },
      { id: 'brw-ov-3', type: 'Kitchen Wages', description: 'Mixing & cutting labor', baseCost: 280 },
    ],
    outcome: {
      unitType: 'boxes',
      baseQuantity: 12,
      pricePerUnit: 650,
    },
  },
];
